import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FileText, Briefcase, Calendar, DollarSign, Mail, Phone, MapPin, User, GraduationCap, Award, Download, ArrowLeft, ExternalLink } from 'lucide-react'
import { getApplication } from '../services/applications'
import { downloadResume } from '../services/applications'

const STATUS_COLORS = {
  submitted: 'bg-blue-100 text-blue-800',
  'under-review': 'bg-yellow-100 text-yellow-800',
  shortlisted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-800',
  accepted: 'bg-purple-100 text-purple-800'
}

export default function ApplicationReview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchApplication()
  }, [id])

  const fetchApplication = async () => {
    try {
      setLoading(true)
      const response = await getApplication(id)
      console.log('Application data:', response)
      setApplication(response.application)
    } catch (err) {
      console.error('Error fetching application:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return 'Invalid Date'
    }
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
            onClick={() => navigate('/applicant')}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
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
            onClick={() => navigate('/applicant')}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Application Review</h1>
              <p className="text-gray-600 mt-1">Review your application details and submission</p>
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
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[application.status]}`}>
              {application.status?.replace('-', ' ').toUpperCase() || 'UNKNOWN'}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500">Applied On</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {formatDate(application.createdAt || application.submittedAt)}
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
                      <p className="text-xs text-gray-500">Uploaded on {formatDate(application.createdAt)}</p>
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
      </div>
    </div>
  )
}
