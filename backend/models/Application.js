import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ApplicantProfile',
      required: true
    },
    coverLetter: {
      type: String,
      required: true
    },
    whyInterested: {
      type: String,
      required: true
    },
    relevantExperience: {
      type: String,
      required: true
    },
    availableStartDate: {
      type: Date,
      required: true
    },
    salaryExpectation: Number,
    resumeUrl: {
      type: String,
      required: true
    },
    resumeFileName: String,
    status: {
      type: String,
      enum: ['submitted', 'under-review', 'shortlisted', 'rejected', 'withdrawn', 'accepted'],
      default: 'submitted'
    },
    statusHistory: [{
      status: {
        type: String,
        enum: ['submitted', 'under-review', 'shortlisted', 'rejected', 'withdrawn', 'accepted'],
        required: true
      },
      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      changedByName: String,
      changedByRole: {
        type: String,
        enum: ['Applicant', 'Bot Mimic', 'Admin', 'System']
      },
      comment: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    appliedAt: {
      type: Date,
      default: Date.now
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date,
    notes: String,
    botProcessedAt: Date,
    botProcessedCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

// Compound index to prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true })

// Indexes for better performance
applicationSchema.index({ applicant: 1, createdAt: -1 })
applicationSchema.index({ job: 1, status: 1 })
applicationSchema.index({ status: 1, createdAt: -1 })

// Virtual field for submittedAt (alias for createdAt for consistency)
applicationSchema.virtual('submittedAt').get(function() {
  return this.createdAt
})

// Ensure virtual fields are included when converting to JSON
applicationSchema.set('toJSON', { virtuals: true })
applicationSchema.set('toObject', { virtuals: true })

// Pre-save hook to initialize statusHistory on first save
applicationSchema.pre('save', function(next) {
  // If this is a new document and statusHistory is empty, add initial status
  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = [{
      status: this.status,
      changedByName: 'System',
      changedByRole: 'System',
      comment: 'Application submitted',
      timestamp: this.createdAt || new Date()
    }]
  }
  next()
})

const Application = mongoose.model('Application', applicationSchema)
export default Application