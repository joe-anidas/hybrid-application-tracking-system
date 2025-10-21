import express from 'express'
import Job from '../models/Job.js'
import { authenticateToken } from '../middleware/auth.js'
import { createAuditLog, getClientIp } from '../utils/auditLogger.js'

const router = express.Router()

// Create a new job posting (Admin only)
router.post('/create', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create job postings'
      })
    }

    const {
      title,
      department,
      location,
      type,
      jobType,
      level,
      description,
      requirements,
      responsibilities,
      salaryMin,
      salaryMax,
      applicationDeadline,
      skills,
      benefits
    } = req.body

    // Validate required fields
    if (!title || !department || !location || !description || !requirements || !responsibilities) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
    }

    // Create new job
    const job = new Job({
      title,
      department,
      location,
      type: type || 'full-time',
      jobType: jobType || 'technical',
      level: level || 'mid',
      description,
      requirements,
      responsibilities,
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      salaryMax: salaryMax ? Number(salaryMax) : undefined,
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined,
      skills: Array.isArray(skills) ? skills : [],
      benefits,
      createdBy: req.user.id
    })

    const savedJob = await job.save()
    
    // Populate the createdBy field for response
    await savedJob.populate('createdBy', 'name email')

    // Create audit log for job creation
    await createAuditLog({
      userId: req.user.id,
      userName: req.user.name,
      userRole: 'Admin',
      action: 'JOB_CREATED',
      actionDescription: `${req.user.name} (Admin) created job: ${title}`,
      targetType: 'Job',
      targetId: savedJob._id,
      targetName: title,
      ipAddress: getClientIp(req),
      metadata: {
        department,
        location,
        type,
        jobType,
        level
      }
    })

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      job: savedJob
    })

  } catch (error) {
    console.error('Error creating job:', error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      })
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get all job postings
router.get('/all', async (req, res) => {
  try {
    const { status, jobType, department, page = 1, limit = 10 } = req.query
    
    // Build filter object
    const filter = {}
    if (status) filter.status = status
    if (jobType) filter.jobType = jobType
    if (department) filter.department = department

    const skip = (page - 1) * limit
    
    const jobs = await Job.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    const total = await Job.countDocuments(filter)

    res.json({
      success: true,
      jobs,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / limit),
        count: jobs.length,
        totalJobs: total
      }
    })

  } catch (error) {
    console.error('Error fetching jobs:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get a single job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('createdBy', 'name email')
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    res.json({
      success: true,
      job
    })

  } catch (error) {
    console.error('Error fetching job:', error)
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Update job posting (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update job postings'
      })
    }

    const job = await Job.findById(req.params.id)
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    // Store old title for audit log
    const oldTitle = job.title

    // Update job with new data
    Object.assign(job, req.body)
    
    const updatedJob = await job.save()
    await updatedJob.populate('createdBy', 'name email')

    // Create audit log for job update
    await createAuditLog({
      userId: req.user.id,
      userName: req.user.name,
      userRole: 'Admin',
      action: 'JOB_UPDATED',
      actionDescription: `${req.user.name} (Admin) updated job: ${updatedJob.title}`,
      targetType: 'Job',
      targetId: updatedJob._id,
      targetName: updatedJob.title,
      ipAddress: getClientIp(req),
      metadata: {
        oldTitle,
        newTitle: updatedJob.title,
        department: updatedJob.department,
        location: updatedJob.location,
        status: updatedJob.status
      }
    })

    res.json({
      success: true,
      message: 'Job updated successfully',
      job: updatedJob
    })

  } catch (error) {
    console.error('Error updating job:', error)
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      })
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Delete job posting (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete job postings'
      })
    }

    const job = await Job.findById(req.params.id)
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    // Store job details for audit log before deletion
    const jobTitle = job.title
    const jobId = job._id

    await Job.findByIdAndDelete(req.params.id)

    // Create audit log for job deletion
    await createAuditLog({
      userId: req.user.id,
      userName: req.user.name,
      userRole: 'Admin',
      action: 'JOB_DELETED',
      actionDescription: `${req.user.name} (Admin) deleted job: ${jobTitle}`,
      targetType: 'Job',
      targetId: jobId,
      targetName: jobTitle,
      ipAddress: getClientIp(req),
      metadata: {
        deletedTitle: jobTitle,
        department: job.department,
        location: job.location
      }
    })

    res.json({
      success: true,
      message: 'Job deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting job:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router