import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Briefcase, X } from 'lucide-react'
import { getJobById, updateJob } from '../services/jobs'

export default function EditJob() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full-time',
    jobType: 'technical',
    level: 'senior',
    description: '',
    requirements: '',
    responsibilities: '',
    salaryMin: '',
    salaryMax: '',
    applicationDeadline: '',
    skills: [],
    benefits: '',
    status: 'active'
  })
  
  const [skillInput, setSkillInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true)
        const response = await getJobById(id)
        
        if (response.success && response.job) {
          const job = response.job
          setFormData({
            title: job.title || '',
            department: job.department || '',
            location: job.location || '',
            type: job.type || 'full-time',
            jobType: job.jobType || 'technical',
            level: job.level || 'senior',
            description: job.description || '',
            requirements: job.requirements || '',
            responsibilities: job.responsibilities || '',
            salaryMin: job.salaryMin || '',
            salaryMax: job.salaryMax || '',
            applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
            skills: job.skills || [],
            benefits: job.benefits || '',
            status: job.status || 'active'
          })
        }
      } catch (error) {
        console.error('Error fetching job:', error)
        setError('Failed to load job data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id])

  // Auto-expand textareas on mount and when formData changes
  useEffect(() => {
    const textareas = document.querySelectorAll('textarea')
    textareas.forEach(textarea => {
      if (textarea.value) {
        textarea.style.height = 'auto'
        textarea.style.height = textarea.scrollHeight + 'px'
      }
    })
  }, [formData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }))
      setSkillInput('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const response = await updateJob(id, formData)
      
      if (response.success) {
        setSuccess('Job posting updated successfully!')
        
        // Navigate back to manage jobs after a short delay
        setTimeout(() => {
          navigate('/admin/manage-jobs')
        }, 1500)
      }
    } catch (error) {
      console.error('Error updating job posting:', error)
      setError(error.message || 'Failed to update job posting. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/admin/manage-jobs')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Briefcase className="h-8 w-8 text-indigo-600 mr-3" />
            Edit Job Posting
          </h1>
          <p className="mt-2 text-gray-600">Update the job posting details</p>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Manage Jobs
          </button>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="job-form"
              disabled={isSubmitting}
              className="px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating Job...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Job
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white shadow rounded-lg">
          <form id="job-form" onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
                <div className="h-1 w-1 bg-indigo-600 rounded-full mr-2"></div>
                Basic Information
              </h3>
              <p className="text-sm text-gray-500 mb-6">Core details about the position</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Job Title */}
                <div className="lg:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                {/* Department */}
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="e.g., Engineering"
                  />
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="e.g., Bangalore / Remote"
                  />
                </div>

                {/* Employment Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                {/* Job Type */}
                <div>
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type *
                  </label>
                  <select
                    id="jobType"
                    name="jobType"
                    required
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                  >
                    <option value="technical">Technical</option>
                    <option value="non-technical">Non-Technical</option>
                  </select>
                </div>

                {/* Experience Level */}
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level *
                  </label>
                  <select
                    id="level"
                    name="level"
                    required
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="lead">Lead</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Compensation & Deadline */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
                <div className="h-1 w-1 bg-indigo-600 rounded-full mr-2"></div>
                Compensation & Deadline
              </h3>
              <p className="text-sm text-gray-500 mb-6">Salary range and application timeline</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Minimum Salary */}
                <div>
                  <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Salary (₹)
                  </label>
                  <input
                    type="number"
                    id="salaryMin"
                    name="salaryMin"
                    value={formData.salaryMin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="e.g., 500000"
                  />
                </div>

                {/* Maximum Salary */}
                <div>
                  <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Salary (₹)
                  </label>
                  <input
                    type="number"
                    id="salaryMax"
                    name="salaryMax"
                    value={formData.salaryMax}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="e.g., 1200000"
                  />
                </div>

                {/* Application Deadline */}
                <div>
                  <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    id="applicationDeadline"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
                <div className="h-1 w-1 bg-indigo-600 rounded-full mr-2"></div>
                Job Details
              </h3>
              <p className="text-sm text-gray-500 mb-6">Detailed information about the role</p>
              
              <div className="space-y-6">
                {/* Job Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    onInput={(e) => {
                      e.target.style.height = 'auto'
                      e.target.style.height = e.target.scrollHeight + 'px'
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none overflow-hidden min-h-[100px]"
                    placeholder="Provide a detailed description of the role..."
                  />
                </div>

                {/* Responsibilities */}
                <div>
                  <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-2">
                    Key Responsibilities *
                  </label>
                  <textarea
                    id="responsibilities"
                    name="responsibilities"
                    required
                    value={formData.responsibilities}
                    onChange={handleInputChange}
                    onInput={(e) => {
                      e.target.style.height = 'auto'
                      e.target.style.height = e.target.scrollHeight + 'px'
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none overflow-hidden min-h-[120px]"
                    placeholder="• List the main responsibilities&#10;• One per line with bullet points&#10;• Be specific and clear"
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements *
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    required
                    value={formData.requirements}
                    onChange={handleInputChange}
                    onInput={(e) => {
                      e.target.style.height = 'auto'
                      e.target.style.height = e.target.scrollHeight + 'px'
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none overflow-hidden min-h-[120px]"
                    placeholder="• List the required qualifications&#10;• Include years of experience&#10;• Specify technical skills and education"
                  />
                </div>
              </div>
            </div>

            {/* Skills & Benefits */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
                <div className="h-1 w-1 bg-indigo-600 rounded-full mr-2"></div>
                Skills & Benefits
              </h3>
              <p className="text-sm text-gray-500 mb-6">Required skills and offered benefits</p>
              
              <div className="space-y-6">
                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills
                  </label>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Type a skill and press Add (e.g. React, Node.js)"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-6 py-2.5 border border-indigo-600 text-indigo-600 rounded-lg shadow-sm text-sm font-medium bg-white hover:bg-indigo-50 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {formData.skills.length > 0 ? (
                      formData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">No skills added yet</span>
                    )}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-2">
                    Benefits & Perks
                  </label>
                  <textarea
                    id="benefits"
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleInputChange}
                    onInput={(e) => {
                      e.target.style.height = 'auto'
                      e.target.style.height = e.target.scrollHeight + 'px'
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none overflow-hidden min-h-[160px]"
                    placeholder="• Competitive salary and equity&#10;• Health insurance&#10;• Flexible work arrangements&#10;• Professional development"
                  />
                </div>
              </div>
            </div>
            
            {/* Form Actions - Bottom */}
            <div className="border-t border-gray-200 pt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating Job...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Job Posting
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
