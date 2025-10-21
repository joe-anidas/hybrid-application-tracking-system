import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import auth from '../services/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  
  const redirectUrl = searchParams.get('redirect')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const data = await auth.login({ email, password })
      login(data.user, data.token)
      
      // If there's a redirect URL, go there
      if (redirectUrl) {
        navigate(redirectUrl)
        return
      }
      
      // Otherwise, route based on user role
      switch (data.user.role) {
        case 'Admin':
          navigate('/admin')
          break
        case 'Bot Mimic':
          navigate('/bot-mimic')
          break
        case 'Applicant':
        default:
          navigate('/applicant')
          break
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const demoUsers = [
    { role: 'Admin', name: 'Admin User', email: 'admin@demo.com', password: 'Admin@Demo2025!Secure', badge: 'Admin' },
    { role: 'Bot Mimic', name: 'Bot Mimic User', email: 'bot@demo.com', password: 'BotMimic@Demo2025!Auto', badge: 'Automation' },
    { role: 'Applicant', name: 'John Doe', email: 'applicant@demo.com', password: 'Applicant@Demo2025!Job', badge: 'Full Stack Dev' },
    { role: 'Applicant', name: 'Sarah Wilson', email: 'sarah.wilson@demo.com', password: 'Sarah@Wilson2025!Dev', badge: 'Frontend Dev' },
    { role: 'Applicant', name: 'Michael Chen', email: 'michael.chen@demo.com', password: 'Michael@Chen2025!Ops', badge: 'DevOps' },
    { role: 'Applicant', name: 'Emily Rodriguez', email: 'emily.rodriguez@demo.com', password: 'Emily@Rodriguez2025!HR', badge: 'HR Manager' },
    { role: 'Applicant', name: 'David Kumar', email: 'david.kumar@demo.com', password: 'David@Kumar2025!Mkt', badge: 'Marketing' }
  ]

  const fillDemoCredentials = (demoUser) => {
    setEmail(demoUser.email)
    setPassword(demoUser.password)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-4">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8 items-start">
        {/* Demo Credentials Panel */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 w-full lg:w-96 shadow-lg">
          <h3 className="text-lg font-bold text-blue-900 mb-2">Demo Credentials</h3>
          <p className="text-sm text-blue-700 mb-4">Click to auto-fill login form:</p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {demoUsers.map((user, index) => (
              <button
                key={index}
                type="button"
                onClick={() => fillDemoCredentials(user)}
                className="w-full text-left p-3 bg-white border-2 border-gray-200 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-400 transition-all shadow-sm hover:shadow-md group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900 group-hover:text-blue-900">{user.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    user.role === 'Admin' ? 'bg-red-100 text-red-700' :
                    user.role === 'Bot Mimic' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {user.badge}
                  </span>
                </div>
                <div className="text-xs text-gray-600 truncate">{user.email}</div>
                <div className="text-xs text-gray-400 mt-1">Password: {user.password}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          {error && <div className="mb-4 text-red-600">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          aria-label="Password"
          placeholder="Password"
          className="w-full mb-6 p-2 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800">Login</button>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
        </div>
      </form>
      </div>
    </div>
  )
}
