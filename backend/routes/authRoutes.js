import { Router } from 'express'
import { register, login } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// POST /api/auth/register
router.post('/register', register)

// POST /api/auth/login
router.post('/login', login)

// GET /api/auth/me - protected route that returns token payload
router.get('/me', requireAuth, (req, res) => {
	// req.user is set by requireAuth (the decoded JWT payload)
	res.json({ user: req.user })
})

export default router
