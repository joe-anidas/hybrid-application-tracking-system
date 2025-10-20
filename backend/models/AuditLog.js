import mongoose from 'mongoose'

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    userRole: {
      type: String,
      required: true,
      enum: ['Applicant', 'Bot Mimic', 'Admin']
    },
    action: {
      type: String,
      required: true,
      enum: [
        'USER_LOGIN',
        'USER_LOGOUT',
        'USER_REGISTER',
        'USER_CREATED',
        'USER_DELETED',
        'JOB_CREATED',
        'JOB_UPDATED',
        'JOB_DELETED',
        'APPLICATION_SUBMITTED',
        'APPLICATION_STATUS_UPDATED',
        'PROFILE_UPDATED',
        'PROFILE_CREATED'
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
