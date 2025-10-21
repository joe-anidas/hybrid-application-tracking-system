import React, { useState, useEffect } from 'react'
import { FileText, Calendar, User, Activity, Shield, Bot, UserIcon, LogIn, UserPlus, Trash2, Briefcase, RefreshCw } from 'lucide-react'
import { getAuditLogs, getAuditLogStats } from '../services/auditLogs'

const AuditLogs = () => {
  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    action: 'all',
    resourceType: 'all',
    page: 1,
    limit: 50
  })
  const [pagination, setPagination] = useState(null)

  useEffect(() => {
    fetchData()
  }, [filters])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [logsData, statsData] = await Promise.all([
        getAuditLogs(filters),
        getAuditLogStats()
      ])
      setLogs(logsData.logs || [])
      setPagination(logsData.pagination)
      setStats(statsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getActionIcon = (action) => {
    switch (action) {
      case 'USER_LOGIN':
        return <LogIn className="h-4 w-4 text-blue-600" />
      case 'USER_LOGOUT':
        return <LogIn className="h-4 w-4 text-gray-600 transform rotate-180" />
      case 'USER_REGISTER':
      case 'USER_CREATED':
      case 'USER_UPDATED':
        return <UserPlus className="h-4 w-4 text-green-600" />
      case 'USER_DELETED':
        return <Trash2 className="h-4 w-4 text-red-600" />
      case 'USER_VIEWED':
        return <User className="h-4 w-4 text-blue-600" />
      case 'JOB_CREATED':
      case 'JOB_UPDATED':
      case 'JOB_DELETED':
      case 'JOB_VIEWED':
        return <Briefcase className="h-4 w-4 text-purple-600" />
      case 'APPLICATION_SUBMITTED':
      case 'APPLICATION_STATUS_UPDATED':
      case 'APPLICATION_UPDATED':
      case 'APPLICATION_DELETED':
      case 'APPLICATION_VIEWED':
        return <FileText className="h-4 w-4 text-indigo-600" />
      case 'PROFILE_UPDATED':
      case 'PROFILE_CREATED':
      case 'PROFILE_VIEWED':
        return <User className="h-4 w-4 text-orange-600" />
      case 'BOT_PROCESS_SINGLE':
      case 'BOT_PROCESS_BATCH':
      case 'BOT_AUTO_PROCESS':
      case 'BOT_COMMENT_ADDED':
      case 'BOT_ACTIVITY_VIEWED':
        return <Bot className="h-4 w-4 text-green-600" />
      case 'DASHBOARD_VIEWED':
        return <Activity className="h-4 w-4 text-gray-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getActionBadgeColor = (action) => {
    switch (action) {
      case 'USER_LOGIN':
      case 'USER_LOGOUT':
        return 'bg-blue-100 text-blue-800'
      case 'USER_REGISTER':
      case 'USER_CREATED':
        return 'bg-green-100 text-green-800'
      case 'USER_DELETED':
        return 'bg-red-100 text-red-800'
      case 'JOB_CREATED':
      case 'JOB_UPDATED':
      case 'JOB_DELETED':
      case 'JOB_VIEWED':
        return 'bg-purple-100 text-purple-800'
      case 'APPLICATION_SUBMITTED':
      case 'APPLICATION_STATUS_UPDATED':
      case 'APPLICATION_VIEWED':
        return 'bg-indigo-100 text-indigo-800'
      case 'PROFILE_UPDATED':
      case 'PROFILE_CREATED':
      case 'PROFILE_VIEWED':
        return 'bg-orange-100 text-orange-800'
      case 'BOT_PROCESS_SINGLE':
      case 'BOT_PROCESS_BATCH':
      case 'BOT_AUTO_PROCESS':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getResourceBadgeColor = (resourceType) => {
    switch (resourceType) {
      case 'User':
        return 'bg-green-100 text-green-800'
      case 'Job':
        return 'bg-purple-100 text-purple-800'
      case 'Application':
        return 'bg-indigo-100 text-indigo-800'
      case 'Profile':
        return 'bg-orange-100 text-orange-800'
      case 'Auth':
        return 'bg-blue-100 text-blue-800'
      case 'System':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin':
        return <Shield className="h-4 w-4 text-purple-600" />
      case 'Bot Mimic':
        return <Bot className="h-4 w-4 text-green-600" />
      case 'Applicant':
        return <UserIcon className="h-4 w-4 text-blue-600" />
      case 'System':
        return <Activity className="h-4 w-4 text-gray-600" />
      default:
        return <UserIcon className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatActionName = (action) => {
    return action.replace(/_/g, ' ')
  }

  if (loading && !logs.length) {
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
            <div className="text-red-700">Error loading audit logs: {error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Activity className="h-8 w-8 text-indigo-600 mr-3" />
            Audit Logs
          </h1>
          <p className="mt-2 text-gray-600">Complete audit trail of all system activities</p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Stats Cards */}
          {stats && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Activity className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Logs</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalLogs}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Last 24 Hours</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.logsLast24Hours}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg col-span-2">
              <div className="p-5">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Action Breakdown</h3>
                <div className="flex flex-wrap gap-2">
                  {stats.actionBreakdown.slice(0, 5).map((item) => (
                    <span key={item._id} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionBadgeColor(item._id)}`}>
                      {formatActionName(item._id)}: {item.count}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Action Filter */}
              <div className="w-full sm:w-64">
                <label className="block text-xs font-medium text-gray-700 mb-1">Action Type</label>
                <select
                  value={filters.action}
                  onChange={(e) => setFilters({ ...filters, action: e.target.value, page: 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="all">All Actions</option>
                  <optgroup label="Authentication">
                    <option value="USER_LOGIN">User Login</option>
                    <option value="USER_LOGOUT">User Logout</option>
                    <option value="USER_REGISTER">User Register</option>
                  </optgroup>
                  <optgroup label="User Management">
                    <option value="USER_CREATED">User Created</option>
                    <option value="USER_DELETED">User Deleted</option>
                  </optgroup>
                  <optgroup label="Job Management">
                    <option value="JOB_CREATED">Job Created</option>
                    <option value="JOB_UPDATED">Job Updated</option>
                    <option value="JOB_DELETED">Job Deleted</option>
                    <option value="JOB_VIEWED">Job Viewed</option>
                  </optgroup>
                  <optgroup label="Applications">
                    <option value="APPLICATION_SUBMITTED">Application Submitted</option>
                    <option value="APPLICATION_STATUS_UPDATED">Status Updated</option>
                    <option value="APPLICATION_VIEWED">Application Viewed</option>
                  </optgroup>
                  <optgroup label="Profile Management">
                    <option value="PROFILE_CREATED">Profile Created</option>
                    <option value="PROFILE_UPDATED">Profile Updated</option>
                    <option value="PROFILE_VIEWED">Profile Viewed</option>
                  </optgroup>
                  <optgroup label="Bot Mimic">
                    <option value="BOT_PROCESS_SINGLE">Bot Process Single</option>
                    <option value="BOT_PROCESS_BATCH">Bot Process Batch</option>
                    <option value="BOT_AUTO_PROCESS">Bot Auto Process</option>
                  </optgroup>
                </select>
              </div>

              {/* Resource Type Filter */}
              <div className="w-full sm:w-64">
                <label className="block text-xs font-medium text-gray-700 mb-1">Resource Type</label>
                <select
                  value={filters.resourceType}
                  onChange={(e) => setFilters({ ...filters, resourceType: e.target.value, page: 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="all">All Resources</option>
                  <option value="User">User</option>
                  <option value="Job">Job</option>
                  <option value="Application">Application</option>
                  <option value="Profile">Profile</option>
                  <option value="Auth">Auth</option>
                  <option value="System">System</option>
                </select>
              </div>
            </div>

            <button
              onClick={fetchData}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors whitespace-nowrap"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Activity Log</h3>
            <p className="text-sm text-gray-600 mt-1">
              Complete audit trail of all system activities
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => {
                  // Use populated user data if available, otherwise fall back to stored values
                  const userName = log.user?.name || log.userName || 'System'
                  const userRole = log.user?.role || log.userRole || 'System'
                  const targetType = log.targetType || 'System'
                  
                  return (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-2">
                          {getRoleIcon(userRole)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{userName}</div>
                          <div className="text-xs text-gray-500">{userRole}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionBadgeColor(log.action)}`}>
                          {formatActionName(log.action)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResourceBadgeColor(targetType)}`}>
                        {targetType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                      {log.actionDescription}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.ipAddress || 'N/A'}
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>

          {logs.length === 0 && (
            <div className="text-center py-12">
              <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No audit logs found</p>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing page {pagination.page} of {pagination.pages} ({pagination.total} total logs)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    disabled={filters.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    disabled={filters.page >= pagination.pages}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}

export default AuditLogs
