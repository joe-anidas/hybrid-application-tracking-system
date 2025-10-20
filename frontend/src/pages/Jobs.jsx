import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, MapPin, Clock, Banknote, Filter, Search, ChevronRight, Calendar } from 'lucide-react'
import { getAllJobs } from '../services/jobs'

export default function Jobs() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    jobType: '',
    department: '',
    workFromHome: false,
    partTime: false,
    salaryRange: [0, 50], // in LPA
    minExperience: 0, // minimum years only
    status: 'active'
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [filters])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await getAllJobs(filters)
      
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesWorkFromHome = !filters.workFromHome || job.location.toLowerCase().includes('remote') || job.location.toLowerCase().includes('work from home')
    const matchesPartTime = !filters.partTime || job.type === 'part-time'
    
    const jobSalaryInLPA = job.salaryMin ? job.salaryMin / 100000 : 0
    const matchesSalary = jobSalaryInLPA >= filters.salaryRange[0]
    
    const jobMinExperience = job.experienceMin !== undefined ? job.experienceMin : 0
    const matchesExperience = jobMinExperience >= filters.minExperience
    
    return matchesSearch && matchesWorkFromHome && matchesPartTime && matchesSalary && matchesExperience
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

  const getEmploymentTypeBadge = (type) => {
    const types = {
      'full-time': 'Full-time',
      'part-time': 'Part-time',
      'contract': 'Contract',
      'internship': 'Internship'
    }
    return types[type] || type
  }

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Open Positions</h1>
          <p className="text-gray-600">
            Join our team and help build the future
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="flex gap-6 h-[calc(100vh-200px)]">
          {/* Left Sidebar - Fixed, No Scroll */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2 text-indigo-600" />
                Search & Filter
              </h2>

              {/* Search Box */}
              <div className="mb-5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Job title, department, location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Job Type Filter */}
              <div className="mb-5">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700 w-24">Job Type</label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => handleFilterChange('jobType', e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Types</option>
                    <option value="technical">Technical</option>
                    <option value="non-technical">Non-Technical</option>
                  </select>
                </div>
              </div>

              {/* Department Filter */}
              <div className="mb-5">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700 w-24">Department</label>
                  <select
                    value={filters.department}
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Data & Analytics">Data & Analytics</option>
                  </select>
                </div>
              </div>

              {/* Work Preferences - Checkboxes Side by Side */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Preferences</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.workFromHome}
                      onChange={(e) => handleFilterChange('workFromHome', e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-700">Work from Home</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.partTime}
                      onChange={(e) => handleFilterChange('partTime', e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-700">Part-time</span>
                  </label>
                </div>
              </div>

              {/* Salary Range Filter */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Salary: ₹{filters.salaryRange[0]} LPA
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={filters.salaryRange[0]}
                  onChange={(e) => handleFilterChange('salaryRange', [parseInt(e.target.value), filters.salaryRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹0 LPA</span>
                  <span>₹50 LPA</span>
                </div>
              </div>

              {/* Experience Filter */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Experience: {filters.minExperience} years
                </label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={filters.minExperience}
                  onChange={(e) => handleFilterChange('minExperience', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 years</span>
                  <span>15+ years</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <div className="text-red-700 text-sm">{error}</div>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <>
                {/* Results Count at Top */}
                <div className="mb-4">
                  <p className="text-base font-medium text-gray-700">
                    {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''} found
                  </p>
                </div>

                {/* Jobs Grid */}
                {filteredJobs.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                    <p className="text-gray-600">
                      {searchTerm || filters.jobType || filters.department
                        ? 'Try adjusting your search or filters'
                        : 'Check back soon for new opportunities'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8 pb-6">
                    {filteredJobs.map((job) => (
                      <div
                        key={job._id}
                        onClick={() => handleJobClick(job._id)}
                        className="bg-white rounded-lg shadow-sm p-5 hover:shadow-lg transition-all cursor-pointer border border-gray-200 hover:border-indigo-400 duration-200"
                      >
                        {/* Job Title and Badges on same line */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600">
                                {job.title}
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getJobTypeBadgeColor(job.jobType)}`}>
                                  {job.jobType === 'technical' ? 'Technical' : 'Non-Technical'}
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                                  {job.level}
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {getEmploymentTypeBadge(job.type)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                        </div>

                        {/* Job Details - All in one line */}
                        <div className="flex items-center gap-6 mb-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span>{job.department}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Banknote className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                          </div>
                          {(job.experienceMin !== undefined || job.experienceMax !== undefined) && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                              <span>
                                {job.experienceMin !== undefined && job.experienceMax !== undefined
                                  ? `${job.experienceMin}-${job.experienceMax} year${job.experienceMax !== 1 ? 's' : ''}`
                                  : job.experienceMin !== undefined
                                  ? `${job.experienceMin}+ year${job.experienceMin !== 1 ? 's' : ''}`
                                  : `Up to ${job.experienceMax} year${job.experienceMax !== 1 ? 's' : ''}`
                                }
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Description/Responsibilities Preview */}
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {job.description}
                            {job.description && job.description.length > 150 && '...'}
                          </p>
                        </div>

                        {/* Skills */}
                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {job.skills.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills.length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                ...
                              </span>
                            )}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Posted on {formatDate(job.createdAt)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Apply by {formatDate(job.applicationDeadline)}</span>
                            </div>
                          </div>
                          {job.applicants > 0 && (
                            <div className="flex-shrink-0 ml-2">
                              {job.applicants} applicant{job.applicants !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}