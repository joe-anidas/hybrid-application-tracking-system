import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import Application from '../models/Application.js'
import ApplicantProfile from '../models/ApplicantProfile.js'
import Job from '../models/Job.js'
import { authenticateToken } from '../middleware/auth.js'
import { createAuditLog, getClientIp } from '../utils/auditLogger.js'

const router = express.Router()

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/resumes')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /pdf|doc|docx/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype) || 
                     file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    
    if (extname && mimetype) {
      return cb(null, true)
    } else {
      cb(new Error('Only PDF and Word documents are allowed'))
    }
  }
})

// Submit job application
router.post('/submit', authenticateToken, upload.single('resume'), async (req, res) => {
  try {
    // Check if user is applicant
    if (req.user.role !== 'Applicant') {
      return res.status(403).json({
        success: false,
        message: 'Only applicants can submit applications'
      })
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required'
      })
    }

    const {
      jobId,
      coverLetter,
      whyInterested,
      relevantExperience,
      availableStartDate,
      salaryExpectation
    } = req.body

    // Validate required fields
    if (!jobId || !coverLetter || !whyInterested || !relevantExperience || !availableStartDate) {
      // Delete uploaded file if validation fails
      fs.unlinkSync(req.file.path)
      
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
    }

    // Check if job exists
    const job = await Job.findById(jobId)
    if (!job) {
      fs.unlinkSync(req.file.path)
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    // Check if applicant has a profile
    const profile = await ApplicantProfile.findOne({ user: req.user.id })
    if (!profile) {
      fs.unlinkSync(req.file.path)
      return res.status(400).json({
        success: false,
        message: 'Please complete your profile before applying'
      })
    }

    // Check if user has already applied for this job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id
    })

    if (existingApplication) {
      fs.unlinkSync(req.file.path)
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      })
    }

    // Create new application
    const application = new Application({
      job: jobId,
      applicant: req.user.id,
      profile: profile._id,
      coverLetter,
      whyInterested,
      relevantExperience,
      availableStartDate,
      salaryExpectation: salaryExpectation ? Number(salaryExpectation) : undefined,
      resumeUrl: `/uploads/resumes/${req.file.filename}`,
      resumeFileName: req.file.originalname
    })

    await application.save()

    // Update job applicants count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicants: 1 }
    })

    // Populate references
    await application.populate([
      { path: 'job', select: 'title department location' },
      { path: 'applicant', select: 'name email' },
      { path: 'profile' }
    ])

    // Create audit log for application submission
    await createAuditLog({
      userId: req.user.id,
      userName: req.user.name,
      userRole: 'Applicant',
      action: 'APPLICATION_SUBMITTED',
      actionDescription: `${req.user.name} (Applicant) submitted application for ${job.title}`,
      targetType: 'Application',
      targetId: application._id,
      targetName: `${req.user.name} - ${job.title}`,
      ipAddress: getClientIp(req),
      metadata: {
        jobId: job._id,
        jobTitle: job.title,
        department: job.department,
        resumeFileName: req.file.originalname
      }
    })

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    })

  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path)
    }
    
    console.error('Error submitting application:', error)
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      })
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get applicant's own applications
router.get('/my-applications', authenticateToken, async (req, res) => {
  try {
    // Check if user is applicant
    if (req.user.role !== 'Applicant') {
      return res.status(403).json({
        success: false,
        message: 'Only applicants can view applications'
      })
    }

    const applications = await Application.find({ applicant: req.user.id })
      .populate('job', 'title department location type jobType status')
      .populate('profile')
      .sort({ createdAt: -1 })

    // For each application, get the actual applicant count for that job
    const applicationsWithCounts = await Promise.all(
      applications.map(async (app) => {
        if (app.job) {
          const applicantCount = await Application.countDocuments({ 
            job: app.job._id 
          })
          // Add applicants count to the job object
          app.job = {
            ...app.job.toObject(),
            applicants: applicantCount
          }
        }
        return app
      })
    )

    res.json({
      success: true,
      applications: applicationsWithCounts
    })

  } catch (error) {
    console.error('Error fetching applications:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get a specific application
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('applicant', 'name email')
      .populate('profile')

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      })
    }

    // Check if user has permission to view this application
    if (req.user.role === 'Applicant' && application.applicant._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this application'
      })
    }

    res.json({
      success: true,
      application
    })

  } catch (error) {
    console.error('Error fetching application:', error)
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid application ID'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Withdraw application
router.put('/:id/withdraw', authenticateToken, async (req, res) => {
  try {
    // Check if user is applicant
    if (req.user.role !== 'Applicant') {
      return res.status(403).json({
        success: false,
        message: 'Only applicants can withdraw applications'
      })
    }

    const application = await Application.findById(req.params.id)

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      })
    }

    // Check if user owns this application
    if (application.applicant.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to withdraw this application'
      })
    }

    // Check if application can be withdrawn
    if (application.status === 'withdrawn') {
      return res.status(400).json({
        success: false,
        message: 'Application is already withdrawn'
      })
    }

    if (application.status === 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw an accepted application'
      })
    }

    application.status = 'withdrawn'
    await application.save()

    // Decrement job applicants count
    await Job.findByIdAndUpdate(application.job, {
      $inc: { applicants: -1 }
    })

    res.json({
      success: true,
      message: 'Application withdrawn successfully',
      application
    })

  } catch (error) {
    console.error('Error withdrawing application:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get all applications for a job (Admin only)
router.get('/job/:jobId', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view job applications'
      })
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email')
      .populate('profile')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      applications
    })

  } catch (error) {
    console.error('Error fetching job applications:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get all applications (Admin only)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view all applications'
      })
    }

    const { status, jobId } = req.query
    const filter = {}

    if (status) {
      filter.status = status
    }

    if (jobId) {
      filter.job = jobId
    }

    const applications = await Application.find(filter)
      .populate('applicant', 'name email')
      .populate('job', 'title department location company salaryRange jobType type')
      .populate('profile')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      applications,
      count: applications.length
    })

  } catch (error) {
    console.error('Error fetching all applications:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Update application status (Admin only)
router.put('/admin/:id/status', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update application status'
      })
    }

    const { status, notes } = req.body

    // At least one field should be provided
    if (!status && notes === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Status or notes is required'
      })
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['submitted', 'under-review', 'shortlisted', 'accepted', 'rejected']
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value'
        })
      }
    }

    const application = await Application.findById(req.params.id)
      .populate('applicant', 'name email')
      .populate('job', 'title department location type')

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      })
    }

    // Store previous status for audit log
    const previousStatus = application.status
    let statusChanged = false

    // Update fields if provided
    if (status && status !== application.status) {
      statusChanged = true
      // Record status change in history
      application.statusHistory.push({
        status: status,
        changedBy: req.user.id,
        changedByName: req.user.name || req.user.email,
        changedByRole: req.user.role,
        comment: notes || `Status changed to ${status}`,
        timestamp: new Date()
      })
      application.status = status
    }
    if (notes !== undefined) {
      application.notes = notes
    }
    
    await application.save()

    // Create audit log for status update
    if (statusChanged) {
      await createAuditLog({
        userId: req.user.id,
        userName: req.user.name,
        userRole: 'Admin',
        action: 'APPLICATION_STATUS_UPDATED',
        actionDescription: `${req.user.name} (Admin) updated application status from ${previousStatus} to ${status}`,
        targetType: 'Application',
        targetId: application._id,
        targetName: `${application.applicant.name} - ${application.job.title}`,
        ipAddress: getClientIp(req),
        metadata: {
          previousStatus,
          newStatus: status,
          applicantName: application.applicant.name,
          jobTitle: application.job.title,
          notes: notes || null
        }
      })
    }

    await application.populate('profile')

    res.json({
      success: true,
      message: 'Application updated successfully',
      application
    })
  } catch (error) {
    console.error('Error updating application status:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update application'
    })
  }
})

export default router