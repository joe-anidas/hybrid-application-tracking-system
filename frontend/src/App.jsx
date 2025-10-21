import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Admin from './pages/AdminDashboard.jsx'
import AnalyticsDashboard from './pages/AnalyticsDashboard.jsx'
import CreateJob from './pages/CreateJob.jsx'
import EditJob from './pages/EditJob.jsx'
import ManageJobs from './pages/ManageJobs.jsx'
import ReviewApplications from './pages/ReviewApplications.jsx'
import Jobs from './pages/Jobs.jsx'
import JobDetails from './pages/JobDetails.jsx'
import JobApplication from './pages/JobApplication.jsx'
import ApplicantProfile from './pages/ApplicantProfile.jsx'
import ApplicantDashboard from './pages/ApplicantDashboard.jsx'
import ApplicationReview from './pages/ApplicationReview.jsx'
import BotMimicDashboard from './pages/BotMimicDashboard.jsx'
import ManageUsers from './pages/ManageUsers.jsx'
import AuditLogs from './pages/AuditLogs.jsx'
import ApplicationDetailAdmin from './pages/ApplicationDetailAdmin.jsx'
import reactLogo from './assets/logo.png'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    window.location.href = '/login'
    return null
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to home page if user doesn't have permission
    return <Navigate to="/" replace />
  }

  return children
}

function AppContent() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const dropdownRef = useRef(null)

  // Get dashboard route based on user role
  const getDashboardRoute = () => {
    if (!user) return '/'
    switch (user.role) {
      case 'Admin':
        return '/admin'
      case 'Applicant':
        return '/applicant'
      case 'Bot Mimic':
        return '/bot-mimic'
      default:
        return '/'
    }
  }

  const getProfileRoute = () => {
    if (!user) return '/login'
    switch (user.role) {
      case 'Applicant':
        return '/profile'
      default:
        return getDashboardRoute()
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800'
      case 'Applicant':
        return 'bg-blue-100 text-blue-800'
      case 'Bot Mimic':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get avatar gradient color based on role
  const getAvatarGradient = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-gradient-to-br from-purple-500 to-pink-600'
      case 'Applicant':
        return 'bg-gradient-to-br from-indigo-500 to-blue-600'
      case 'Bot Mimic':
        return 'bg-gradient-to-br from-green-500 to-teal-600'
      default:
        return 'bg-gradient-to-br from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-b from-white to-slate-50 text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <nav className="mx-auto max-w-7xl px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={reactLogo} alt="Logo" className="size-7" />
            <span className="font-semibold tracking-tight">Hybrid ATS</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-slate-600">
            {user && (
              <>
                <Link to="/" className="hover:text-slate-900 font-medium transition-colors">
                  Home
                </Link>
                <Link to={getDashboardRoute()} className="hover:text-slate-900 font-medium transition-colors">
                  Dashboard
                </Link>
              </>
            )}
            <Link to="/jobs" className="hover:text-slate-900 font-medium transition-colors">
              Jobs
            </Link>
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className={`h-9 w-9 rounded-full ${getAvatarGradient(user.role)} flex items-center justify-center text-white font-semibold text-sm shadow-md hover:shadow-lg transition-shadow`}>
                    {getInitials(user.name)}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-fadeIn">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full ${getAvatarGradient(user.role)} flex items-center justify-center text-white font-semibold`}>
                          {getInitials(user.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate(getDashboardRoute())
                          setShowProfileMenu(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Dashboard
                      </button>

                      {user.role === 'Applicant' && (
                        <button
                          onClick={() => {
                            navigate('/profile')
                            setShowProfileMenu(false)
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </button>
                      )}

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={() => {
                          logout()
                          setShowProfileMenu(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="hover:text-slate-900 transition-colors">Login</Link>
                <Link to="/register" className="rounded-md bg-slate-900 text-white px-3 py-1.5 hover:bg-slate-800 transition-colors">Register</Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route 
          path="/jobs/:id/apply" 
          element={
            <ProtectedRoute allowedRoles={['Applicant']}>
              <JobApplication />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute allowedRoles={['Applicant']}>
              <ApplicantProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/analytics" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AnalyticsDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/create-job" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <CreateJob />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/edit-job/:id" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <EditJob />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/manage-jobs" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <ManageJobs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/review-applications" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <ReviewApplications />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/applications/:id" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <ApplicationDetailAdmin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/manage-users" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <ManageUsers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/audit-logs" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AuditLogs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applicant" 
          element={
            <ProtectedRoute allowedRoles={['Applicant']}>
              <ApplicantDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applications/:id" 
          element={
            <ProtectedRoute allowedRoles={['Applicant']}>
              <ApplicationReview />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/bot-mimic" 
          element={
            <ProtectedRoute allowedRoles={['Bot Mimic']}>
              <BotMimicDashboard />
            </ProtectedRoute>
          } 
        />
        {/* Catch-all route for 404 - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

