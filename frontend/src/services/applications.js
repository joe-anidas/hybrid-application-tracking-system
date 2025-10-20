const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

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

// Submit a job application
export const submitApplication = async (formData) => {
  try {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/api/applications/submit`, {
      method: 'POST',
      body: formData // FormData object with resume file
    })
  } catch (error) {
    console.error('Error submitting application:', error)
    throw error
  }
}

// Get applicant's applications
export const getMyApplications = async () => {
  try {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/api/applications/my-applications`)
  } catch (error) {
    console.error('Error fetching applications:', error)
    throw error
  }
}

// Get a specific application
export const getApplication = async (applicationId) => {
  try {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/api/applications/${applicationId}`)
  } catch (error) {
    console.error('Error fetching application:', error)
    throw error
  }
}

// Withdraw an application
export const withdrawApplication = async (applicationId) => {
  try {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/api/applications/${applicationId}/withdraw`, {
      method: 'PUT'
    })
  } catch (error) {
    console.error('Error withdrawing application:', error)
    throw error
  }
}