import { Router } from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import User from '../models/User.js'
import ApplicantProfile from '../models/ApplicantProfile.js'
import Application from '../models/Application.js'
import bcrypt from 'bcryptjs'
import { createAuditLog, getClientIp } from '../utils/auditLogger.js'

const router = Router()

// GET /api/users - Get all users (Admin only)
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 })

    // Get applicant counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        let applicationCount = 0
        if (user.role === 'Applicant') {
          applicationCount = await Application.countDocuments({ applicant: user._id })
        }
        return {
          ...user.toObject(),
          applicationCount
        }
      })
    )

    res.json({ users: usersWithStats })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// POST /api/users - Create new admin or bot mimic user (Admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    // Only allow creating Admin or Bot Mimic users
    if (role !== 'Admin' && role !== 'Bot Mimic') {
      return res.status(400).json({ error: 'Can only create Admin or Bot Mimic users' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role
    })

    await user.save()

    // Log the user creation
    await createAuditLog({
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'USER_CREATED',
      actionDescription: `Admin ${req.user.name} created ${role} user: ${name}`,
      targetType: 'User',
      targetId: user._id,
      targetName: name,
      ipAddress: getClientIp(req),
      metadata: { createdRole: role, createdEmail: email }
    })

    // Return user without password
    const userResponse = user.toObject()
    delete userResponse.passwordHash

    res.status(201).json({ 
      message: `${role} user created successfully`,
      user: userResponse 
    })
  } catch (error) {
    console.error('Error creating user:', error)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// DELETE /api/users/:id - Delete user (Admin only, cannot delete self)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params

    // Prevent admin from deleting their own account
    if (id === req.user.id || id === req.user._id.toString()) {
      return res.status(403).json({ error: 'Cannot delete your own account' })
    }

    // Find the user
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Delete associated profile (only for Applicants)
    if (user.role === 'Applicant') {
      await ApplicantProfile.findOneAndDelete({ user: id })
      // Delete associated applications
      await Application.deleteMany({ applicant: id })
    }

    // Delete the user
    await User.findByIdAndDelete(id)

    // Log the deletion
    await createAuditLog({
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'USER_DELETED',
      actionDescription: `Admin ${req.user.name} deleted ${user.role} user: ${user.name}`,
      targetType: 'User',
      targetId: id,
      targetName: user.name,
      ipAddress: getClientIp(req),
      metadata: { deletedRole: user.role, deletedEmail: user.email }
    })

    res.json({ 
      message: `${user.role} account${user.role === 'Applicant' ? ' and associated data' : ''} deleted successfully` 
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

export default router
