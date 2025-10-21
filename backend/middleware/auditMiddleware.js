import AuditLog from '../models/AuditLog.js'
import { getClientIp } from '../utils/auditLogger.js'

/**
 * Middleware to automatically log all API requests
 * Creates audit logs for all authenticated API calls
 */
export const auditMiddleware = async (req, res, next) => {
  // Store the original response methods
  const originalJson = res.json
  const originalSend = res.send

  // Track request start time
  const requestStartTime = Date.now()

  // Get user info from auth middleware (if authenticated)
  const user = req.user || null
  const ipAddress = getClientIp(req)

  // Determine if this is an API route we should log
  const shouldLog = req.path.startsWith('/api/') && 
                    req.path !== '/api/audit-logs' && // Don't log audit log queries
                    !req.path.includes('/uploads/') // Don't log file downloads

  if (!shouldLog) {
    return next()
  }

  // Capture response data
  let responseBody = null
  let responseStatusCode = null

  // Override res.json to capture response
  res.json = function(data) {
    responseBody = data
    responseStatusCode = res.statusCode
    return originalJson.call(this, data)
  }

  // Override res.send to capture response
  res.send = function(data) {
    responseBody = data
    responseStatusCode = res.statusCode
    return originalSend.call(this, data)
  }

  // Wait for response to finish, then log
  res.on('finish', async () => {
    try {
      const responseTime = Date.now() - requestStartTime

      // Determine action type and description based on method and path
      const { action, actionDescription, targetType } = parseRequestAction(
        req.method,
        req.path,
        req.body,
        responseBody,
        user
      )

      // Extract target information
      const { targetId, targetName } = extractTargetInfo(req, responseBody)

      // Only log if we have a valid action (skip health checks, etc.)
      if (!action) {
        return
      }

      // Create audit log
      await AuditLog.create({
        user: user?._id || null,
        userName: user?.name || user?.email || 'Anonymous',
        userRole: user?.role || 'System',
        action,
        actionDescription,
        targetType,
        targetId,
        targetName,
        ipAddress,
        metadata: {
          method: req.method,
          path: req.path,
          statusCode: responseStatusCode,
          responseTime: `${responseTime}ms`,
          requestBody: sanitizeRequestBody(req.body),
          query: req.query,
          userAgent: req.headers['user-agent']
        }
      })
    } catch (error) {
      console.error('Failed to create audit log:', error)
      // Don't throw - logging failures shouldn't break the app
    }
  })

  next()
}

/**
 * Parse request to determine action type and description
 */
