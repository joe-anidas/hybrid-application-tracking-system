import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  FileText,
  Briefcase,
  Calendar,
  ExternalLink,
  MessageSquare,
  Edit2
} from 'lucide-react'
import { getApplication as getApplicationById, updateApplicationStatus, downloadResume } from '../services/applications'

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

export default function ApplicationDetailAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [editingStatus, setEditingStatus] = useState(false)
  const [commentModal, setCommentModal] = useState({ show: false, currentComment: '' })
  const [savingComment, setSavingComment] = useState(false)

  // Helper function to safely format dates
  const formatDate = (date) => {
    if (!date) return 'N/A'
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      console.error('Error formatting date:', date, error)
      return 'Invalid Date'
    }
  }

  // Get submission date from application
  const getSubmissionDate = (application) => {
    return application.submittedAt || application.createdAt || application.appliedAt
  }

  useEffect(() => {
    fetchApplication()
  }, [id])

  const fetchApplication = async () => {
    try {
      setLoading(true)
      const data = await getApplicationById(id)
      setApplication(data.application || data)
      setError(null)
    } catch (err) {
      console.error('Error fetching application:', err)
      setError(err.message || 'Failed to load application')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true)
      await updateApplicationStatus(id, newStatus)
      setApplication(prev => ({ ...prev, status: newStatus }))
      setEditingStatus(false)
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update status: ' + err.message)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleOpenCommentModal = () => {
    setCommentModal({
      show: true,
      currentComment: application.notes || ''
    })
  }

  const handleSaveComment = async () => {
    try {
      setSavingComment(true)
      await updateApplicationStatus(id, undefined, commentModal.currentComment)
      setApplication(prev => ({ ...prev, notes: commentModal.currentComment }))
      setCommentModal({ show: false, currentComment: '' })
    } catch (err) {
      console.error('Error saving comment:', err)
      alert('Failed to save comment: ' + err.message)
    } finally {
      setSavingComment(false)
    }
  }

  const handleCloseCommentModal = () => {
    setCommentModal({ show: false, currentComment: '' })
  }

  const handleDownloadResume = () => {
    try {
      downloadResume(application.resumeUrl)
    } catch (err) {
      alert('Failed to download resume: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The application you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/admin/review-applications')}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/review-applications')}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Review Applications
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Application Review</h1>
              <p className="text-gray-600 mt-1">Review application details and manage status</p>
            </div>
            <button
              onClick={handleDownloadResume}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Resume
            </button>
          </div>
        </div>

        {/* Applicant Information Card - Admin Only */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-indigo-600" />
            Applicant Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Name</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {application.applicant?.name || 'Unknown'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {application.applicant?.email || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Job Information Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">
                  {application.job?.title || 'Unknown Position'}
                </h2>
                <button
                  onClick={() => navigate(`/jobs/${application.job?._id}`)}
                  className="text-indigo-600 hover:text-indigo-900 transition-colors"
                  title="View Job Details"
                >
                  <ExternalLink className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-600 mt-1">
                {application.job?.department} • {application.job?.location}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {editingStatus ? (
                <select
                  value={application.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updatingStatus}
                  className={`text-sm font-medium px-3 py-1.5 rounded focus:ring-2 focus:ring-indigo-500 ${STATUS_COLORS[application.status]}`}
                  autoFocus
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>
                      {status.replace('-', ' ')}
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  <span className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium ${STATUS_COLORS[application.status]}`}>
                    {application.status?.replace('-', ' ').toUpperCase() || 'UNKNOWN'}
                  </span>
                  <button
                    onClick={() => setEditingStatus(true)}
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                    title="Edit Status"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500">Applied On</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {formatDate(getSubmissionDate(application))}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Applicants</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {application.job?.applicants || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Available Start</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {formatDate(application.availableStartDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Salary Expectation</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {application.salaryExpectation || 'Not specified'}
              </p>
            </div>
          </div>
        </div>

        {/* Admin Comments Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-indigo-600" />
              Admin Comments
            </h3>
            <button
              onClick={handleOpenCommentModal}
              className="inline-flex items-center px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Edit2 className="h-4 w-4 mr-1.5" />
              {application.notes ? 'Edit' : 'Add'} Comment
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {application.notes || 'No comments yet'}
            </p>
          </div>
        </div>

        {/* Status History Timeline */}
        {application.statusHistory && application.statusHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
              Application Timeline
            </h3>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              {/* Timeline items */}
              <div className="space-y-6">
                {[...application.statusHistory].reverse().map((entry, index) => {
                  const statusColors = {
                    submitted: 'bg-blue-500',
                    'under-review': 'bg-yellow-500',
                    shortlisted: 'bg-purple-500',
                    accepted: 'bg-green-500',
                    rejected: 'bg-red-500',
                    withdrawn: 'bg-gray-500'
                  }
                  const dotColor = statusColors[entry.status] || 'bg-gray-500'
                  
                  return (
                    <div key={index} className="relative pl-10">
                      {/* Dot */}
                      <div className={`absolute left-2.5 top-1 w-3 h-3 ${dotColor} rounded-full border-2 border-white ring-2 ring-gray-100`}></div>
                      
                      {/* Content */}
                      <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white border border-gray-200 capitalize">
                              {entry.status.replace('-', ' ')}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(entry.timestamp)} • {entry.changedByRole}
                              {entry.changedByName && ` (${entry.changedByName})`}
                            </p>
                          </div>
                        </div>
                        {entry.comment && (
                          <p className="text-sm text-gray-700 mt-2 italic">
                            "{entry.comment}"
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Application Details */}
          <div className="space-y-6">
            {/* Cover Letter */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                Cover Letter
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {application.coverLetter || 'No cover letter provided'}
                </p>
              </div>
            </div>

            {/* Why Interested */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-indigo-600" />
                Why Interested in This Role
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {application.whyInterested || 'Not provided'}
                </p>
              </div>
            </div>

            {/* Relevant Experience */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-indigo-600" />
                Relevant Experience
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {application.relevantExperience || 'No experience provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Information */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-indigo-600" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{application.applicant?.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{application.profile?.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm text-gray-900">{application.profile?.location || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            {application.profile?.summary && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Summary</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4">
                  {application.profile.summary}
                </p>
              </div>
            )}

            {/* Education */}
            {application.profile?.education && application.profile.education.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-indigo-600" />
                  Education
                </h3>
                <div className="space-y-3">
                  {application.profile.education.map((edu, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="font-medium text-sm text-gray-900">
                        {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{edu.institution}</p>
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
            {application.profile?.skills && application.profile.skills.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-indigo-600" />
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {application.profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Resume */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                Resume
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-indigo-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {application.resumeFileName || 'Resume.pdf'}
                      </p>
                      <p className="text-xs text-gray-500">Uploaded on {formatDate(getSubmissionDate(application))}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadResume}
                    className="text-indigo-600 hover:text-indigo-900 transition-colors"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
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
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Admin Comment</h3>
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
  )
}
