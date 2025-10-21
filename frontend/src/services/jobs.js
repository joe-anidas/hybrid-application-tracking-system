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
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
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

// Create a new job posting
export const createJob = async (jobData) => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/jobs/create`, {
      method: 'POST',
      body: JSON.stringify(jobData)
    })

    return response
  } catch (error) {
    console.error('Error creating job:', error)
    throw error
  }
}

// Get all job postings
export const getAllJobs = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value)
      }
    })

    const queryString = queryParams.toString()
    const url = `${API_BASE_URL}/api/jobs/all${queryString ? `?${queryString}` : ''}`

    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('Error fetching jobs:', error)
    throw error
  }
}

// Get a single job by ID
export const getJobById = async (jobId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('Error fetching job:', error)
    throw error
  }
}

// Update a job posting
export const updateJob = async (jobId, jobData) => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData)
    })

    return response
  } catch (error) {
    console.error('Error updating job:', error)
    throw error
  }
}

// Delete a job posting
export const deleteJob = async (jobId) => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/jobs/${jobId}`, {
      method: 'DELETE'
    })

    return response
  } catch (error) {
    console.error('Error deleting job:', error)
    throw error
  }
}