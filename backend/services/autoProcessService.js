import Application from '../models/Application.js'
import Job from '../models/Job.js'
import BotMimicSettings from '../models/BotMimicSettings.js'
import { createAuditLog } from '../utils/auditLogger.js'

// Status progression workflow
const STATUS_WORKFLOW = {
  'submitted': ['under-review'],
  'under-review': ['shortlisted', 'rejected'],
  'shortlisted': ['accepted', 'rejected']
}

// Rejection probability for each status
const REJECTION_PROBABILITY = {
  'under-review': 0.20,
  'shortlisted': 0.15
}

// Bot-generated comments
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
    'Unfortunately, we are moving forward with other candidates.'
  ]
}

const getRandomComment = (status) => {
  const comments = BOT_COMMENTS[status] || []
  return comments[Math.floor(Math.random() * comments.length)]
}

const getNextStatus = (currentStatus) => {
  const possibleStatuses = STATUS_WORKFLOW[currentStatus]
  
  if (!possibleStatuses || possibleStatuses.length === 0) {
    return null
  }
  
  if (possibleStatuses.length === 1) {
    return possibleStatuses[0]
  }
  
  const rejectionChance = REJECTION_PROBABILITY[currentStatus] || 0
  const random = Math.random()
  
  if (random < rejectionChance) {
    return possibleStatuses.find(status => status === 'rejected') || possibleStatuses[0]
  }
  
  return possibleStatuses.find(status => status !== 'rejected') || possibleStatuses[0]
}

// Auto-process state
let autoProcessInterval = null

// Auto-process function
async function autoProcessApplications() {
  // Check database for current auto-process state
  const settings = await BotMimicSettings.getSettings()
  if (!settings.autoProcessEnabled) return

  try {
    console.log('🤖 Auto-processing applications...')

    // Get technical jobs
    const technicalJobs = await Job.find({ jobType: 'technical' })
    const technicalJobIds = technicalJobs.map(job => job._id)

    if (technicalJobIds.length === 0) {
      console.log('No technical jobs found')
      return
    }

    // Find applications to process (limit to 5 per cycle)
    const applications = await Application.find({
      job: { $in: technicalJobIds },
      status: { $in: ['submitted', 'under-review', 'shortlisted'] }
    })
      .populate('job', 'title jobType')
      .populate('applicant', 'name email')
      .limit(5)

    if (applications.length === 0) {
      console.log('No applications to process')
      return
    }

    console.log(`Processing ${applications.length} applications...`)

    let processed = 0
    let failed = 0

    for (const application of applications) {
      try {
        const nextStatus = getNextStatus(application.status)
        
        if (!nextStatus) {
          continue
        }

        const previousStatus = application.status
        const botComment = getRandomComment(nextStatus)
        
        // Record status change in history
        application.statusHistory.push({
          status: nextStatus,
          changedBy: null,
          changedByName: 'Auto Bot Mimic',
          changedByRole: 'Bot Mimic',
          comment: botComment,
          timestamp: new Date()
        })
        
        application.status = nextStatus
        application.notes = botComment
        application.botProcessedAt = new Date()
        
        await application.save()

        // Create audit log
        await createAuditLog({
          user: null,
          userName: 'Auto Bot Mimic',
          userRole: 'Bot Mimic',
          action: 'APPLICATION_STATUS_UPDATED',
          actionDescription: `Auto Bot Mimic: Updated application status from ${previousStatus} to ${nextStatus}`,
          targetType: 'Application',
          targetId: application._id,
          targetName: `${application.applicant.name} - ${application.job.title}`,
          ipAddress: 'System',
          metadata: {
            previousStatus,
            newStatus: nextStatus,
            comment: botComment,
            jobTitle: application.job.title,
            applicantName: application.applicant.name,
            botMimic: true,
            autoProcess: true
          }
        })

        processed++
      } catch (err) {
        console.error('Error processing application:', err)
        failed++
      }
    }

    console.log(`✅ Auto-processed: ${processed} applications, Failed: ${failed}`)
  } catch (error) {
    console.error('Auto-process error:', error)
  }
}

// Start auto-processing (always running, but checks DB for enabled state)
export async function startAutoProcess() {
  if (autoProcessInterval) {
    console.log('Auto-process already running')
    return
  }

  // Get initial state from database
  const settings = await BotMimicSettings.getSettings()
  console.log(`🤖 Starting auto-processing service (30 second intervals) - Initial state: ${settings.autoProcessEnabled ? 'ENABLED' : 'PAUSED'}`)
  
  // Run immediately if enabled
  if (settings.autoProcessEnabled) {
    autoProcessApplications()
  }
  
  // Then run every 30 seconds (will check DB state each time)
  autoProcessInterval = setInterval(autoProcessApplications, 30000)
}

// Stop auto-processing interval (only for server shutdown)
export function stopAutoProcess() {
  if (autoProcessInterval) {
    clearInterval(autoProcessInterval)
    autoProcessInterval = null
    console.log('🛑 Auto-processing service interval stopped')
  }
}

// Get current auto-processing state from database
export async function getAutoProcessStatus() {
  const settings = await BotMimicSettings.getSettings()
  return {
    enabled: settings.autoProcessEnabled,
    lastModifiedBy: settings.lastModifiedByName,
    lastModifiedAt: settings.lastModifiedAt
  }
}

// Enable auto-processing
export async function enableAutoProcess(modifiedBy) {
  const settings = await BotMimicSettings.updateSettings(
    { autoProcessEnabled: true },
    modifiedBy
  )
  console.log(`✅ Auto-processing ENABLED by ${modifiedBy?.userName || 'System'}`)
  return settings
}

// Disable auto-processing
export async function disableAutoProcess(modifiedBy) {
  const settings = await BotMimicSettings.updateSettings(
    { autoProcessEnabled: false },
    modifiedBy
  )
  console.log(`⏸️ Auto-processing PAUSED by ${modifiedBy?.userName || 'System'}`)
  return settings
}

export default {
  startAutoProcess,
  stopAutoProcess,
  getAutoProcessStatus,
  enableAutoProcess,
  disableAutoProcess
}
