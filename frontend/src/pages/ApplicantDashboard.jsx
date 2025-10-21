import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, CheckCircle, User, Edit, ChevronRight, Eye, ExternalLink, Users, MessageSquare } from 'lucide-react'
import { getProfile } from '../services/profile'
import { getMyApplications } from '../services/applications'

// Comment Tooltip Component
const CommentTooltip = ({ comment }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  
  if (!comment) {
    return <span className="text-gray-400 italic text-xs">No comments</span>
  }

  // Truncate to first 2 words
  const words = comment.trim().split(/\s+/)
  const truncated = words.slice(0, 2).join(' ')
  const shouldTruncate = words.length > 2

  return (
    <div className="relative inline-block">
      <div
        className="flex items-center gap-0.5 cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <MessageSquare className="h-3 w-3 text-gray-400 flex-shrink-0" />
        <span className="text-xs text-gray-900">
          {truncated}{shouldTruncate && '...'}
        </span>
      </div>
      
      {/* Tooltip Popup */}
      {showTooltip && (
        <div className="absolute z-50 left-0 top-full mt-2 w-72 bg-gray-900 text-white text-xs rounded-lg shadow-lg p-3 animate-fadeIn">
          <div className="font-semibold mb-1 text-gray-200">Feedback:</div>
          <div className="text-gray-100 leading-relaxed whitespace-pre-wrap break-words">
            {comment}
          </div>
          {/* Arrow */}
          <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </div>
      )}
    </div>
  )
}

const STATUS_COLORS = {
  submitted: 'bg-blue-100 text-blue-800',
  'under-review': 'bg-yellow-100 text-yellow-800',
  shortlisted: 'bg-purple-100 text-purple-800',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-800',
  accepted: 'bg-green-100 text-green-800'
}

const ApplicantDashboard = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [applications, setApplications] = useState([])
  const [profileCompletion, setProfileCompletion] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        const [profileData, applicationsData] = await Promise.all([
          getProfile(),
          getMyApplications()
        ])
        setProfile(profileData.profile)
        setApplications(applicationsData.applications || [])
        
        // Calculate profile completion
        if (profileData.profile) {
          const completion = calculateProfileCompletion(profileData.profile)
          setProfileCompletion(completion)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const calculateProfileCompletion = (profile) => {
    if (!profile) return 0
    
    const fields = [
      profile.fullName,
      profile.email,
      profile.phone,
      profile.location,
      profile.summary,
      profile.education && profile.education[0]?.degree,
      profile.experience && profile.experience[0]?.title,
      profile.skills && profile.skills.length > 0
    ]
    
    const completed = fields.filter(field => field).length
    return Math.round((completed / fields.length) * 100)
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  const getSubmissionDate = (application) => {
    return application.submittedAt || application.createdAt || application.appliedAt
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-700">Error loading dashboard: {error}</div>
          </div>
        </div>
      </div>
    )
  }

  const applicantName = profile?.fullName || 'Applicant'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome, {applicantName}!
              </h2>
              <p className="text-gray-600 mt-1">
                Track your applications and manage your profile from here.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Profile Completion</div>
                <div className="text-2xl font-bold text-indigo-600">{profileCompletion}%</div>
              </div>
              <button
                onClick={() => navigate('/profile')}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                {profileCompletion < 100 ? 'Complete Profile' : 'Edit Profile'}
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* My Applications Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-indigo-600" />
              My Applications
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Track all your job applications and their current status
            </p>
          </div>

          {applications.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h4>
              <p className="text-gray-600 mb-4">Start applying to jobs to see them here</p>
              <button
                onClick={() => navigate('/jobs')}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Browse Jobs
                <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied On
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicants
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Comments
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application) => (
                    <tr key={application._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {application.job?.title || 'Unknown Position'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.job?.location || 'N/A'}
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(`/jobs/${application.job?._id}`)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                            title="View Job Details"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.job?.department || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(getSubmissionDate(application))}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <Users className="h-4 w-4 text-gray-400" />
                          {application.job?.applicants || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[application.status]}`}>
                          {application.status?.replace('-', ' ') || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <CommentTooltip comment={application.notes} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => navigate(`/applications/${application._id}`)}
                          className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-xs font-medium"
                          title="Review Application"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1.5" />
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ApplicantDashboard