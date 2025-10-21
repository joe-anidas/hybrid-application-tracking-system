import { Router } from 'express'
import { register, login, profile } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// POST /api/auth/register
router.post('/register', register)

// POST /api/auth/login
router.post('/login', login)

// GET /api/auth/profile - protected route that returns full user profile
router.get('/profile', requireAuth, profile)

// GET /api/auth/me - protected route that returns token payload (kept for backward compatibility)
router.get('/me', requireAuth, (req, res) => {
	// req.user is set by requireAuth (the decoded JWT payload)
	res.json({ user: req.user })
})

// POST /api/auth/logout - logout endpoint (for audit logging)
router.post('/logout', requireAuth, async (req, res) => {
	try {
		// Import audit logger
		const { createAuditLog, getClientIp } = await import('../utils/auditLogger.js')
		
		// Log the logout
		await createAuditLog({
			userId: req.user.id,
			userName: req.user.name,
			userRole: req.user.role,
			action: 'USER_LOGOUT',
			actionDescription: `${req.user.name} (${req.user.role}) logged out`,
			targetType: 'Auth',
			ipAddress: getClientIp(req)
		})

		res.json({
			message: 'Logged out successfully'
		})
	} catch (err) {
		console.error('Logout error:', err)
		// Still return success even if audit logging fails
		res.json({
			message: 'Logged out successfully'
		})
	}
})

export default router
