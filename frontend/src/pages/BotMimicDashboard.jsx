import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Bot, Activity, Clock, TrendingUp, Zap, Calendar, CheckCircle } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { getBotMimicDashboard } from '../services/dashboard'

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

const BotMimicDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        const data = await getBotMimicDashboard()
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
      <DashboardLayout title="Bot Mimic Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="Bot Mimic Dashboard">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-700">Error loading dashboard: {error}</div>
        </div>
      </DashboardLayout>
    )
  }

  const { stats, recentActivity } = dashboardData

  // Mock data for automation performance chart
  const performanceData = [
    { hour: '00:00', processed: 5 },
    { hour: '04:00', processed: 12 },
    { hour: '08:00', processed: 23 },
    { hour: '12:00', processed: 18 },
    { hour: '16:00', processed: 15 },
    { hour: '20:00', processed: 8 }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'reviewed': return <Activity className="h-4 w-4 text-blue-500" />
      case 'interview': return <Calendar className="h-4 w-4 text-green-500" />
      case 'offer': return <CheckCircle className="h-4 w-4 text-purple-500" />
      default: return <Bot className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <DashboardLayout title="Bot Mimic Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            icon={Bot}
            title="Total Processed"
            value={stats.totalProcessed}
            color="blue"
          />
          <StatCard
            icon={Zap}
            title="Today Processed"
            value={stats.todayProcessed}
            color="green"
          />
          <StatCard
            icon={Activity}
            title="Technical Roles"
            value={stats.technicalRoles}
            color="purple"
          />
          <StatCard
            icon={Clock}
            title="Avg Processing Time"
            value={stats.averageProcessingTime}
            color="yellow"
          />
          <StatCard
            icon={TrendingUp}
            title="Success Rate"
            value={`${stats.successRate}%`}
            color="emerald"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Automation Performance Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Processing Activity (Today)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="processed" fill="#3B82F6" name="Applications Processed" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Automation Activity */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Automation Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.applicant} - {activity.position}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(activity.date).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activity.status === 'offer' ? 'bg-green-100 text-green-800' :
                      activity.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bot Status */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Bot Status</h3>
              <p className="text-sm text-gray-500">Automated processing for technical roles is active</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Active</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default BotMimicDashboard