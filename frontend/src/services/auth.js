const API_BASE = import.meta.env.VITE_API_BASE || 'https://hybrid-application-tracking-system-lydq.onrender.com/api'

async function request(path, options = {}) {
  const fetchOptions = {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  }
  // Ensure body is stringified if it's an object
  if (fetchOptions.body && typeof fetchOptions.body !== 'string') {
    fetchOptions.body = JSON.stringify(fetchOptions.body)
  }

  const res = await fetch(`${API_BASE}${path}`, fetchOptions)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    // prefer server-supplied error message but include status for debugging
    const message = data?.error || data?.message || `Request failed (${res.status})`
    throw new Error(message)
  }
  return data
}

export async function register(payload) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function login(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getProfile() {
  const token = localStorage.getItem('token')
  return request('/auth/profile', {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export async function logoutUser() {
  const token = localStorage.getItem('token')
  return request('/auth/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  })
}

export default { register, login, getProfile, logoutUser }
