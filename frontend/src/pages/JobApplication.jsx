import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, FileText, Send, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getJobById } from '../services/jobs'
import { getProfile } from '../services/profile'
import { submitApplication } from '../services/applications'

export default function JobApplication() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [job, setJob] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [application, setApplication] = useState({
    coverLetter: '',
    whyInterested: '',
    relevantExperience: '',
    availableStartDate: '',
    salaryExpectation: '',
    resume: null
  })

  const [resumeFile, setResumeFile] = useState(null)
  const [resumeFileName, setResumeFileName] = useState('')

  useEffect(() => {
    fetchJobDetails()
    fetchProfileData()
  }, [id])

  const fetchJobDetails = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await getJobById(id)
      
      if (response.success) {
        setJob(response.job)
      }
    } catch (err) {
      console.error('Error fetching job details:', err)
      setError('Failed to load job details.')
    } finally {
      setLoading(false)
    }
  }

  const fetchProfileData = async () => {
    try {
      const response = await getProfile()
      if (response.success && response.profile) {
        setProfile(response.profile)
        // Auto-fill relevant experience from profile
        autoFillFromProfile(response.profile)
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
    }
  }

  const autoFillFromProfile = (profileData) => {
    if (!profileData) return
    
    // Auto-fill cover letter
    let coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${job?.title || 'position'} role at ${job?.company || 'your company'}.`
    
    if (profileData.summary) {
      coverLetter += ` ${profileData.summary}`
    } else {
      coverLetter += ` With my background and experience, I am confident I would be a valuable addition to your team.`
    }
    
    coverLetter += `

I am excited about the opportunity to contribute to your team and would welcome the chance to discuss how my skills align with your needs.

Thank you for considering my application.

Best regards,
${profileData.name || ''}`

    // Auto-fill why interested
    let whyInterested = ''
    if (job?.description) {
      whyInterested = `I am particularly drawn to this role because it aligns with my career goals and interests. `
    }
    if (profileData.skills && profileData.skills.length > 0) {
      whyInterested += `My experience with ${profileData.skills.slice(0, 3).join(', ')} makes me well-suited for this position. `
    }
    whyInterested += `I am eager to bring my skills and enthusiasm to your team and contribute to your organization's success.`
    
    // Auto-fill relevant experience from profile
    let relevantExp = ''
    if (profileData.experience && profileData.experience.length > 0) {
      profileData.experience.forEach((exp, index) => {
        relevantExp += `${exp.title} at ${exp.company || 'Company'}`
        if (exp.startDate) {
          relevantExp += ` (${exp.startDate}`
          if (exp.endDate) {
            relevantExp += ` - ${exp.endDate}`
          } else {
            relevantExp += ` - Present`
          }
          relevantExp += `)`
        }
        relevantExp += `\n`
        if (exp.description) {
          relevantExp += `${exp.description}\n\n`
        }
      })
    }
    
    // Auto-fill salary expectation based on job salary range (in LPA)
    let salaryExpectation = ''
    if (job?.salaryRange?.max) {
      // Convert from stored value to LPA (divide by 100,000)
      const maxLPA = (job.salaryRange.max / 100000).toFixed(1)
      salaryExpectation = maxLPA
    }
    
    setApplication(prev => ({
      ...prev,
      coverLetter: coverLetter,
      whyInterested: whyInterested || prev.whyInterested,
      relevantExperience: relevantExp.trim(),
      salaryExpectation: salaryExpectation || prev.salaryExpectation
    }))
  }

  const fillDemoData = () => {
    setApplication({
      coverLetter: `Dear Hiring Manager,

I am writing to express my strong interest in the ${job?.title || 'position'} role at ${job?.company || 'your company'}. With my background in software development and proven track record of delivering high-quality solutions, I am confident I would be a valuable addition to your team.

Throughout my career, I have developed expertise in full-stack development, working with modern technologies and frameworks. I am particularly drawn to this opportunity because it aligns perfectly with my career goals and passion for creating innovative solutions that make a real impact.

I am excited about the possibility of contributing to your team's success and would welcome the opportunity to discuss how my skills and experience can benefit your organization.

Thank you for considering my application. I look forward to hearing from you.

Best regards`,
      whyInterested: `I am particularly excited about this role because it offers the opportunity to work with cutting-edge technologies and contribute to meaningful projects. Your company's commitment to innovation and excellence aligns perfectly with my professional values. I am eager to bring my technical expertise and collaborative mindset to your team, and I believe this position would provide excellent opportunities for both professional growth and making significant contributions to your organization's success.`,
      relevantExperience: `Senior Full Stack Developer at Tech Solutions Inc.
Led development of enterprise web applications using React, Node.js, and MongoDB. Implemented RESTful APIs and microservices architecture, improving system performance by 40%. Collaborated with cross-functional teams to deliver projects on time and within budget.

Software Engineer at Digital Innovations Ltd.
Developed and maintained web applications using modern JavaScript frameworks. Participated in code reviews, implemented automated testing, and contributed to improving development workflows. Successfully delivered multiple client projects with high customer satisfaction.

Junior Developer at StartUp Ventures
Built responsive web interfaces and integrated third-party APIs. Worked in an agile environment, participating in daily standups and sprint planning. Gained hands-on experience with version control, CI/CD pipelines, and cloud deployment.`,
      availableStartDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      salaryExpectation: job?.salaryRange?.max ? (job.salaryRange.max / 100000).toFixed(1) : '8.0'
    })
    setError('')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setApplication(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!validTypes.includes(file.type)) {
        setError('Please upload a PDF or Word document')
        return
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      
      setResumeFile(file)
      setResumeFileName(file.name)
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!resumeFile) {
      setError('Please upload your resume')
      return
    }
    
    setSubmitting(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('jobId', id)
      formData.append('coverLetter', application.coverLetter)
      formData.append('whyInterested', application.whyInterested)
      formData.append('relevantExperience', application.relevantExperience)
      formData.append('availableStartDate', application.availableStartDate)
      formData.append('salaryExpectation', application.salaryExpectation)
      formData.append('resume', resumeFile)

      const response = await submitApplication(formData)
      
      if (response.success) {
        setSuccess(true)
        setTimeout(() => {
          navigate('/applicant')
        }, 3000)
      }
    } catch (err) {
      console.error('Error submitting application:', err)
      setError(err.message || 'Failed to submit application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your application for <strong>{job?.title}</strong> has been successfully submitted. 
              We'll review it and get back to you soon.
            </p>
            <button
              onClick={() => navigate('/applicant')}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-8 text-center">
            <div className="text-red-700 text-lg mb-4">Job not found</div>
            <button
              onClick={() => navigate('/jobs')}
              className="text-indigo-600 hover:text-indigo-800"
            >
              View all jobs
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/jobs/${id}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Job Details
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h1>
            <button
              type="button"
              onClick={fillDemoData}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <FileText className="h-4 w-4 mr-2" />
              Fill Demo Data
            </button>
          </div>
          <p className="text-gray-600">
            {job.department} • {job.location}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="text-red-700 text-sm font-medium">{error}</div>
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Letter */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <FileText className="h-5 w-5 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Cover Letter</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tell us about yourself and why you're a great fit *
              </label>
              <textarea
                name="coverLetter"
                required
                rows={6}
                value={application.coverLetter}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Write your cover letter here..."
              />
            </div>
          </div>

          {/* Why Interested */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Why are you interested in this position? *
              </label>
              <textarea
                name="whyInterested"
                required
                rows={4}
                value={application.whyInterested}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Explain your interest in this role and our company..."
              />
            </div>
          </div>

          {/* Relevant Experience */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Describe your relevant experience for this role *
              </label>
              <textarea
                name="relevantExperience"
                required
                rows={4}
                value={application.relevantExperience}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Highlight your experience and skills relevant to this position..."
              />
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Start Date *
                </label>
                <input
                  type="date"
                  name="availableStartDate"
                  required
                  value={application.availableStartDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary Expectation (₹ LPA - Lakhs Per Annum)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="salaryExpectation"
                  value={application.salaryExpectation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 8.0"
                />
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Upload className="h-5 w-5 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Resume/CV *</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload your resume (PDF or Word document, max 5MB)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="resume-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="resume-upload"
                        name="resume"
                        type="file"
                        required
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX up to 5MB
                  </p>
                  {resumeFileName && (
                    <p className="text-sm text-green-600 font-medium mt-2">
                      ✓ {resumeFileName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/jobs/${id}`)}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center"
            >
              <Send className="h-4 w-4 mr-2" />
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}