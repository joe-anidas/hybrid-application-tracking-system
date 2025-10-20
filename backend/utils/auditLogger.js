import AuditLog from '../models/AuditLog.js'

/**
 * Create an audit log entry
 * @param {Object} params - Logging parameters
 * @param {String} params.userId - ID of the user performing the action
 * @param {String} params.userName - Name of the user
 * @param {String} params.userRole - Role of the user
 * @param {String} params.action - Action type (from enum)
 * @param {String} params.actionDescription - Human-readable description
 * @param {String} params.targetType - Type of target entity
 * @param {String} params.targetId - ID of target entity
 * @param {String} params.targetName - Name of target entity
 * @param {String} params.ipAddress - IP address of request
 * @param {Object} params.metadata - Additional metadata
 */
export async function createAuditLog({
  userId,
  userName,
  userRole,
  action,
  actionDescription,
  targetType = null,
  targetId = null,
  targetName = null,
  ipAddress = null,
  metadata = null
}) {
  try {
    const log = new AuditLog({
      user: userId,
      userName,
      userRole,
      action,
      actionDescription,
      targetType,
      targetId,
      targetName,
      ipAddress,
      metadata
    })
    
    await log.save()
    return log
  } catch (error) {
    console.error('Failed to create audit log:', error)
    // Don't throw - logging failures shouldn't break the app
  }
}

/**
 * Get client IP address from request
 */
export function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         'Unknown'
}

export default { createAuditLog, getClientIp }
