import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import auth from '../services/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const data = await auth.login({ email, password })
      login(data.user, data.token)
      
      // Route based on user role
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
    { role: 'Admin', email: 'admin@demo.com', password: 'admin123' },
    { role: 'Bot Mimic', email: 'bot@demo.com', password: 'bot123' },
    { role: 'Applicant', email: 'applicant@demo.com', password: 'applicant123' }
  ]

  const fillDemoCredentials = (demoUser) => {
    setEmail(demoUser.email)
    setPassword(demoUser.password)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-4">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8 items-start">
        {/* Demo Credentials Panel */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 w-full lg:w-80">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Demo Credentials</h3>
          <p className="text-sm text-blue-700 mb-4">Click any credential below to auto-fill the login form:</p>
          <div className="space-y-3">
            {demoUsers.map((user, index) => (
              <button
                key={index}
                type="button"
                onClick={() => fillDemoCredentials(user)}
                className="w-full text-left p-3 bg-white border border-blue-200 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <div className="font-medium text-gray-900">{user.role}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
                <div className="text-xs text-gray-500">Password: {user.password}</div>
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