function parseRequestAction(method, path, body, responseBody, user) {
  const userName = user?.name || user?.email || 'User'
  
  // Authentication routes
  if (path.includes('/api/auth/login')) {
    return {
      action: 'USER_LOGIN',
      actionDescription: `${userName} logged in`,
      targetType: 'Auth'
    }
  }
  if (path.includes('/api/auth/logout')) {
    return {
      action: 'USER_LOGOUT',
      actionDescription: `${userName} logged out`,
      targetType: 'Auth'
    }
  }
  if (path.includes('/api/auth/register')) {
    return {
      action: 'USER_REGISTER',
      actionDescription: `New user registered: ${body?.email}`,
      targetType: 'User'
    }
  }

  // Job routes
  if (path.includes('/api/jobs')) {
    if (method === 'POST') {
      return {
        action: 'JOB_CREATED',
        actionDescription: `${userName} created job: ${body?.title}`,
        targetType: 'Job'
      }
    }
    if (method === 'PUT' || method === 'PATCH') {
      return {
        action: 'JOB_UPDATED',
        actionDescription: `${userName} updated job: ${body?.title || 'Job'}`,
        targetType: 'Job'
      }
    }
    if (method === 'DELETE') {
      return {
        action: 'JOB_DELETED',
        actionDescription: `${userName} deleted a job`,
        targetType: 'Job'
      }
    }
    if (method === 'GET') {
      return {
        action: 'JOB_VIEWED',
        actionDescription: `${userName} viewed job listings`,
        targetType: 'Job'
      }
    }
  }

  // Application routes
  if (path.includes('/api/applications')) {
    if (method === 'POST') {
      return {
        action: 'APPLICATION_SUBMITTED',
        actionDescription: `${userName} submitted an application`,
        targetType: 'Application'
      }
    }
    if (method === 'PUT' || method === 'PATCH') {
      if (body?.status) {
        return {
          action: 'APPLICATION_STATUS_UPDATED',
          actionDescription: `${userName} updated application status to: ${body.status}`,
          targetType: 'Application'
        }
      }
      return {
        action: 'APPLICATION_UPDATED',
        actionDescription: `${userName} updated an application`,
        targetType: 'Application'
      }
    }
    if (method === 'DELETE') {
      return {
        action: 'APPLICATION_DELETED',
        actionDescription: `${userName} deleted an application`,
        targetType: 'Application'
      }
    }
    if (method === 'GET') {
      return {
        action: 'APPLICATION_VIEWED',
        actionDescription: `${userName} viewed application(s)`,
        targetType: 'Application'
      }
    }
  }

  // Profile routes
  if (path.includes('/api/profile')) {
    if (method === 'POST') {
      return {
        action: 'PROFILE_CREATED',
        actionDescription: `${userName} created their profile`,
        targetType: 'Profile'
      }
    }
    if (method === 'PUT' || method === 'PATCH') {
      return {
        action: 'PROFILE_UPDATED',
        actionDescription: `${userName} updated their profile`,
        targetType: 'Profile'
      }
    }
    if (method === 'GET') {
      return {
        action: 'PROFILE_VIEWED',
        actionDescription: `${userName} viewed profile`,
        targetType: 'Profile'
      }
    }
  }

  // User management routes
  if (path.includes('/api/users')) {
    if (method === 'POST') {
      return {
        action: 'USER_CREATED',
        actionDescription: `${userName} created a new user`,
        targetType: 'User'
      }
    }
    if (method === 'PUT' || method === 'PATCH') {
      return {
        action: 'USER_UPDATED',
        actionDescription: `${userName} updated user information`,
        targetType: 'User'
      }
    }
    if (method === 'DELETE') {
      return {
        action: 'USER_DELETED',
        actionDescription: `${userName} deleted a user`,
        targetType: 'User'
      }
    }
    if (method === 'GET') {
      return {
        action: 'USER_VIEWED',
        actionDescription: `${userName} viewed user(s)`,
        targetType: 'User'
      }
    }
  }

  // Bot Mimic routes
  if (path.includes('/api/bot-mimic')) {
    if (path.includes('/process-single')) {
      return {
        action: 'BOT_PROCESS_SINGLE',
        actionDescription: `Bot Mimic processed single application`,
        targetType: 'Application'
      }
    }
    if (path.includes('/process-batch')) {
      return {
        action: 'BOT_PROCESS_BATCH',
        actionDescription: `Bot Mimic processed batch of applications`,
        targetType: 'Application'
      }
    }
    if (method === 'GET') {
      return {
        action: 'BOT_ACTIVITY_VIEWED',
        actionDescription: `${userName} viewed bot mimic dashboard`,
        targetType: 'System'
      }
    }
  }

  // Dashboard routes
  if (path.includes('/api/dashboard')) {
    return {
      action: 'DASHBOARD_VIEWED',
      actionDescription: `${userName} viewed dashboard`,
      targetType: 'System'
    }
  }

  // Default for other API calls
  if (method === 'GET') {
    return {
      action: 'DATA_ACCESSED',
      actionDescription: `${userName} accessed ${path}`,
      targetType: 'System'
    }
  }

  return {
    action: 'API_REQUEST',
    actionDescription: `${userName} made ${method} request to ${path}`,
    targetType: 'System'
  }
}

/**
 * Extract target ID and name from request/response
 */
function extractTargetInfo(req, responseBody) {
  let targetId = null
  let targetName = null

  // Try to get ID from URL params
  const idMatch = req.path.match(/\/([a-f\d]{24})(?:\/|$)/i)
  if (idMatch) {
    targetId = idMatch[1]
  }

  // Try to get ID from request body
  if (!targetId && req.body?._id) {
    targetId = req.body._id
  }

  // Try to get name from response body
  if (responseBody) {
    if (typeof responseBody === 'object') {
      targetName = responseBody.job?.title || 
                   responseBody.application?.job?.title ||
                   responseBody.user?.name ||
                   responseBody.profile?.fullName ||
                   responseBody.name ||
                   responseBody.title ||
                   null
    }
  }

  // Try to get name from request body
  if (!targetName && req.body) {
    targetName = req.body.title || req.body.name || req.body.fullName || null
  }

  return { targetId, targetName }
}

/**
 * Remove sensitive information from request body before logging
 */
function sanitizeRequestBody(body) {
  if (!body || typeof body !== 'object') {
    return body
  }

  const sanitized = { ...body }
  
  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'jwt', 'secret', 'apiKey', 'apiSecret']
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]'
    }
  })

  // Truncate large fields
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string' && sanitized[key].length > 500) {
      sanitized[key] = sanitized[key].substring(0, 500) + '... [truncated]'
    }
  })

  return sanitized
}

export default auditMiddleware
