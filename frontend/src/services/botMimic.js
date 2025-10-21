import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://hybrid-application-tracking-system-lydq.onrender.com/api'

// Get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Get bot mimic statistics
export const getBotMimicStats = async () => {
  const response = await axios.get(`${API_URL}/bot-mimic/stats`, {
    headers: getAuthHeader()
  })
  return response.data
}

// Get technical applications
export const getTechnicalApplications = async (status = 'all') => {
  const response = await axios.get(`${API_URL}/bot-mimic/applications`, {
    params: { status },
    headers: getAuthHeader()
  })
  return response.data
}

// Process single application
export const processSingleApplication = async (applicationId) => {
  const response = await axios.post(
    `${API_URL}/bot-mimic/process-single/${applicationId}`,
    {},
    { headers: getAuthHeader() }
  )
  return response.data
}

// Process batch of applications
export const processBatchApplications = async (status = 'all', limit = 10) => {
  const response = await axios.post(
    `${API_URL}/bot-mimic/process-batch`,
    { status, limit },
    { headers: getAuthHeader() }
  )
  return response.data
}

// Get activity log
export const getBotMimicActivityLog = async (page = 1, limit = 50) => {
  const response = await axios.get(`${API_URL}/bot-mimic/activity-log`, {
    params: { page, limit },
    headers: getAuthHeader()
  })
  return response.data
}

// Get auto-process status
export const getAutoProcessStatus = async () => {
  const response = await axios.get(`${API_URL}/bot-mimic/auto-process-status`, {
    headers: getAuthHeader()
  })
  return response.data
}

// Enable auto-processing
export const enableAutoProcess = async () => {
  const response = await axios.post(
    `${API_URL}/bot-mimic/auto-process/enable`,
    {},
    { headers: getAuthHeader() }
  )
  return response.data
}

// Disable auto-processing
export const disableAutoProcess = async () => {
  const response = await axios.post(
    `${API_URL}/bot-mimic/auto-process/disable`,
    {},
    { headers: getAuthHeader() }
  )
  return response.data
}
