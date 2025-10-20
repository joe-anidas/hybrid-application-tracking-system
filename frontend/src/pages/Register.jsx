import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import auth from '../services/auth'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      // Only allow Applicant registration
      const data = await auth.register({ name, email, password, role: 'Applicant' })
      login(data.user, data.token)
      navigate('/applicant')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-4">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8 items-start">
        {/* Info Panel */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 w-full lg:w-80">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Applicant Registration</h3>
          <div className="space-y-4">
            <div className="p-3 bg-white border border-blue-200 rounded-md">
              <div className="font-medium text-gray-900">Register as Applicant</div>
              <div className="text-sm text-gray-600 mt-2">
                Create an account to browse and apply for jobs, track your applications, and manage your profile.
              </div>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="text-sm text-yellow-800">
                <strong>⚠️ Note:</strong> Only applicants can register through this page. Admin and Bot Mimic accounts are created by administrators.
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="text-sm text-green-700">
              💡 <strong>Demo Available:</strong> You can use existing demo accounts by going to the <a href="/login" className="text-green-600 hover:underline font-medium">Login page</a>
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
        <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800">Register as Applicant</button>
        <div className="mt-4 text-center text-sm">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </div>
      </form>
      </div>
    </div>
  )
}
