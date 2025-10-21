import React, { useState, useEffect } from 'react'
import { 
  Bot, Activity, Clock, TrendingUp, Zap, Calendar, CheckCircle, 
  Play, Pause, Settings, RefreshCw, AlertCircle, FileText,
  BarChart3, Users, Briefcase, ArrowRight, Filter, XCircle, UserCheck
} from 'lucide-react'
import {
  getBotMimicStats,
  getTechnicalApplications,
  processSingleApplication,
  processBatchApplications,
  getBotMimicActivityLog
} from '../services/botMimic'

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

const STATUS_COLORS = {
  'submitted': 'bg-blue-100 text-blue-800 border-blue-300',
  'under-review': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'shortlisted': 'bg-purple-100 text-purple-800 border-purple-300',
  'rejected': 'bg-red-100 text-red-800 border-red-300',
  'withdrawn': 'bg-gray-100 text-gray-800 border-gray-300',
  'accepted': 'bg-green-100 text-green-800 border-green-300'
}

const BotMimicDashboard = () => {
  const [stats, setStats] = useState(null)
  const [applications, setApplications] = useState([])
  const [activityLog, setActivityLog] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [batchLimit, setBatchLimit] = useState(10)
  const [autoProcessEnabled, setAutoProcessEnabled] = useState(false)
  const [autoProcessInterval, setAutoProcessInterval] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [activeTab, setActiveTab] = useState('applications')

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [statsData, appsData, logData] = await Promise.all([
        getBotMimicStats(),
        getTechnicalApplications(statusFilter),
        getBotMimicActivityLog(1, 50)
      ])

      setStats(statsData.stats)
      setApplications(appsData.applications)
      setActivityLog(logData.logs)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [statusFilter])

  // Handle single application processing
  const handleProcessSingle = async (applicationId) => {
    try {
      setProcessing(true)
      const response = await processSingleApplication(applicationId)
      
      setSuccessMessage(response.message)
      setTimeout(() => setSuccessMessage(null), 3000)
      
      await fetchData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process application')
    } finally {
      setProcessing(false)
    }
  }

  // Handle batch processing
  const handleBatchProcess = async () => {
    try {
      setProcessing(true)
      const response = await processBatchApplications(statusFilter, batchLimit)
      
      setSuccessMessage(
        `Batch completed: ${response.results.processed} processed, ${response.results.failed} failed, ${response.results.skipped} skipped`
      )
      setTimeout(() => setSuccessMessage(null), 5000)
      
      await fetchData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process batch')
    } finally {
      setProcessing(false)
    }
  }

  // Auto-process toggle
  const toggleAutoProcess = () => {
    if (autoProcessEnabled) {
      if (autoProcessInterval) {
        clearInterval(autoProcessInterval)
        setAutoProcessInterval(null)
      }
      setAutoProcessEnabled(false)
      setSuccessMessage('Auto-processing stopped')
      setTimeout(() => setSuccessMessage(null), 3000)
    } else {
      setAutoProcessEnabled(true)
      setSuccessMessage('Auto-processing started (30 second intervals)')
      setTimeout(() => setSuccessMessage(null), 3000)
      
      const interval = setInterval(async () => {
        try {
          await processBatchApplications('all', 5)
          await fetchData()
        } catch (err) {
          console.error('Auto-process error:', err)
        }
      }, 30000)
      
      setAutoProcessInterval(interval)
    }
  }

  useEffect(() => {
    return () => {
      if (autoProcessInterval) {
        clearInterval(autoProcessInterval)
      }
    }
  }, [autoProcessInterval])

  if (loading && !stats) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Bot className="h-8 w-8 text-indigo-600 mr-3" />
            Bot Mimic Dashboard
          </h1>
          <p className="mt-2 text-gray-600">Automated processing system for technical role applications</p>
        </div>
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Control Panel</h2>
              <p className="text-sm text-gray-600">Manage automated processing operations</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchData}
                disabled={processing}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${processing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={toggleAutoProcess}
                className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  autoProcessEnabled
                    ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
                    : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                }`}
              >
                {autoProcessEnabled ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Stop Auto-Process
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Auto-Process
                  </>
                )}
              </button>
            </div>
          </div>

          {autoProcessEnabled && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-center">
              <Zap className="h-5 w-5 text-blue-600 mr-2 animate-pulse" />
              <p className="text-sm text-blue-800">
                Auto-processing is active. Processing up to 5 applications every 30 seconds.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            icon={Briefcase}
            title="Total Applications"
            value={stats?.totalApplications || 0}
            subtitle="Technical roles only"
            color="indigo"
          />
          <StatCard
            icon={Clock}
            title="Pending Review"
            value={stats?.pendingApplications || 0}
            subtitle="Awaiting processing"
            color="yellow"
          />
          <StatCard
            icon={Users}
            title="Shortlisted"
            value={stats?.shortlisted || 0}
            subtitle="Ready for interview"
            color="purple"
          />
          <StatCard
            icon={UserCheck}
            title="Accepted"
            value={stats?.accepted || 0}
            subtitle="Offers extended"
            color="green"
          />
          <StatCard
            icon={XCircle}
            title="Rejected"
            value={stats?.rejected || 0}
            subtitle="Not selected"
            color="red"
          />
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('applications')}
                className={`${
                  activeTab === 'applications'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Applications ({applications.length})
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`${
                  activeTab === 'activity'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                <Activity className="h-4 w-4 inline mr-2" />
                Activity Log ({activityLog.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'applications' ? (
              <ApplicationsTab
                applications={applications}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                batchLimit={batchLimit}
                setBatchLimit={setBatchLimit}
                processing={processing}
                handleBatchProcess={handleBatchProcess}
                handleProcessSingle={handleProcessSingle}
              />
            ) : (
              <ActivityLogTab activityLog={activityLog} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Applications Tab Component
const ApplicationsTab = ({
  applications,
  statusFilter,
  setStatusFilter,
  batchLimit,
  setBatchLimit,
  processing,
  handleBatchProcess,
  handleProcessSingle
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Filter className="h-4 w-4 text-gray-500 mr-2" />
          <label className="text-sm font-medium text-gray-700 mr-2">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block px-4 py-2.5 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">All</option>
            <option value="submitted">Submitted</option>
            <option value="under-review">Under Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="flex items-center">
          <label className="text-sm font-medium text-gray-700 mr-2">Batch Limit:</label>
          <input
            type="number"
            value={batchLimit}
            onChange={(e) => setBatchLimit(parseInt(e.target.value))}
            min="1"
            max="50"
            className="block w-20 px-4 py-2.5 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <button
        onClick={handleBatchProcess}
        disabled={processing || applications.length === 0}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? (
          <>
            <RefreshCw className="animate-spin h-4 w-4 mr-2" />
            Processing...
          </>
        ) : (
          <>
            <Zap className="h-4 w-4 mr-2" />
            Process Batch ({batchLimit})
          </>
        )}
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Applicant
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Applied
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applications.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                No applications found
              </td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr key={app._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{app.applicant.name}</div>
                  <div className="text-sm text-gray-500">{app.applicant.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{app.job.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {app.job.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold border ${STATUS_COLORS[app.status]}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleProcessSingle(app._id)}
                    disabled={processing || !['submitted', 'under-review', 'shortlisted'].includes(app.status)}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowRight className="h-4 w-4 mr-1" />
                    Process
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)

// Activity Log Tab Component
const ActivityLogTab = ({ activityLog }) => (
  <div className="space-y-4">
    <div className="flow-root">
      <ul className="-mb-8">
        {activityLog.length === 0 ? (
          <li className="text-center py-8 text-gray-500">No activity yet</li>
        ) : (
          activityLog.map((log, logIdx) => (
            <li key={log._id}>
              <div className="relative pb-8">
                {logIdx !== activityLog.length - 1 && (
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                      <Bot className="h-5 w-5 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-900">{log.actionDescription}</p>
                      {log.metadata?.comment && (
                        <p className="mt-1 text-sm text-gray-500 italic">
                          "{log.metadata.comment}"
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        {log.metadata?.applicantName} - {log.metadata?.jobTitle}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={log.createdAt}>
                        {new Date(log.createdAt).toLocaleString()}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  </div>
)

export default BotMimicDashboard
