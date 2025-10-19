import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = await User.create({ name, email, passwordHash })

    const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    res.status(201).json({
      message: 'Registered successfully',
      user: { id: user._id, name: user.name, email: user.email },
      token
    })
  } catch (err) {
    console.error('Register error:', err)
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already in use' })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const login = async (req, res) => {
  try {
    // Helpful debug logging in development when troubleshooting request bodies
    if (process.env.NODE_ENV !== 'production') {
      console.debug('Login attempt body:', req.body)
    }
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    res.json({
      message: 'Logged in successfully',
      user: { id: user._id, name: user.name, email: user.email },
      token
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
