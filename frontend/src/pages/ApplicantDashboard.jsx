import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, CheckCircle, User, Edit, ChevronRight, Eye, ExternalLink, Users } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { getProfile } from '../services/profile'
import { getMyApplications } from '../services/applications'

const STATUS_COLORS = {
  submitted: 'bg-blue-100 text-blue-800',
  'under-review': 'bg-yellow-100 text-yellow-800',
  shortlisted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-800',
  accepted: 'bg-purple-100 text-purple-800'
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
      <DashboardLayout title="Applicant Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="Applicant Dashboard">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-700">Error loading dashboard: {error}</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Applicant Dashboard">
      <div className="space-y-6">
        {/* Profile Completion Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <User className="h-6 w-6 mr-2" />
                <h3 className="text-xl font-semibold">Your Profile</h3>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Profile Completion</span>
                  <span className="text-lg font-bold">{profileCompletion}%</span>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
                  <div 
                    className="bg-white h-3 rounded-full transition-all duration-500"
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
              </div>
              {profileCompletion < 100 ? (
                <p className="text-sm text-indigo-100">
                  Complete your profile to increase your chances of getting hired!
                </p>
              ) : (
                <p className="text-sm text-indigo-100 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Your profile is complete and ready for applications!
                </p>
              )}
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="ml-6 px-6 py-3 bg-white text-indigo-600 font-medium rounded-md hover:bg-indigo-50 transition-colors flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              {profileCompletion < 100 ? 'Complete Profile' : 'Edit Profile'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>

        {/* My Applications Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden mt-6">
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate" title={application.notes || ''}>
                          {application.notes || <span className="text-gray-400 italic">No comments</span>}
                        </div>
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
    </DashboardLayout>
  )
}

export default ApplicantDashboard