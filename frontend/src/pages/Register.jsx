import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import auth from '../services/auth'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Applicant')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const data = await auth.register({ name, email, password, role })
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

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-4">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8 items-start">
        {/* Info Panel */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 w-full lg:w-80">
          <h3 className="text-lg font-semibold text-green-900 mb-4">Role Information</h3>
          <div className="space-y-4">
            <div className="p-3 bg-white border border-green-200 rounded-md">
              <div className="font-medium text-gray-900">Admin</div>
              <div className="text-sm text-gray-600">Manages non-technical applications, creates job postings</div>
            </div>
            <div className="p-3 bg-white border border-green-200 rounded-md">
              <div className="font-medium text-gray-900">Bot Mimic</div>
              <div className="text-sm text-gray-600">Performs automated updates for technical roles</div>
            </div>
            <div className="p-3 bg-white border border-green-200 rounded-md">
              <div className="font-medium text-gray-900">Applicant</div>
              <div className="text-sm text-gray-600">Creates and tracks own applications</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="text-sm text-blue-700">
              💡 <strong>Demo Available:</strong> You can use existing demo accounts by going to the <a href="/login" className="text-blue-600 hover:underline font-medium">Login page</a>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
          {error && <div className="mb-4 text-red-600">{error}</div>}
        <input
          type="text"
          placeholder="Name"
          className="w-full mb-4 p-2 border rounded"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
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
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <select
          className="w-full mb-6 p-2 border rounded"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="Applicant">Applicant</option>
          <option value="Bot Mimic">Bot Mimic</option>
          <option value="Admin">Admin</option>
        </select>
        <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800">Register</button>
        <div className="mt-4 text-center text-sm">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </div>
      </form>
      </div>
    </div>
  )
}
