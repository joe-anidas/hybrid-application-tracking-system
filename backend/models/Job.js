import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      minlength: [3, 'Job title must be at least 3 characters']
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Employment type is required'],
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      default: 'full-time'
    },
    jobType: {
      type: String,
      required: [true, 'Job type is required'],
      enum: ['technical', 'non-technical'],
      default: 'technical'
    },
    level: {
      type: String,
      required: [true, 'Experience level is required'],
      enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
      default: 'mid'
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      minlength: [50, 'Job description must be at least 50 characters']
    },
    requirements: {
      type: String,
      required: [true, 'Job requirements are required'],
      minlength: [20, 'Job requirements must be at least 20 characters']
    },
    responsibilities: {
      type: String,
      required: [true, 'Job responsibilities are required'],
      minlength: [20, 'Job responsibilities must be at least 20 characters']
    },
    salaryMin: {
      type: Number,
      min: [0, 'Minimum salary cannot be negative']
    },
    salaryMax: {
      type: Number,
      min: [0, 'Maximum salary cannot be negative'],
      validate: {
        validator: function(value) {
          return !this.salaryMin || value >= this.salaryMin;
        },
        message: 'Maximum salary must be greater than or equal to minimum salary'
      }
    },
    applicationDeadline: {
      type: Date
    },
    skills: [{
      type: String,
      trim: true
    }],
    benefits: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'closed'],
      default: 'active'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    applicants: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

// Index for better performance on common queries
jobSchema.index({ status: 1, jobType: 1, createdAt: -1 })
jobSchema.index({ department: 1 })
jobSchema.index({ skills: 1 })

const Job = mongoose.model('Job', jobSchema)
export default Job