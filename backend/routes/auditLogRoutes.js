import { Router } from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import AuditLog from '../models/AuditLog.js'

const router = Router()

// GET /api/audit-logs - Get all audit logs (Admin only)
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      action,
      resourceType,
      user, 
      startDate, 
      endDate 
    } = req.query

    const query = {}

    // Filter by action
    if (action && action !== 'all') {
      query.action = action
    }

    // Filter by resource type
    if (resourceType && resourceType !== 'all') {
      query.targetType = resourceType
    }

    // Filter by user
    if (user) {
      query.user = user
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) {
        query.createdAt.$gte = new Date(startDate)
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate)
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate('user', 'name email role')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip),
      AuditLog.countDocuments(query)
    ])

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    res.status(500).json({ error: 'Failed to fetch audit logs' })
  }
})

// GET /api/audit-logs/stats - Get audit log statistics
router.get('/stats', requireAuth, requireAdmin, async (req, res) => {
  try {
    const [
      totalLogs,
      recentLogs,
      actionBreakdown
    ] = await Promise.all([
      AuditLog.countDocuments(),
      AuditLog.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'name email role'),
      AuditLog.aggregate([
        {
          $group: {
            _id: '$action',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ])
    ])

    // Get logs from last 24 hours
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const logsLast24Hours = await AuditLog.countDocuments({
      createdAt: { $gte: last24Hours }
    })

    res.json({
      totalLogs,
      logsLast24Hours,
      recentLogs,
      actionBreakdown
    })
  } catch (error) {
    console.error('Error fetching audit log stats:', error)
    res.status(500).json({ error: 'Failed to fetch audit log statistics' })
  }
})

export default router
