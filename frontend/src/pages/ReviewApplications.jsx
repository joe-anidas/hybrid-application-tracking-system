import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Download, Eye, Filter, Search, Calendar, User, Briefcase, Mail, Phone, MapPin, GraduationCap, Award, X } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { getAllApplications, updateApplicationStatus, downloadResume } from '../services/applications'

const STATUS_COLORS = {
  submitted: 'bg-blue-100 text-blue-800',
  'under-review': 'bg-yellow-100 text-yellow-800',
  shortlisted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-800',
  accepted: 'bg-purple-100 text-purple-800'
}

const STATUS_OPTIONS = [
  'submitted',
  'under-review',
  'shortlisted',
  'accepted',
  'rejected'
]

export default function ReviewApplications() {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [filteredApplications, setFilteredApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingStatus, setUpdatingStatus] = useState(null)

  // Helper function to safely format dates
  const formatDate = (date) => {
    if (!date) return 'N/A'
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      console.error('Error formatting date:', date, error)
      return 'Invalid Date'
    }
  }

  const formatDateTime = (date) => {
    if (!date) return 'N/A'
    try {
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.error('Error formatting date time:', date, error)
      return 'Invalid Date'
    }
  }

  // Get submission date from application (handles both submittedAt and createdAt)
  const getSubmissionDate = (application) => {
    return application.submittedAt || application.createdAt || application.appliedAt
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, searchTerm, statusFilter])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAllApplications()
      console.log('Applications response:', response)
      setApplications(response.applications || [])
    } catch (err) {
      console.error('Error fetching applications:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filterApplications = () => {
    let filtered = [...applications]

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.applicant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicant?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job?.department?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredApplications(filtered)
  }

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setUpdatingStatus(applicationId)
      console.log('Updating status:', applicationId, newStatus)
      const response = await updateApplicationStatus(applicationId, newStatus)
      console.log('Status update response:', response)
      
      // Update local state
      setApplications(prev =>
        prev.map(app =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      )
      
      // Update selected application if it's the one being updated
      if (selectedApplication?._id === applicationId) {
        setSelectedApplication(prev => ({ ...prev, status: newStatus }))
      }
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update status: ' + err.message)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleDownloadResume = (resumeUrl) => {
    try {
      downloadResume(resumeUrl)
    } catch (err) {
      alert('Failed to download resume: ' + err.message)
    }
  }

  const handleViewApplication = (application) => {
    console.log('Viewing application:', application)
    setSelectedApplication(application)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    // Don't clear selectedApplication immediately to allow smooth closing animation
    setTimeout(() => setSelectedApplication(null), 300)
  }

  if (loading) {
    return (
      <DashboardLayout title="Review Applications">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="Review Applications">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-700">Error loading applications: {error}</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Review Applications">
      <div className="space-y-6">
        {/* Header with Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by applicant name, email, job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="under-review">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredApplications.length} of {applications.length} applications
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {filteredApplications.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <tr key={application._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {application.applicant?.name || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.applicant?.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.job?.title || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{application.job?.location || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.job?.department || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(getSubmissionDate(application))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[application.status]}`}>
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewApplication(application)}
                          className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleDownloadResume(application.resumeUrl)}
                          className="text-green-600 hover:text-green-900 inline-flex items-center"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Resume
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for Application Details */}
        {showModal && selectedApplication && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div 
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                aria-hidden="true"
                onClick={handleCloseModal}
              ></div>

              {/* Modal panel */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
                {/* Header */}
                <div className="bg-indigo-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white" id="modal-title">
                        {selectedApplication.applicant?.name || 'Unknown Applicant'}
                      </h3>
                      <p className="text-indigo-100 text-sm mt-1">
                        Applied for: {selectedApplication.job?.title || 'Unknown Position'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDownloadResume(selectedApplication.resumeUrl)}
                        className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors text-sm font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Resume
                      </button>
                      <button
                        onClick={handleCloseModal}
                        className="text-white hover:text-indigo-100 transition-colors"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Status Update in Header */}
                  <div className="flex items-center gap-3 mt-4">
                    <label className="text-sm font-medium text-white">Status:</label>
                    <select
                      value={selectedApplication.status}
                      onChange={(e) => handleStatusChange(selectedApplication._id, e.target.value)}
                      disabled={updatingStatus === selectedApplication._id}
                      className="border border-indigo-400 bg-white rounded-md px-3 py-1.5 text-gray-900 focus:ring-2 focus:ring-white focus:border-transparent text-sm"
                    >
                      {STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                        </option>
                      ))}
                    </select>
                    {updatingStatus === selectedApplication._id && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    )}
                  </div>
                </div>

                {/* Modal Content */}
                <div className="bg-white px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Applicant Profile */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center border-b pb-2">
                          <User className="h-5 w-5 mr-2 text-indigo-600" />
                          Applicant Profile
                        </h4>
                        
                        {/* Contact Information */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-start">
                            <Mail className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Email</p>
                              <p className="text-sm text-gray-900">{selectedApplication.applicant?.email || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Phone className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Phone</p>
                              <p className="text-sm text-gray-900">{selectedApplication.profile?.phone || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Location</p>
                              <p className="text-sm text-gray-900">{selectedApplication.profile?.location || 'N/A'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Professional Summary */}
                        {selectedApplication.profile?.summary && (
                          <div className="mb-6">
                            <h5 className="text-sm font-semibold text-gray-900 mb-2">Professional Summary</h5>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">
                              {selectedApplication.profile.summary}
                            </p>
                          </div>
                        )}

                        {/* Education */}
                        {selectedApplication.profile?.education && selectedApplication.profile.education.length > 0 && (
                          <div className="mb-6">
                            <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                              <GraduationCap className="h-4 w-4 mr-2 text-indigo-600" />
                              Education
                            </h5>
                            <div className="space-y-3">
                              {selectedApplication.profile.education.map((edu, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                  <p className="font-medium text-sm text-gray-900">{edu.degree} in {edu.fieldOfStudy}</p>
                                  <p className="text-xs text-gray-600">{edu.institution}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {edu.startDate} - {edu.endDate || 'Present'}
                                    {edu.grade && ` • Grade: ${edu.grade}`}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Skills */}
                        {selectedApplication.profile?.skills && selectedApplication.profile.skills.length > 0 && (
                          <div>
                            <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                              <Award className="h-4 w-4 mr-2 text-indigo-600" />
                              Skills
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {selectedApplication.profile.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column - Application Details */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center border-b pb-2">
                          <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                          Application Details
                        </h4>

                        {/* Job Info */}
                        <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                          <div className="flex items-center mb-2">
                            <Briefcase className="h-4 w-4 mr-2 text-indigo-600" />
                            <span className="text-xs font-semibold text-indigo-900">Position Details</span>
                          </div>
                          <p className="text-sm font-medium text-gray-900">{selectedApplication.job?.title}</p>
                          <p className="text-xs text-gray-600">
                            {selectedApplication.job?.department} • {selectedApplication.job?.location}
                          </p>
                          <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
                            <span>Submitted: {formatDateTime(getSubmissionDate(selectedApplication))}</span>
                          </div>
                        </div>

                        {/* Cover Letter */}
                        <div className="mb-6">
                          <h5 className="text-sm font-semibold text-gray-900 mb-2">Cover Letter</h5>
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 max-h-48 overflow-y-auto">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {selectedApplication.coverLetter || 'No cover letter provided'}
                            </p>
                          </div>
                        </div>

                        {/* Why Interested */}
                        <div className="mb-6">
                          <h5 className="text-sm font-semibold text-gray-900 mb-2">Why Interested</h5>
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {selectedApplication.whyInterested || 'Not provided'}
                            </p>
                          </div>
                        </div>

                        {/* Relevant Experience */}
                        <div className="mb-6">
                          <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                            <Briefcase className="h-4 w-4 mr-2 text-indigo-600" />
                            Relevant Experience
                          </h5>
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 max-h-48 overflow-y-auto">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {selectedApplication.relevantExperience || 'No experience provided'}
                            </p>
                          </div>
                        </div>

                        {/* Additional Details */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Available Start Date</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(selectedApplication.availableStartDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Salary Expectation</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedApplication.salaryExpectation || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
