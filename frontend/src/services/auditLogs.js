const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('token')
  const fetchOptions = {
    headers: { 
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {})
    },
    ...options,
  }
  
  if (fetchOptions.body && typeof fetchOptions.body !== 'string') {
    fetchOptions.body = JSON.stringify(fetchOptions.body)
  }

  const res = await fetch(`${API_BASE}${path}`, fetchOptions)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = data?.error || data?.message || `Request failed (${res.status})`
    throw new Error(message)
  }
  return data
}

export async function getAuditLogs(params = {}) {
  const queryParams = new URLSearchParams()
  
  if (params.page) queryParams.append('page', params.page)
  if (params.limit) queryParams.append('limit', params.limit)
  if (params.action && params.action !== 'all') queryParams.append('action', params.action)
  if (params.resourceType && params.resourceType !== 'all') queryParams.append('resourceType', params.resourceType)
  if (params.user) queryParams.append('user', params.user)
  if (params.startDate) queryParams.append('startDate', params.startDate)
  if (params.endDate) queryParams.append('endDate', params.endDate)
  
  const query = queryParams.toString()
  return request(`/audit-logs${query ? '?' + query : ''}`)
}

export async function getAuditLogStats() {
  return request('/audit-logs/stats')
}

export default { 
  getAuditLogs, 
  getAuditLogStats 
}
