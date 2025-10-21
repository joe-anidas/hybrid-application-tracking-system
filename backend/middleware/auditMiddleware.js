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
      const actionResult = parseRequestAction(
        req.method,
        req.path,
        req.body,
        responseBody,
        user
      )

      // Only log if we have a valid action (skip health checks, etc.)
      if (!actionResult || !actionResult.action) {
        return
      }

      const { action, actionDescription, targetType } = actionResult

      // Extract target information
      const { targetId, targetName } = extractTargetInfo(req, responseBody)

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
  const userName = user?.name || user?.email || 'Anonymous User'
  const userRole = user?.role || 'Anonymous'
  
  // Authentication routes
  if (path.includes('/api/auth/login')) {
    return {
      action: 'USER_LOGIN',
      actionDescription: `${userName} (${userRole}) logged in`,
      targetType: 'Auth'
    }
  }
  if (path.includes('/api/auth/logout')) {
    return {
      action: 'USER_LOGOUT',
      actionDescription: `${userName} (${userRole}) logged out`,
      targetType: 'Auth'
    }
  }
  if (path.includes('/api/auth/register')) {
    const role = body?.role || 'Applicant'
    return {
      action: 'USER_REGISTER',
      actionDescription: `New ${role} registered: ${body?.name || body?.email}`,
      targetType: 'User'
    }
  }

  // Job routes
  if (path.includes('/api/jobs')) {
    if (method === 'POST' && path.includes('/create')) {
      return {
        action: 'JOB_CREATED',
        actionDescription: `${userName} (${userRole}) created job: ${body?.title || 'Untitled Job'}`,
        targetType: 'Job'
      }
    }
    if (method === 'PUT' || method === 'PATCH') {
      const jobTitle = body?.title || extractJobNameFromResponse(responseBody) || 'Job'
      return {
        action: 'JOB_UPDATED',
        actionDescription: `${userName} (${userRole}) updated job: ${jobTitle}`,
        targetType: 'Job'
      }
    }
    if (method === 'DELETE') {
      return {
        action: 'JOB_DELETED',
        actionDescription: `${userName} (${userRole}) deleted a job`,
        targetType: 'Job'
      }
    }
    if (method === 'GET' && path.match(/\/api\/jobs\/[a-f\d]{24}/i)) {
      return {
        action: 'JOB_VIEWED',
        actionDescription: `${userName} (${userRole}) viewed job details`,
        targetType: 'Job'
      }
    }
    if (method === 'GET') {
      return {
        action: 'JOB_VIEWED',
        actionDescription: `${userName} (${userRole}) viewed job listings`,
        targetType: 'Job'
      }
    }
  }

  // Application routes
  if (path.includes('/api/applications')) {
    // Application submission
    if (method === 'POST' && path.includes('/submit')) {
      const jobTitle = body?.jobTitle || 'job'
      return {
        action: 'APPLICATION_SUBMITTED',
        actionDescription: `${userName} (Applicant) submitted application for ${jobTitle}`,
        targetType: 'Application'
      }
    }
    
    // Status update
    if ((method === 'PUT' || method === 'PATCH') && path.includes('/status')) {
      const newStatus = body?.status || 'unknown'
      const previousStatus = body?.previousStatus || 'previous'
      return {
        action: 'APPLICATION_STATUS_UPDATED',
        actionDescription: `${userName} (${userRole}) updated application status from ${previousStatus} to ${newStatus}`,
        targetType: 'Application'
      }
    }
    
    // General update
    if (method === 'PUT' || method === 'PATCH') {
      return {
        action: 'APPLICATION_UPDATED',
        actionDescription: `${userName} (${userRole}) updated an application`,
        targetType: 'Application'
      }
    }
    
    if (method === 'DELETE') {
      return {
        action: 'APPLICATION_DELETED',
        actionDescription: `${userName} (${userRole}) deleted an application`,
        targetType: 'Application'
      }
    }
    
    if (method === 'GET' && path.match(/\/api\/applications\/[a-f\d]{24}/i)) {
      return {
        action: 'APPLICATION_VIEWED',
        actionDescription: `${userName} (${userRole}) viewed application details`,
        targetType: 'Application'
      }
    }
    
    if (method === 'GET') {
      return {
        action: 'APPLICATION_VIEWED',
        actionDescription: `${userName} (${userRole}) viewed application list`,
        targetType: 'Application'
      }
    }
  }

  // Profile routes
  if (path.includes('/api/profile')) {
    if (method === 'POST') {
      return {
        action: 'PROFILE_CREATED',
        actionDescription: `${userName} (Applicant) created their profile`,
        targetType: 'Profile'
      }
    }
    if (method === 'PUT' || method === 'PATCH') {
      return {
        action: 'PROFILE_UPDATED',
        actionDescription: `${userName} (Applicant) updated their profile`,
        targetType: 'Profile'
      }
    }
    if (method === 'GET') {
      return {
        action: 'PROFILE_VIEWED',
        actionDescription: `${userName} (${userRole}) viewed profile`,
        targetType: 'Profile'
      }
    }
  }

  // User management routes
  if (path.includes('/api/users')) {
    if (method === 'POST') {
      const createdRole = body?.role || 'User'
      const createdName = body?.name || body?.email || 'user'
      return {
        action: 'USER_CREATED',
        actionDescription: `${userName} (Admin) created ${createdRole} user: ${createdName}`,
        targetType: 'User'
      }
    }
    if (method === 'PUT' || method === 'PATCH') {
      return {
        action: 'USER_UPDATED',
        actionDescription: `${userName} (Admin) updated user information`,
        targetType: 'User'
      }
    }
    if (method === 'DELETE') {
      return {
        action: 'USER_DELETED',
        actionDescription: `${userName} (Admin) deleted a user`,
        targetType: 'User'
      }
    }
    if (method === 'GET' && path.match(/\/api\/users\/[a-f\d]{24}/i)) {
      return {
        action: 'USER_VIEWED',
        actionDescription: `${userName} (${userRole}) viewed user details`,
        targetType: 'User'
      }
    }
    if (method === 'GET') {
      return {
        action: 'USER_VIEWED',
        actionDescription: `${userName} (Admin) viewed user list`,
        targetType: 'User'
      }
    }
  }

  // Bot Mimic routes
  if (path.includes('/api/bot-mimic')) {
    if (path.includes('/process-single')) {
      return {
        action: 'BOT_PROCESS_SINGLE',
        actionDescription: `${userName} (Bot Mimic) processed single application`,
        targetType: 'Application'
      }
    }
    if (path.includes('/process-batch')) {
      const limit = body?.limit || 'multiple'
      return {
        action: 'BOT_PROCESS_BATCH',
        actionDescription: `${userName} (Bot Mimic) processed batch of ${limit} applications`,
        targetType: 'Application'
      }
    }
    if (path.includes('/auto-process') && method === 'POST') {
      return {
        action: 'BOT_AUTO_PROCESS',
        actionDescription: `${userName} (Bot Mimic) triggered auto-process`,
        targetType: 'System'
      }
    }
    if (method === 'GET' && path.includes('/activity')) {
      return {
        action: 'BOT_ACTIVITY_VIEWED',
        actionDescription: `${userName} (Bot Mimic) viewed bot activity dashboard`,
        targetType: 'System'
      }
    }
    if (method === 'GET') {
      return {
        action: 'BOT_ACTIVITY_VIEWED',
        actionDescription: `${userName} (${userRole}) viewed bot mimic dashboard`,
        targetType: 'System'
      }
    }
  }

  // Dashboard routes
  if (path.includes('/api/dashboard')) {
    if (path.includes('/admin')) {
      return {
        action: 'DASHBOARD_VIEWED',
        actionDescription: `${userName} (Admin) viewed admin dashboard`,
        targetType: 'System'
      }
    }
    if (path.includes('/applicant')) {
      return {
        action: 'DASHBOARD_VIEWED',
        actionDescription: `${userName} (Applicant) viewed applicant dashboard`,
        targetType: 'System'
      }
    }
    if (path.includes('/analytics')) {
      return {
        action: 'DASHBOARD_VIEWED',
        actionDescription: `${userName} (${userRole}) viewed analytics dashboard`,
        targetType: 'System'
      }
    }
    return {
      action: 'DASHBOARD_VIEWED',
      actionDescription: `${userName} (${userRole}) viewed dashboard`,
      targetType: 'System'
    }
  }

  // Audit log access
  if (path.includes('/api/audit-logs')) {
    return null // Skip logging audit log queries to prevent recursion
  }

  // Skip logging for general GET requests that don't match specific patterns
  return null
}

/**
 * Helper to extract job name from response
 */
function extractJobNameFromResponse(responseBody) {
  if (!responseBody || typeof responseBody !== 'object') return null
  return responseBody.job?.title || responseBody.title || null
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
