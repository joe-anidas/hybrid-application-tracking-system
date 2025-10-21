import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

// GET /api/dashboard/applicant - Applicant dashboard data
router.get('/applicant', requireAuth, requireRole('Applicant'), (req, res) => {
  // Mock dashboard data for applicant
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role
    },
    stats: {
      totalApplications: 12,
      pending: 5,
      interviews: 3,
      offers: 1,
      rejections: 3
    },
    recentActivity: [
      { id: 1, action: 'Application submitted', company: 'Tech Corp', date: new Date().toISOString(), status: 'pending' },
      { id: 2, action: 'Interview scheduled', company: 'StartupXYZ', date: new Date(Date.now() - 86400000).toISOString(), status: 'interview' },
      { id: 3, action: 'Application reviewed', company: 'Big Tech Inc', date: new Date(Date.now() - 172800000).toISOString(), status: 'reviewed' }
    ]
  })
})

// GET /api/dashboard/bot-mimic - Bot Mimic dashboard data
router.get('/bot-mimic', requireAuth, requireRole('Bot Mimic'), (req, res) => {
  // Mock dashboard data for bot mimic
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role
    },
    stats: {
      totalProcessed: 156,
      todayProcessed: 23,
      technicalRoles: 89,
      averageProcessingTime: '2.3 mins',
      successRate: 94.5
    },
    recentActivity: [
      { id: 1, action: 'Auto-updated status', applicant: 'John Doe', position: 'Software Engineer', date: new Date().toISOString(), status: 'reviewed' },
      { id: 2, action: 'Scheduled interview', applicant: 'Jane Smith', position: 'DevOps Engineer', date: new Date(Date.now() - 3600000).toISOString(), status: 'interview' },
      { id: 3, action: 'Status progression', applicant: 'Bob Johnson', position: 'Full Stack Developer', date: new Date(Date.now() - 7200000).toISOString(), status: 'offer' }
    ]
  })
})

// GET /api/dashboard/admin - Admin dashboard data
router.get('/admin', requireAuth, requireRole('Admin'), async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default
    const Job = (await import('../models/Job.js')).default
    const Application = (await import('../models/Application.js')).default

    // Get real statistics from database
    const [
      totalApplications,
      totalUsers,
      activeJobPostings,
      nonTechnicalApplications,
      pendingReview
    ] = await Promise.all([
      Application.countDocuments(),
      User.countDocuments({ role: { $in: ['Applicant', 'Admin', 'Bot Mimic'] } }),
      Job.countDocuments({ status: 'active' }),
      Application.countDocuments({ 
        job: { 
          $in: await Job.find({ jobType: 'non-technical' }).distinct('_id') 
        } 
      }),
      Application.countDocuments({ 
        status: { $in: ['submitted', 'under-review'] } 
      })
    ])

    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        role: req.user.role
      },
      stats: {
        totalApplications,
        totalUsers,
        activeJobPostings,
        nonTechnicalApplications,
        pendingReview
      }
    })
  } catch (error) {
    console.error('Error fetching admin dashboard:', error)
    res.status(500).json({ 
      error: 'Failed to fetch dashboard data',
      message: error.message 
    })
  }
})

export default router