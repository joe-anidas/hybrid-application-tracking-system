import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, FileText, Briefcase, Clock, Plus, Eye, Activity, TrendingUp } from 'lucide-react'
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
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-700">Error loading dashboard: {error}</div>
          </div>
        </div>
      </div>
    )
  }

  const { stats } = dashboardData

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Activity className="h-8 w-8 text-indigo-600 mr-3" />
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600">Overview of system activity and statistics</p>
          </div>
          <button
            onClick={() => navigate('/admin/analytics')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            View Analytics
          </button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-6">
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

        {/* Action Buttons - Bigger and more prominent */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <button 
            onClick={() => navigate('/admin/manage-jobs')}
            className="flex flex-col items-center justify-center p-8 bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-indigo-500 transition-all group"
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
              <Briefcase className="h-8 w-8 text-indigo-600 group-hover:text-white transition-colors" />
            </div>
            <span className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">Manage Job Postings</span>
            <span className="text-sm text-gray-500 mt-1">Create, edit & delete jobs</span>
          </button>
          
          <button 
            onClick={() => navigate('/admin/review-applications')}
            className="flex flex-col items-center justify-center p-8 bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-green-500 transition-all group"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
              <Eye className="h-8 w-8 text-green-600 group-hover:text-white transition-colors" />
            </div>
            <span className="text-base font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Review Applications</span>
            <span className="text-sm text-gray-500 mt-1">View all submissions</span>
          </button>
          
          <button 
            onClick={() => navigate('/admin/manage-users')}
            className="flex flex-col items-center justify-center p-8 bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-purple-500 transition-all group"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
              <Users className="h-8 w-8 text-purple-600 group-hover:text-white transition-colors" />
            </div>
            <span className="text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Manage Users</span>
            <span className="text-sm text-gray-500 mt-1">User administration</span>
          </button>
          
          <button 
            onClick={() => navigate('/admin/audit-logs')}
            className="flex flex-col items-center justify-center p-8 bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-orange-500 transition-all group"
          >
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
              <Activity className="h-8 w-8 text-orange-600 group-hover:text-white transition-colors" />
            </div>
            <span className="text-base font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">Audit Logs</span>
            <span className="text-sm text-gray-500 mt-1">System activity</span>
          </button>
        </div>
      </div>
    </div>
  )
}
