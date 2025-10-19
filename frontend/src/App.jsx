import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Admin from './pages/Admin.jsx'
import reactLogo from './assets/react.svg'

function App() {
  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-b from-white to-slate-50 text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={reactLogo} alt="Logo" className="size-7" />
            <span className="font-semibold tracking-tight">Hybrid ATS</span>
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-sm text-slate-600">
            <Link to="/login" className="hover:text-slate-900">Login</Link>
            <Link to="/register" className="rounded-md bg-slate-900 text-white px-3 py-1.5 hover:bg-slate-800">Register</Link>
          </div>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
  <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  )
}

export default App

