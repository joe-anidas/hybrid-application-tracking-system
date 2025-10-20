import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, X } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { createJob } from '../services/jobs'

export default function CreateJob() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: 'Senior Full Stack Developer',
    department: 'Engineering',
    location: 'San Francisco, CA / Remote',
    type: 'full-time',
    jobType: 'technical',
    level: 'senior',
    description: 'We are looking for a talented Senior Full Stack Developer to join our growing engineering team. You will be responsible for developing and maintaining web applications using modern technologies and best practices.',
    requirements: '• 5+ years of experience in full-stack development\n• Proficiency in JavaScript, React, Node.js\n• Experience with databases (PostgreSQL, MongoDB)\n• Strong understanding of RESTful APIs\n• Experience with cloud platforms (AWS, GCP, or Azure)\n• Bachelor\'s degree in Computer Science or related field',
    responsibilities: '• Design and develop scalable web applications\n• Collaborate with cross-functional teams to define and implement features\n• Write clean, maintainable, and testable code\n• Participate in code reviews and technical discussions\n• Mentor junior developers\n• Contribute to technical architecture decisions',
    salaryMin: '120000',
    salaryMax: '160000',
    applicationDeadline: '2025-11-20',
    skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'TypeScript'],
    benefits: '• Competitive salary and equity package\n• Health, dental, and vision insurance\n• 401(k) with company matching\n• Flexible work arrangements\n• Professional development budget\n• Unlimited PTO\n• Modern office with free snacks and drinks'
  })
  
  const [skillInput, setSkillInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
      // Create the job posting
      const response = await createJob(formData)
      
      if (response.success) {
        setSuccess('Job posting created successfully!')
        
        // Navigate back to admin dashboard after a short delay
        setTimeout(() => {
          navigate('/admin')
        }, 1500)
      }
    } catch (error) {
      console.error('Error creating job posting:', error)
      setError(error.message || 'Failed to create job posting. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/admin')
  }

  const fillDemoData = () => {
    setFormData({
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'San Francisco, CA / Remote',
      type: 'full-time',
      jobType: 'technical',
      level: 'senior',
      description: 'We are looking for a talented Senior Full Stack Developer to join our growing engineering team. You will be responsible for developing and maintaining web applications using modern technologies and best practices.',
      requirements: '• 5+ years of experience in full-stack development\n• Proficiency in JavaScript, React, Node.js\n• Experience with databases (PostgreSQL, MongoDB)\n• Strong understanding of RESTful APIs\n• Experience with cloud platforms (AWS, GCP, or Azure)\n• Bachelor\'s degree in Computer Science or related field',
      responsibilities: '• Design and develop scalable web applications\n• Collaborate with cross-functional teams to define and implement features\n• Write clean, maintainable, and testable code\n• Participate in code reviews and technical discussions\n• Mentor junior developers\n• Contribute to technical architecture decisions',
      salaryMin: '120000',
      salaryMax: '160000',
      applicationDeadline: '2025-11-20',
      skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'TypeScript'],
      benefits: '• Competitive salary and equity package\n• Health, dental, and vision insurance\n• 401(k) with company matching\n• Flexible work arrangements\n• Professional development budget\n• Unlimited PTO\n• Modern office with free snacks and drinks'
    })
  }

  return (
    <DashboardLayout title="Create Job Posting">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCancel}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Dashboard
            </button>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={fillDemoData}
              className="px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Fill Demo Data
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <X className="h-4 w-4 mr-1 inline" />
              Cancel
            </button>
            <button
              type="submit"
              form="job-form"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-1 inline" />
              {isSubmitting ? 'Creating...' : 'Create Job'}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-lg">
          {/* Success Message */}
          {success && (
            <div className="p-4 mx-6 mt-6 bg-green-50 border border-green-200 rounded-md">
              <div className="text-green-700 text-sm font-medium">{success}</div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 mx-6 mt-6 bg-red-50 border border-red-200 rounded-md">
              <div className="text-red-700 text-sm font-medium">{error}</div>
            </div>
          )}

          <form id="job-form" onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
                
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department *
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. Engineering"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. San Francisco, CA / Remote"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Employment Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type *
                  </label>
                  <select
                    id="jobType"
                    name="jobType"
                    required
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="technical">Technical</option>
                    <option value="non-technical">Non-Technical</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level
                  </label>
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="lead">Lead</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    id="applicationDeadline"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Salary Range</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Salary (USD)
                  </label>
                  <input
                    type="number"
                    id="salaryMin"
                    name="salaryMin"
                    value={formData.salaryMin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. 80000"
                  />
                </div>
                
                <div>
                  <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Salary (USD)
                  </label>
                  <input
                    type="number"
                    id="salaryMax"
                    name="salaryMax"
                    value={formData.salaryMax}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. 120000"
                  />
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Job Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Provide a detailed description of the role..."
              />
            </div>

            {/* Responsibilities */}
            <div>
              <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-1">
                Key Responsibilities *
              </label>
              <textarea
                id="responsibilities"
                name="responsibilities"
                required
                rows={4}
                value={formData.responsibilities}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="List the main responsibilities for this role..."
              />
            </div>

            {/* Requirements */}
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                Requirements *
              </label>
              <textarea
                id="requirements"
                name="requirements"
                required
                rows={4}
                value={formData.requirements}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="List the required qualifications and experience..."
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Required Skills
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Add a skill (e.g. React, Node.js)"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-indigo-600 hover:text-indigo-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-1">
                Benefits & Perks
              </label>
              <textarea
                id="benefits"
                name="benefits"
                rows={3}
                value={formData.benefits}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe the benefits and perks offered..."
              />
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}