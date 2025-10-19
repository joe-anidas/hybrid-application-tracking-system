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
router.get('/admin', requireAuth, requireRole('Admin'), (req, res) => {
  // Mock dashboard data for admin
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role
    },
    stats: {
      totalApplications: 245,
      totalUsers: 78,
      activeJobPostings: 15,
      nonTechnicalApplications: 67,
      pendingReview: 34
    },
    recentActivity: [
      { id: 1, action: 'New job posting created', title: 'Marketing Manager', date: new Date().toISOString(), type: 'job_posting' },
      { id: 2, action: 'Application manually reviewed', applicant: 'Alice Brown', position: 'HR Specialist', date: new Date(Date.now() - 1800000).toISOString(), type: 'review' },
      { id: 3, action: 'User registered', user: 'Charlie Wilson', role: 'Applicant', date: new Date(Date.now() - 5400000).toISOString(), type: 'user_registration' }
    ],
    jobPostings: [
      { id: 1, title: 'Marketing Manager', department: 'Marketing', applicants: 12, status: 'active' },
      { id: 2, title: 'HR Specialist', department: 'Human Resources', applicants: 8, status: 'active' },
      { id: 3, title: 'Sales Representative', department: 'Sales', applicants: 15, status: 'active' }
    ]
  })
})

export default router