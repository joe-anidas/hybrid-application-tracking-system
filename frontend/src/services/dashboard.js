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

export async function getApplicantDashboard() {
  return request('/dashboard/applicant')
}

export async function getBotMimicDashboard() {
  return request('/dashboard/bot-mimic')
}

export async function getAdminDashboard() {
  return request('/dashboard/admin')
}

export default { 
  getApplicantDashboard, 
  getBotMimicDashboard, 
  getAdminDashboard 
}