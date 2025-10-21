import mongoose from 'mongoose'

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null
    },
    userName: {
      type: String,
      required: true,
      default: 'Anonymous'
    },
    userRole: {
      type: String,
      required: true,
      enum: ['Applicant', 'Bot Mimic', 'Admin', 'System'],
      default: 'System'
    },
    action: {
      type: String,
      required: true,
      enum: [
        // Authentication
        'USER_LOGIN',
        'USER_LOGOUT',
        'USER_REGISTER',
        // User Management
        'USER_CREATED',
        'USER_DELETED',
        // Job Management
        'JOB_CREATED',
        'JOB_UPDATED',
        'JOB_DELETED',
        'JOB_VIEWED',
        // Application Management
        'APPLICATION_SUBMITTED',
        'APPLICATION_STATUS_UPDATED',
        'APPLICATION_VIEWED',
        // Profile Management
        'PROFILE_CREATED',
        'PROFILE_UPDATED',
        'PROFILE_VIEWED',
        // Bot Mimic Activities
        'BOT_PROCESS_SINGLE',
        'BOT_PROCESS_BATCH',
        'BOT_AUTO_PROCESS'
      ]
    },
    actionDescription: {
      type: String,
      required: true
    },
    targetType: {
      type: String,
      enum: ['User', 'Job', 'Application', 'Profile', 'Auth', 'System', null]
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId
    },
    targetName: {
      type: String
    },
    ipAddress: {
      type: String
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Index for faster queries
auditLogSchema.index({ createdAt: -1 })
auditLogSchema.index({ user: 1, createdAt: -1 })
auditLogSchema.index({ action: 1, createdAt: -1 })

const AuditLog = mongoose.model('AuditLog', auditLogSchema)
export default AuditLog
