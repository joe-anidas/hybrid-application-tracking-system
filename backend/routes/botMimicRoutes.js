import express from 'express'
import Application from '../models/Application.js'
import Job from '../models/Job.js'
import { createAuditLog } from '../utils/auditLogger.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = express.Router()
const requireBotMimic = requireRole('Bot Mimic')

// Bot Mimic can only access this route
router.use(requireAuth)
router.use(requireBotMimic)

// Status progression workflow with probabilities
// Bot can progress through multiple paths:
// Path 1: submitted -> under-review -> rejected (20% chance from under-review)
// Path 2: submitted -> under-review -> shortlisted -> rejected (15% chance from shortlisted)
// Path 3: submitted -> under-review -> shortlisted -> accepted (main path)

const STATUS_WORKFLOW = {
  'submitted': ['under-review'],
  'under-review': ['shortlisted', 'rejected'], // 80% shortlisted, 20% rejected
  'shortlisted': ['accepted', 'rejected'] // 85% accepted, 15% rejected
}

// Rejection probability for each status
const REJECTION_PROBABILITY = {
  'under-review': 0.20, // 20% chance of rejection
  'shortlisted': 0.15   // 15% chance of rejection
}

// Bot-generated comments for each status transition
const BOT_COMMENTS = {
  'under-review': [
    'Application meets initial technical requirements. Moving to review phase.',
    'Technical skills align with job requirements. Proceeding with detailed review.',
    'Profile shows relevant experience. Advancing to next stage.',
    'Initial screening completed successfully. Moving forward.'
  ],
  'shortlisted': [
    'Technical assessment shows strong capabilities. Shortlisted for interview.',
    'Skills and experience match job criteria. Added to shortlist.',
    'Impressive technical background. Recommended for interview round.',
    'Qualifications exceed minimum requirements. Shortlisted for further evaluation.'
  ],
  'accepted': [
    'Candidate demonstrates excellent technical fit. Offer extended.',
    'Strong performance in all evaluation stages. Application accepted.',
    'Technical proficiency confirmed. Moving forward with offer.',
    'All criteria met successfully. Proceeding with acceptance.'
  ],
  'rejected': [
    'Technical skills do not meet current requirements. Application rejected.',
    'After careful review, position has been filled with another candidate.',
    'Experience level does not align with job requirements at this time.',
    'Unfortunately, we are moving forward with other candidates.',
    'Profile does not match the specific technical requirements for this role.',
    'Current skill set does not meet the minimum criteria. Application declined.',
    'Thank you for your interest. We have selected candidates with closer skill match.',
    'After thorough evaluation, we have decided to pursue other applicants.'
  ]
}

// Helper function to get random comment
const getRandomComment = (status) => {
  const comments = BOT_COMMENTS[status] || []
  return comments[Math.floor(Math.random() * comments.length)]
}

// Helper function to determine next status based on probability
const getNextStatus = (currentStatus) => {
  const possibleStatuses = STATUS_WORKFLOW[currentStatus]
  
  if (!possibleStatuses || possibleStatuses.length === 0) {
    return null
  }
  
  // If only one possible status, return it
  if (possibleStatuses.length === 1) {
    return possibleStatuses[0]
  }
  
  // Check if we should reject based on probability
  const rejectionChance = REJECTION_PROBABILITY[currentStatus] || 0
  const random = Math.random()
  
  if (random < rejectionChance) {
    // Find rejected in possible statuses
    return possibleStatuses.find(status => status === 'rejected') || possibleStatuses[0]
  }
  
  // Return the non-rejected status (progression path)
  return possibleStatuses.find(status => status !== 'rejected') || possibleStatuses[0]
}

