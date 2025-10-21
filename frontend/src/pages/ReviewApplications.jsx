import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Search, Eye, MessageSquare, ExternalLink } from 'lucide-react'
import { getAllApplications, updateApplicationStatus } from '../services/applications'

const STATUS_COLORS = {
  submitted: 'bg-blue-100 text-blue-800 border border-blue-300',
  'under-review': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  shortlisted: 'bg-green-100 text-green-800 border border-green-300',
  rejected: 'bg-red-100 text-red-800 border border-red-300',
  withdrawn: 'bg-gray-100 text-gray-800 border border-gray-300',
  accepted: 'bg-purple-100 text-purple-800 border border-purple-300'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [jobTypeFilter, setJobTypeFilter] = useState('all')
  const [updatingStatus, setUpdatingStatus] = useState(null)
  const [commentModal, setCommentModal] = useState({ show: false, applicationId: null, currentComment: '' })
  const [savingComment, setSavingComment] = useState(false)

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
  }, [applications, searchTerm, statusFilter, jobTypeFilter])

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

    // Filter by job type
    if (jobTypeFilter !== 'all') {
      filtered = filtered.filter(app => app.job?.type === jobTypeFilter)
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

  const handleOpenCommentModal = (application) => {
    console.log('Opening comment modal for application:', application._id)
    console.log('Current notes:', application.notes)
    setCommentModal({
      show: true,
      applicationId: application._id,
      currentComment: application.notes || ''
    })
  }

  const handleSaveComment = async () => {
    try {
      setSavingComment(true)
      await updateApplicationStatus(commentModal.applicationId, undefined, commentModal.currentComment)
      
      // Update local state
      setApplications(prev =>
        prev.map(app =>
          app._id === commentModal.applicationId 
            ? { ...app, notes: commentModal.currentComment } 
            : app
        )
      )
      
      setCommentModal({ show: false, applicationId: null, currentComment: '' })
    } catch (err) {
      console.error('Error saving comment:', err)
      alert('Failed to save comment: ' + err.message)
    } finally {
      setSavingComment(false)
    }
  }

  const handleCloseCommentModal = () => {
    setCommentModal({ show: false, applicationId: null, currentComment: '' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-700">Error loading applications: {error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="h-8 w-8 text-indigo-600 mr-3" />
            Review Applications
          </h1>
          <p className="mt-2 text-gray-600">Review and manage job applications</p>
        </div>

        {/* Main Content */}
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
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Job Type:</label>
                <select
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 w-40"
                >
                  <option value="all">All Types</option>
                  <option value="Technical">Technical</option>
                  <option value="Non-Technical">Non-Technical</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 w-40"
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
                      Job Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied On
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
                  {filteredApplications.map((application) => (
                    <tr key={application._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.applicant?.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.applicant?.email || 'N/A'}
                          </div>
                        </div>
                      </td>
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
                        <div className="text-sm text-gray-900">{application.job?.type || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(getSubmissionDate(application))}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={application.status}
                          onChange={(e) => handleStatusChange(application._id, e.target.value)}
                          disabled={updatingStatus === application._id}
                          className={`text-xs font-medium px-3 py-1.5 rounded focus:ring-2 focus:ring-indigo-500 ${STATUS_COLORS[application.status]}`}
                        >
                          {STATUS_OPTIONS.map(status => (
                            <option key={status} value={status}>
                              {status.replace('-', ' ')}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleOpenCommentModal(application)}
                          className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                          title={application.notes || 'Add comment'}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {application.notes ? (
                            <span className="text-xs text-gray-500 max-w-xs truncate">{application.notes}</span>
                          ) : (
                            <span className="text-xs text-gray-400">Add</span>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => navigate(`/admin/applications/${application._id}`)}
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

        {/* Comment Modal */}
        {commentModal.show && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 py-6">
              {/* Background overlay */}
              <div 
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                aria-hidden="true"
                onClick={handleCloseCommentModal}
              ></div>

              {/* Modal panel */}
              <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full z-10">
                <div className="px-6 py-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Add/Edit Comment</h3>
                  <textarea
                    value={commentModal.currentComment}
                    onChange={(e) => setCommentModal(prev => ({ ...prev, currentComment: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your comment about this applicant..."
                    autoFocus
                  />
                </div>
                <div className="bg-gray-50 px-6 py-3 flex flex-row-reverse gap-2">
                  <button
                    type="button"
                    onClick={handleSaveComment}
                    disabled={savingComment}
                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingComment ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseCommentModal}
                    disabled={savingComment}
                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
