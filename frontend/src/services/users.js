const API_BASE = import.meta.env.VITE_API_BASE || 'https://hybrid-application-tracking-system-lydq.onrender.com/api'

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

export async function getAllUsers() {
  return request('/users')
}

export async function createUser(userData) {
  return request('/users', {
    method: 'POST',
    body: userData
  })
}

export async function deleteUser(userId) {
  return request(`/users/${userId}`, {
    method: 'DELETE'
  })
}

export default { 
  getAllUsers, 
  createUser, 
  deleteUser 
}
