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
    appliedAt: {
      type: Date,
      default: Date.now
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date,
    notes: String
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

const Application = mongoose.model('Application', applicationSchema)
export default Application