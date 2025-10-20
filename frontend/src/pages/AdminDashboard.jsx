import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, FileText, Briefcase, Clock, Plus, Eye } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { getAdminDashboard } from '../services/dashboard'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

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

export default function Admin() {
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        const data = await getAdminDashboard()
        setDashboardData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <DashboardLayout title="Admin Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="Admin Dashboard">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-700">Error loading dashboard: {error}</div>
        </div>
      </DashboardLayout>
    )
  }

  const { stats, recentActivity, jobPostings } = dashboardData

  const getActivityIcon = (type) => {
    switch (type) {
      case 'job_posting': return <Briefcase className="h-4 w-4 text-blue-500" />
      case 'review': return <Eye className="h-4 w-4 text-green-500" />
      case 'user_registration': return <Users className="h-4 w-4 text-purple-500" />
      default: return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            icon={FileText}
            title="Total Applications"
            value={stats.totalApplications}
            color="indigo"
          />
          <StatCard
            icon={Users}
            title="Total Users"
            value={stats.totalUsers}
            color="green"
          />
          <StatCard
            icon={Briefcase}
            title="Active Job Postings"
            value={stats.activeJobPostings}
            color="blue"
          />
          <StatCard
            icon={FileText}
            title="Non-Tech Applications"
            value={stats.nonTechnicalApplications}
            color="yellow"
          />
          <StatCard
            icon={Clock}
            title="Pending Review"
            value={stats.pendingReview}
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Job Postings Management */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Active Job Postings</h3>
              <button 
                onClick={() => navigate('/admin/create-job')}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                New Job
              </button>
            </div>
            <div className="space-y-3">
              {jobPostings.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-500">{job.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{job.applicants} applicants</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Admin Activity */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.title || activity.applicant || activity.user}
                      {activity.position && ` - ${activity.position}`}
                      {activity.role && ` (${activity.role})`}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(activity.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/admin/create-job')}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Job Posting
            </button>
            <button 
              onClick={() => navigate('/admin/review-applications')}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Eye className="h-4 w-4 mr-2" />
              Review Applications
            </button>
            <button 
              onClick={() => navigate('/admin/manage-users')}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
