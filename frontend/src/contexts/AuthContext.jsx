import React, { createContext, useContext, useState, useEffect } from 'react'
import { getProfile, logoutUser } from '../services/auth'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      checkAuthStatus()
    } else {
      setLoading(false)
    }
  }, [])

  const checkAuthStatus = async () => {
    try {
      setLoading(true)
      const response = await getProfile()
      setUser(response.user)
      setError(null)
    } catch (err) {
      console.error('Auth check failed:', err)
      setError(err.message)
      localStorage.removeItem('token')
      setUser(null)
      // Redirect to home page if auth check fails
      if (window.location.pathname !== '/' && 
          window.location.pathname !== '/login' && 
          window.location.pathname !== '/register' &&
          !window.location.pathname.startsWith('/jobs')) {
        window.location.href = '/'
      }
    } finally {
      setLoading(false)
    }
  }

  const login = (userData, token) => {
    localStorage.setItem('token', token)
    setUser(userData)
    setError(null)
  }

  const logout = async () => {
    try {
      // Call backend logout endpoint to log the action
      await logoutUser()
    } catch (err) {
      console.error('Logout API call failed:', err)
      // Continue with logout even if API call fails
    } finally {
      // Always clear local state
      localStorage.removeItem('token')
      setUser(null)
      setError(null)
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}