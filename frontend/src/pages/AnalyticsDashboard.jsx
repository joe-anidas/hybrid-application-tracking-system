import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  Clock,
  BarChart3,
  PieChart,
  Calendar,
  Target,
  FileText
} from 'lucide-react'
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts'
import { getAllApplications } from '../services/applications'
import { getAllJobs } from '../services/jobs'

export default function AnalyticsDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState([])
  const [jobs, setJobs] = useState([])
  const [analytics, setAnalytics] = useState({
    total: 0,
    submitted: 0,
    underReview: 0,
    shortlisted: 0,
    accepted: 0,
    rejected: 0,
    byDepartment: {},
    byJobType: {},
    byMonth: {},
    avgProcessingTime: 0,
    conversionRate: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [appsResponse, jobsResponse] = await Promise.all([
        getAllApplications(),
        getAllJobs({ status: 'active' })
      ])

      const apps = appsResponse.applications || []
      const jobsList = jobsResponse.jobs || []

      setApplications(apps)
      setJobs(jobsList)
      calculateAnalytics(apps, jobsList)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateAnalytics = (apps, jobsList) => {
    const total = apps.length
    const submitted = apps.filter(a => a.status === 'submitted').length
    const underReview = apps.filter(a => a.status === 'under-review').length
    const shortlisted = apps.filter(a => a.status === 'shortlisted').length
    const accepted = apps.filter(a => a.status === 'accepted').length
    const rejected = apps.filter(a => a.status === 'rejected').length

    // Count non-technical applications
    const nonTechnicalApplications = apps.filter(app => 
      app.jobId?.jobType === 'non-technical'
    ).length

    // Count total users (would need API call, using placeholder)
    const totalUsers = 0 // This would come from API

    // By Department
    const byDepartment = {}
    apps.forEach(app => {
      const dept = app.jobId?.department || 'Unknown'
      byDepartment[dept] = (byDepartment[dept] || 0) + 1
    })

    // By Job Type
    const byJobType = {
      technical: 0,
      'non-technical': 0
    }
    apps.forEach(app => {
      const type = app.jobId?.jobType || 'non-technical'
      byJobType[type] = (byJobType[type] || 0) + 1
    })

    // By Month (sorted chronologically)
    const byMonth = {}
    apps.forEach(app => {
      const date = new Date(app.createdAt || app.submittedAt)
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      byMonth[monthYear] = (byMonth[monthYear] || 0) + 1
    })

    // Conversion Rate
    const conversionRate = total > 0 ? ((accepted / total) * 100).toFixed(1) : 0

    setAnalytics({
      total,
      submitted,
      underReview,
      shortlisted,
      accepted,
      rejected,
      totalUsers,
      nonTechnicalApplications,
      byDepartment,
      byJobType,
      byMonth,
      conversionRate
    })
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'indigo' }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
              {subtitle && <dd className="text-sm text-gray-500">{subtitle}</dd>}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )

  const BarChart = ({ data, title, color = 'bg-indigo-500' }) => {
    const maxValue = Math.max(...Object.values(data))
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
          {title}
        </h3>
        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{key}</span>
                <span className="text-sm font-semibold text-gray-900">{value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${color} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${(value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }



  const StatusBreakdown = () => {
    const statusData = [
      { name: 'Submitted', value: analytics.submitted, color: '#3B82F6' },
      { name: 'Under Review', value: analytics.underReview, color: '#F59E0B' },
      { name: 'Shortlisted', value: analytics.shortlisted, color: '#10B981' },
      { name: 'Accepted', value: analytics.accepted, color: '#8B5CF6' },
      { name: 'Rejected', value: analytics.rejected, color: '#EF4444' }
    ]

    const total = statusData.reduce((sum, item) => sum + item.value, 0)

    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
          <PieChart className="h-5 w-5 mr-2 text-indigo-600" />
          Application Status Breakdown
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend with counts */}
          <div className="flex flex-col justify-center space-y-3">
            {statusData.map((status) => {
              const percentage = total > 0 ? ((status.value / total) * 100).toFixed(1) : 0
              return (
                <div key={status.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">{status.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{status.value} apps</span>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">{percentage}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="h-8 w-8 mr-3 text-indigo-600" />
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-gray-600">Comprehensive application metrics and insights</p>
        </div>

        {/* Key Metrics - Same 5 boxes as Admin Dashboard */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            icon={Users}
            title="Total Applications"
            value={analytics.total}
            subtitle="All time"
            color="indigo"
          />
          <StatCard
            icon={Users}
            title="Total Users"
            value={analytics.totalUsers || 0}
            subtitle="Registered users"
            color="green"
          />
          <StatCard
            icon={Briefcase}
            title="Active Job Postings"
            value={jobs.length}
            subtitle="Open positions"
            color="blue"
          />
          <StatCard
            icon={FileText}
            title="Non-Tech Applications"
            value={analytics.nonTechnicalApplications || 0}
            subtitle="Non-technical roles"
            color="yellow"
          />
          <StatCard
            icon={Clock}
            title="Pending Review"
            value={analytics.submitted + analytics.underReview}
            subtitle="Awaiting action"
            color="red"
          />
        </div>

        {/* Status Breakdown */}
        <StatusBreakdown />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChart
            data={analytics.byDepartment}
            title="Applications by Department"
            color="bg-indigo-500"
          />
          <BarChart
            data={analytics.byJobType}
            title="Applications by Job Type"
            color="bg-indigo-500"
          />
        </div>

        {/* Monthly Trend */}
        <BarChart
          data={analytics.byMonth}
          title="Applications by Month"
          color="bg-indigo-500"
        />

        {/* Additional Insights */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Success Rate</dt>
                    <dd className="text-lg font-medium text-gray-900">{analytics.conversionRate}%</dd>
                    <dd className="text-sm text-gray-500">{analytics.accepted} accepted out of {analytics.total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Rejection Rate</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {analytics.total > 0 ? ((analytics.rejected / analytics.total) * 100).toFixed(1) : 0}%
                    </dd>
                    <dd className="text-sm text-gray-500">{analytics.rejected} rejected applications</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {analytics.total > 0 ? (((analytics.submitted + analytics.underReview + analytics.shortlisted) / analytics.total) * 100).toFixed(1) : 0}%
                    </dd>
                    <dd className="text-sm text-gray-500">{analytics.submitted + analytics.underReview + analytics.shortlisted} pending</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
