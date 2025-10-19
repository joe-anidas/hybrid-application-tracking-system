import { Routes, Route, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Admin from './pages/Admin.jsx'
import ApplicantDashboard from './pages/ApplicantDashboard.jsx'
import BotMimicDashboard from './pages/BotMimicDashboard.jsx'
import reactLogo from './assets/react.svg'

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return children
}

function AppContent() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-b from-white to-slate-50 text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={reactLogo} alt="Logo" className="size-7" />
            <span className="font-semibold tracking-tight">Hybrid ATS</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-slate-600">
            {user ? (
              <>
                <span className="text-slate-900 font-medium">{user.name} ({user.role})</span>
                <button 
                  onClick={logout}
                  className="hover:text-slate-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-slate-900">Login</Link>
                <Link to="/register" className="rounded-md bg-slate-900 text-white px-3 py-1.5 hover:bg-slate-800">Register</Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Admin />
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
          path="/bot-mimic" 
          element={
            <ProtectedRoute allowedRoles={['Bot Mimic']}>
              <BotMimicDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
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

