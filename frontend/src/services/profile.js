const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://hybrid-application-tracking-system-lydq.onrender.com'

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token')
}

// Helper function to make authenticated API calls
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = getAuthToken()
  if (!token) {
    throw new Error('No authentication token found')
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options.headers
  }

  // Only add Content-Type if not multipart/form-data (for file uploads)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(url, {
    ...options,
    headers
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`)
  }

  return data
}

// Get applicant profile
export const getProfile = async () => {
  try {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/api/profile`)
  } catch (error) {
    console.error('Error fetching profile:', error)
    throw error
  }
}

// Update applicant profile
export const updateProfile = async (profileData) => {
  try {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/api/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}