// Helper function to add delay (simulate human-like behavior)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// GET /api/bot-mimic/stats - Get statistics for bot mimic dashboard
router.get('/stats', async (req, res) => {
  try {
    // Get all technical jobs
    const technicalJobs = await Job.find({ jobType: 'technical' })
    const technicalJobIds = technicalJobs.map(job => job._id)

    // Get applications for technical jobs only
    const totalApplications = await Application.countDocuments({ 
      job: { $in: technicalJobIds } 
    })

    const pendingApplications = await Application.countDocuments({ 
      job: { $in: technicalJobIds },
      status: { $in: ['submitted', 'under-review'] }
    })

    const processedToday = await Application.countDocuments({
      job: { $in: technicalJobIds },
      updatedAt: { 
        $gte: new Date(new Date().setHours(0, 0, 0, 0)) 
      },
      status: { $ne: 'submitted' }
    })

    const shortlisted = await Application.countDocuments({
      job: { $in: technicalJobIds },
      status: 'shortlisted'
    })

    const accepted = await Application.countDocuments({
      job: { $in: technicalJobIds },
      status: 'accepted'
    })

    const rejected = await Application.countDocuments({
      job: { $in: technicalJobIds },
      status: 'rejected'
    })

    // Get status breakdown
    const statusBreakdown = await Application.aggregate([
      { $match: { job: { $in: technicalJobIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    res.json({
      success: true,
      stats: {
        totalApplications,
        pendingApplications,
        processedToday,
        shortlisted,
        accepted,
        rejected,
        statusBreakdown
      }
    })
  } catch (error) {
    console.error('Error fetching bot mimic stats:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    })
  }
})

// GET /api/bot-mimic/applications - Get technical role applications
router.get('/applications', async (req, res) => {
  try {
    const { status } = req.query

    // Get all technical jobs
    const technicalJobs = await Job.find({ jobType: 'technical' })
    const technicalJobIds = technicalJobs.map(job => job._id)

    let query = { job: { $in: technicalJobIds } }
    
    if (status && status !== 'all') {
      query.status = status
    }

    const applications = await Application.find(query)
      .populate('applicant', 'name email')
      .populate('job', 'title department location type jobType')
      .populate('profile')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      applications
    })
  } catch (error) {
    console.error('Error fetching applications:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    })
  }
})

// POST /api/bot-mimic/process-single - Process single application
router.post('/process-single/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job', 'title jobType')
      .populate('applicant', 'name email')

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      })
    }

    // Check if job is technical
    if (application.job.jobType !== 'technical') {
      return res.status(400).json({
        success: false,
        message: 'Bot Mimic only processes technical role applications'
      })
    }

    // Check if can be progressed
    const nextStatus = getNextStatus(application.status)
    if (!nextStatus) {
      return res.status(400).json({
        success: false,
        message: `Application cannot be progressed from status: ${application.status}`
      })
    }

    // Update application
    const previousStatus = application.status
    application.status = nextStatus
    application.notes = getRandomComment(nextStatus)
    application.botProcessedAt = new Date()
    
    await application.save()

    // Create audit log
    await createAuditLog({
      user: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'APPLICATION_STATUS_UPDATED',
      actionDescription: `Bot Mimic: Updated application status from ${previousStatus} to ${nextStatus}`,
      targetType: 'Application',
      targetId: application._id,
      targetName: `${application.applicant.name} - ${application.job.title}`,
      ipAddress: req.ip,
      metadata: {
        previousStatus,
        newStatus: nextStatus,
        comment: application.notes,
        jobTitle: application.job.title,
        applicantName: application.applicant.name,
        botMimic: true
      }
    })

    await application.populate('job', 'title department location type jobType')
    await application.populate('applicant', 'name email')

    res.json({
      success: true,
      message: `Application progressed from ${previousStatus} to ${nextStatus}`,
      application
    })
  } catch (error) {
    console.error('Error processing application:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to process application'
    })
  }
})

// POST /api/bot-mimic/process-batch - Process multiple applications
router.post('/process-batch', async (req, res) => {
  try {
    const { status, limit = 10 } = req.body

    // Get technical jobs
    const technicalJobs = await Job.find({ jobType: 'technical' })
    const technicalJobIds = technicalJobs.map(job => job._id)

    // Find applications to process
    let query = {
      job: { $in: technicalJobIds },
      status: { $in: ['submitted', 'under-review', 'shortlisted'] }
    }

    if (status && status !== 'all') {
      query.status = status
    }

    const applications = await Application.find(query)
      .populate('job', 'title jobType')
      .populate('applicant', 'name email')
      .limit(parseInt(limit))

    const results = {
      processed: 0,
      failed: 0,
      skipped: 0,
      details: []
    }

    for (const application of applications) {
      try {
        const nextStatus = getNextStatus(application.status)
        
        if (!nextStatus) {
          results.skipped++
          results.details.push({
            applicationId: application._id,
            status: 'skipped',
            reason: 'No next status in workflow'
          })
          continue
        }

        const previousStatus = application.status
        application.status = nextStatus
        application.notes = getRandomComment(nextStatus)
        application.botProcessedAt = new Date()
        
        await application.save()

        // Create audit log
        await createAuditLog({
          user: req.user.id,
          userName: req.user.name,
          userRole: req.user.role,
          action: 'APPLICATION_STATUS_UPDATED',
          actionDescription: `Bot Mimic: Batch update from ${previousStatus} to ${nextStatus}`,
          targetType: 'Application',
          targetId: application._id,
          targetName: `${application.applicant.name} - ${application.job.title}`,
          ipAddress: req.ip,
          metadata: {
            previousStatus,
            newStatus: nextStatus,
            comment: application.notes,
            batchProcess: true,
            botMimic: true
          }
        })

        results.processed++
        results.details.push({
          applicationId: application._id,
          applicantName: application.applicant.name,
          jobTitle: application.job.title,
          previousStatus,
          newStatus: nextStatus,
          status: 'success'
        })

        // Add small delay to simulate human-like processing
        await delay(500)
      } catch (err) {
        console.error('Error processing application:', err)
        results.failed++
        results.details.push({
          applicationId: application._id,
          status: 'failed',
          error: err.message
        })
      }
    }

    res.json({
      success: true,
      message: `Processed ${results.processed} applications`,
      results
    })
  } catch (error) {
    console.error('Error in batch processing:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to process batch'
    })
  }
})

// GET /api/bot-mimic/activity-log - Get bot mimic activity logs
router.get('/activity-log', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query

    const { default: AuditLog } = await import('../models/AuditLog.js')
    
    const logs = await AuditLog.find({
      userRole: 'Bot Mimic',
      action: 'APPLICATION_STATUS_UPDATED'
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))

    const total = await AuditLog.countDocuments({
      userRole: 'Bot Mimic',
      action: 'APPLICATION_STATUS_UPDATED'
    })

    res.json({
      success: true,
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Error fetching activity log:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity log'
    })
  }
})

export default router
