import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Briefcase, DollarSign, Clock, Calendar, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getJobById } from '../services/jobs'
import { getProfile } from '../services/profile'

export default function JobDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profileComplete, setProfileComplete] = useState(false)
  const [checkingProfile, setCheckingProfile] = useState(false)

  useEffect(() => {
    fetchJobDetails()
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
      setError('Failed to load job details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Competitive salary'
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
    if (min) return `From $${min.toLocaleString()}`
    if (max) return `Up to $${max.toLocaleString()}`
  }

  const formatDate = (date) => {
    if (!date) return 'Open application'
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const checkProfileCompletion = (profile) => {
    if (!profile) return false
    
    const requiredFields = [
      profile.fullName,
      profile.email,
      profile.phone,
      profile.location,
      profile.summary,
      profile.education && profile.education[0]?.degree,
      profile.experience && profile.experience[0]?.title,
      profile.skills && profile.skills.length > 0
    ]
    
    return requiredFields.every(field => field)
  }

  const handleApplyClick = async () => {
    // Check if user is logged in
    if (!isAuthenticated) {
      // Redirect to login with return URL
      navigate(`/login?redirect=/jobs/${id}`)
      return
    }

    // Check if user is an applicant
    if (user?.role !== 'Applicant') {
      setError('Only applicants can apply for jobs')
      return
    }

    // Check profile completion
    setCheckingProfile(true)
    try {
      const response = await getProfile()
      const isComplete = checkProfileCompletion(response.profile)
      setProfileComplete(isComplete)
      
      if (isComplete) {
        // Profile is complete, go to application form
        navigate(`/jobs/${id}/apply`)
      } else {
        // Profile is incomplete, redirect to profile page
        navigate('/profile?message=complete-profile')
      }
    } catch (err) {
      console.error('Error checking profile:', err)
      // If profile doesn't exist, redirect to profile page
      navigate('/profile?message=create-profile')
    } finally {
      setCheckingProfile(false)
    }
  }

  const getJobTypeBadgeColor = (jobType) => {
    return jobType === 'technical' 
      ? 'bg-blue-100 text-blue-800 border-blue-200' 
      : 'bg-purple-100 text-purple-800 border-purple-200'
  }

  const getEmploymentTypeBadge = (type) => {
    const types = {
      'full-time': 'Full-time',
      'part-time': 'Part-time',
      'contract': 'Contract',
      'internship': 'Internship'
    }
    return types[type] || type
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Jobs
          </button>
          <div className="bg-red-50 border border-red-200 rounded-md p-8 text-center">
            <div className="text-red-700 text-lg mb-4">{error || 'Job not found'}</div>
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
          onClick={() => navigate('/jobs')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Jobs
        </button>

        {/* Job Header Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          {/* Title and Badges */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getJobTypeBadgeColor(job.jobType)}`}>
                {job.jobType === 'technical' ? 'Technical' : 'Non-Technical'}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                {getEmploymentTypeBadge(job.type)}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200 capitalize">
                {job.level} Level
              </span>
              {job.status === 'active' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Now Hiring
                </span>
              )}
            </div>
          </div>

          {/* Job Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start">
              <Briefcase className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <div className="text-sm text-gray-500">Department</div>
                <div className="text-base font-medium text-gray-900">{job.department}</div>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <div className="text-sm text-gray-500">Location</div>
                <div className="text-base font-medium text-gray-900">{job.location}</div>
              </div>
            </div>
            <div className="flex items-start">
              <DollarSign className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <div className="text-sm text-gray-500">Salary</div>
                <div className="text-base font-medium text-gray-900">{formatSalary(job.salaryMin, job.salaryMax)}</div>
              </div>
            </div>
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <div className="text-sm text-gray-500">Application Deadline</div>
                <div className="text-base font-medium text-gray-900">{formatDate(job.applicationDeadline)}</div>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="pt-6 border-t border-gray-200">
            <button 
              onClick={handleApplyClick}
              disabled={checkingProfile}
              className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
            >
              {checkingProfile ? 'Checking profile...' : 'Apply for this position'}
            </button>
            {job.applicants > 0 && (
              <div className="mt-3 flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                {job.applicants} people have applied
              </div>
            )}
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Role</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.description}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Responsibilities</h2>
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">{job.responsibilities}</div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">{job.requirements}</div>
          </section>

          {job.skills && job.skills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {job.benefits && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits & Perks</h2>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">{job.benefits}</div>
            </section>
          )}
        </div>

        {/* Bottom Apply Button */}
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Interested in this role?</h3>
          <p className="text-gray-600 mb-4">Join our team and help build the future</p>
          <button 
            onClick={handleApplyClick}
            disabled={checkingProfile}
            className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
          >
            {checkingProfile ? 'Checking profile...' : 'Apply Now'}
          </button>
        </div>
      </div>
    </div>
  )
}