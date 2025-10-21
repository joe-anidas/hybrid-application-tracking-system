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
      <div className="w-full max-w-md">
        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
          {error && <div className="mb-4 text-red-600">{error}</div>}
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full mb-4 p-2 border rounded"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          autoComplete="name"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="new-password"
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
