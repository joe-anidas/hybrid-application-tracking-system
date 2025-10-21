import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, MapPin, Clock, Banknote, Search, ChevronRight, Calendar, Plus, Trash2, Edit, AlertCircle } from 'lucide-react'
import { getAllJobs, deleteJob } from '../services/jobs'

export default function ManageJobs() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [filters, setFilters] = useState({
    jobType: '',
    status: 'active'
  })

  useEffect(() => {
    fetchJobs()
  }, [filters.jobType]) // Only refetch when jobType changes, not status

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError('')
      // Don't send status to backend, we'll filter on frontend to include expired jobs
      const backendFilters = { 
        jobType: filters.jobType,
        limit: 1000 
      }
      const response = await getAllJobs(backendFilters)
      
      if (response.success) {
        setJobs(response.jobs)
      }
    } catch (err) {
      console.error('Error fetching jobs:', err)
      setError('Failed to load jobs. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (jobId) => {
    try {
      await deleteJob(jobId)
      setJobs(jobs.filter(job => job._id !== jobId))
      setDeleteConfirm(null)
      setError('')
    } catch (err) {
      console.error('Error deleting job:', err)
      setError('Failed to delete job. Please try again.')
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Check if job deadline has passed
  const isJobExpired = (job) => {
    if (!job.applicationDeadline) return false
    const deadline = new Date(job.applicationDeadline)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return deadline < today
  }

  // Get effective status (closed if expired, even if marked active)
  const getEffectiveStatus = (job) => {
    if (isJobExpired(job)) return 'closed'
    return job.status
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Apply status filter based on effective status (includes expired jobs)
    const effectiveStatus = getEffectiveStatus(job)
    const matchesStatus = !filters.status || effectiveStatus === filters.status
    
    return matchesSearch && matchesStatus
  })

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Competitive'
    if (min && max) return `₹${(min / 100000).toFixed(1)} - ${(max / 100000).toFixed(1)} LPA`
    if (min) return `From ₹${(min / 100000).toFixed(1)} LPA`
    if (max) return `Up to ₹${(max / 100000).toFixed(1)} LPA`
  }

  const formatDate = (date) => {
    if (!date) return 'Open'
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const getJobTypeBadgeColor = (jobType) => {
    return jobType === 'technical' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-purple-100 text-purple-800'
  }

  const getStatusBadgeColor = (status) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800'
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
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Briefcase className="h-8 w-8 mr-3 text-indigo-600" />
                Manage Job Postings
              </h1>
              <p className="mt-2 text-gray-600">Create, edit, and delete job postings</p>
            </div>
            <button
              onClick={() => navigate('/admin/create-job')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Job Posting
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-4">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Search & Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Jobs
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, department, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Job Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <select
                value={filters.jobType}
                onChange={(e) => handleFilterChange('jobType', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
              >
                <option value="">All Job Types</option>
                <option value="technical">Technical</option>
                <option value="non-technical">Non-Technical</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Reset Filters Button */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilters({ jobType: '', status: 'active' })
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Jobs Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredJobs.length}</span> of <span className="font-semibold">{jobs.length}</span> jobs
          </p>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJobTypeBadgeColor(job.jobType)}`}>
                              {job.jobType === 'technical' ? 'Technical' : 'Non-Technical'}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(getEffectiveStatus(job))}`}>
                              {getEffectiveStatus(job) === 'active' ? 'Active' : 'Closed'}
                              {isJobExpired(job) && getEffectiveStatus(job) === 'closed' && job.status === 'active' && (
                                <span className="ml-1" title="Deadline expired">(Expired)</span>
                              )}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {getEmploymentTypeBadge(job.type)}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                              {job.level}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                              {job.department}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                              {job.location}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Banknote className="h-4 w-4 mr-2 text-gray-400" />
                              {formatSalary(job.salaryMin, job.salaryMax)}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              Deadline: {formatDate(job.applicationDeadline)}
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => navigate(`/jobs/${job._id}`)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        title="View Details"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/edit-job/${job._id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit Job"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(job._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this job posting? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
