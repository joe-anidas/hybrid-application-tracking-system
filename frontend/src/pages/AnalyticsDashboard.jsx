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
  Legend,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts'
import { getAllApplications } from '../services/applications'
import { getAllJobs } from '../services/jobs'
import { getAllUsers } from '../services/users'

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
  const [timeFilter, setTimeFilter] = useState('day') // 'day', 'hour', 'month'

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch applications and jobs
      const [appsResponse, jobsResponse] = await Promise.all([
        getAllApplications(),
        getAllJobs({ status: 'active' })
      ])

      const apps = appsResponse.applications || []
      const jobsList = jobsResponse.jobs || []

      // Try to fetch users, but don't fail if it errors
      let usersList = []
      try {
        const usersResponse = await getAllUsers()
        usersList = usersResponse.users || usersResponse || []
      } catch (userError) {
        console.error('Error fetching users (non-critical):', userError)
      }

      setApplications(apps)
      setJobs(jobsList)
      calculateAnalytics(apps, jobsList, usersList)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateAnalytics = (apps, jobsList, usersList) => {
    console.log('Apps sample:', apps[0]) // Debug
    console.log('Users list:', usersList) // Debug
    
    const total = apps.length
    const submitted = apps.filter(a => a.status === 'submitted').length
    const underReview = apps.filter(a => a.status === 'under-review').length
    const shortlisted = apps.filter(a => a.status === 'shortlisted').length
    const accepted = apps.filter(a => a.status === 'accepted').length
    const rejected = apps.filter(a => a.status === 'rejected').length

    // Count non-technical applications - check both 'job' and 'jobId'
    const nonTechnicalApplications = apps.filter(app => {
      const job = app.job || app.jobId
      return job && job.jobType === 'non-technical'
    }).length

    // Count total applicants (users with role 'applicant' or 'Applicant')
    const totalApplicants = Array.isArray(usersList) 
      ? usersList.filter(user => 
          user.role && (user.role.toLowerCase() === 'applicant')
        ).length 
      : 0

    console.log('Total Applicants:', totalApplicants) // Debug

    // By Department - check both 'job' and 'jobId'
    const byDepartment = {}
    apps.forEach(app => {
      const job = app.job || app.jobId
      if (job && job.department) {
        const dept = job.department
        byDepartment[dept] = (byDepartment[dept] || 0) + 1
      }
    })

    console.log('By Department:', byDepartment) // Debug

    // By Job Type - check both 'job' and 'jobId'
    const byJobType = {
      technical: 0,
      'non-technical': 0
    }
    apps.forEach(app => {
      const job = app.job || app.jobId
      if (job && job.jobType) {
        const type = job.jobType
        byJobType[type] = (byJobType[type] || 0) + 1
      }
    })

    console.log('By Job Type:', byJobType) // Debug

    // By Day (last 30 days)
    const byDay = {}
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      byDay[dayKey] = 0
    }
    
    apps.forEach(app => {
      const date = new Date(app.createdAt || app.submittedAt)
      const dayKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      if (byDay.hasOwnProperty(dayKey)) {
        byDay[dayKey] = (byDay[dayKey] || 0) + 1
      }
    })

    // By Hour (last 24 hours)
    const byHour = {}
    for (let i = 23; i >= 0; i--) {
      const date = new Date()
      date.setHours(date.getHours() - i)
      const hourKey = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
      byHour[hourKey] = 0
    }
    
    apps.forEach(app => {
      const date = new Date(app.createdAt || app.submittedAt)
      const now = new Date()
      const hoursDiff = (now - date) / (1000 * 60 * 60)
      
      if (hoursDiff <= 24) {
        const hourKey = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
        if (byHour.hasOwnProperty(hourKey)) {
          byHour[hourKey] = (byHour[hourKey] || 0) + 1
        }
      }
    })

    // By Month (last 12 months)
    const byMonth = {}
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      byMonth[monthKey] = 0
    }
    
    apps.forEach(app => {
      const date = new Date(app.createdAt || app.submittedAt)
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      if (byMonth.hasOwnProperty(monthKey)) {
        byMonth[monthKey] = (byMonth[monthKey] || 0) + 1
      }
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
      totalApplicants,
      nonTechnicalApplications,
      byDepartment,
      byJobType,
      byDay,
      byHour,
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

  const DepartmentPieChart = () => {
    const departmentColors = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444']
    const data = Object.entries(analytics.byDepartment)
      .filter(([_, value]) => value > 0)
      .map(([name, value], index) => ({
        name,
        value,
        color: departmentColors[index % departmentColors.length]
      }))

    console.log('Department Pie Chart Data:', data) // Debug

    if (data.length === 0) {
      return (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-indigo-600" />
            Applications by Department
          </h3>
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            No department data available
          </div>
        </div>
      )
    }

    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
          <PieChart className="h-5 w-5 mr-2 text-indigo-600" />
          Applications by Department
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const JobTypeLineChart = () => {
    const data = Object.entries(analytics.byJobType).map(([name, value]) => ({
      name: name === 'technical' ? 'Technical' : 'Non-Technical',
      applications: value,
      fill: name === 'technical' ? '#6366F1' : '#EC4899' // Indigo for technical, Pink for non-technical
    }))

    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
          Applications by Job Type
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBarChart data={data} barSize={60}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 'dataMax + 2']} />
            <Tooltip />
            <Bar dataKey="applications" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const TimeLineChart = () => {
    const getTimeData = () => {
      switch(timeFilter) {
        case 'hour':
          return Object.entries(analytics.byHour || {}).map(([time, value]) => ({
            time,
            applications: value
          }))
        case 'month':
          return Object.entries(analytics.byMonth || {}).map(([time, value]) => ({
            time,
            applications: value
          }))
        case 'day':
        default:
          return Object.entries(analytics.byDay || {}).map(([time, value]) => ({
            time,
            applications: value
          }))
      }
    }

    const getTitle = () => {
      switch(timeFilter) {
        case 'hour':
          return 'Last 24 Hours'
        case 'month':
          return 'Last 12 Months'
        case 'day':
        default:
          return 'Last 30 Days'
      }
    }

    const data = getTimeData()

    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
            Applications by Time ({getTitle()})
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeFilter('hour')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeFilter === 'hour'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hour
            </button>
            <button
              onClick={() => setTimeFilter('day')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeFilter === 'day'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setTimeFilter('month')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeFilter === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis domain={[0, 'dataMax + 2']} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="applications" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
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
    ].filter(item => item.value > 0) // Only show statuses with values > 0

    const total = statusData.reduce((sum, item) => sum + item.value, 0)

    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
          <PieChart className="h-5 w-5 mr-2 text-indigo-600" />
          Application Status Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </RechartsPieChart>
        </ResponsiveContainer>
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
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="h-8 w-8 mr-3 text-indigo-600" />
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-gray-600">Comprehensive application metrics and insights</p>
        </div>

        {/* Key Metrics - Same 5 boxes as Admin Dashboard */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          <StatCard
            icon={Users}
            title="Total Applications"
            value={analytics.total}
            subtitle="All time"
            color="indigo"
          />
          <StatCard
            icon={Users}
            title="Total Applicants"
            value={analytics.totalApplicants || 0}
            subtitle="Registered applicants"
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

        {/* Status Breakdown and Department Charts - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StatusBreakdown />
          <DepartmentPieChart />
        </div>

        {/* Job Type and Daily Trend - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <JobTypeLineChart />
          <TimeLineChart />
        </div>

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
