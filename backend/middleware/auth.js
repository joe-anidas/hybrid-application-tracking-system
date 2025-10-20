import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  const [, token] = authHeader.split(' ')
  if (!token) return res.status(401).json({ error: 'Missing token' })
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    // Fetch full user details including role
    const user = await User.findById(payload.sub).select('-passwordHash')
    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }
    // Add both user object and convenient id/role fields
    req.user = {
      ...user.toObject(),
      id: user._id.toString(),
      role: user.role
    }
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// Role-based authorization middleware
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }
    
    const userRoles = Array.isArray(roles) ? roles : [roles]
    if (!userRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Required role(s): ${userRoles.join(', ')}` 
      })
    }
    
    next()
  }
}

// Export alias for compatibility
export const authenticateToken = requireAuth

// Convenience middleware for admin-only routes
export const requireAdmin = requireRole('Admin')
