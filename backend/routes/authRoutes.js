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

export default router
