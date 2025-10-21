import mongoose from 'mongoose'

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true
  },
  institution: String,
  year: String,
  field: String
}, { _id: false })

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: String,
  startDate: String,
  endDate: String,
  current: {
    type: Boolean,
    default: false
  },
  description: String
}, { _id: false })

const applicantProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    dateOfBirth: Date,
    summary: {
      type: String,
      required: true
    },
    education: [educationSchema],
    experience: [experienceSchema],
    skills: [{
      type: String,
      trim: true
    }],
    linkedin: String,
    github: String,
    portfolio: String
  },
  { timestamps: true }
)

// Index for better performance
// Note: user field already has unique: true which creates an index
applicantProfileSchema.index({ email: 1 })

const ApplicantProfile = mongoose.model('ApplicantProfile', applicantProfileSchema)
export default ApplicantProfile