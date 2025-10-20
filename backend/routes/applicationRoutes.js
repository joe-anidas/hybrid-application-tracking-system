import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import Application from '../models/Application.js'
import ApplicantProfile from '../models/ApplicantProfile.js'
import Job from '../models/Job.js'
import { authenticateToken } from '../middleware/auth.js'

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
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      applications
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
      .populate('job', 'title department location company salaryRange')
      .populate('profile')
      .sort({ submittedAt: -1 })

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

    const { status } = req.body

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      })
    }

    const validStatuses = ['submitted', 'under-review', 'shortlisted', 'accepted', 'rejected']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      })
    }

    const application = await Application.findById(req.params.id)

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      })
    }

    application.status = status
    await application.save()

    await application.populate([
      { path: 'applicant', select: 'name email' },
      { path: 'job', select: 'title department location' },
      { path: 'profile' }
    ])

    res.json({
      success: true,
      message: 'Application status updated successfully',
      application
    })

  } catch (error) {
    console.error('Error updating application status:', error)
    
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

export default router