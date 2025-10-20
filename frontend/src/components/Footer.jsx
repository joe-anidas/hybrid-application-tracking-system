import React from 'react'
import { Link } from 'react-router-dom'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Footer = () => {
  const { user } = useAuth()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getDashboardRoute = () => {
    if (!user) return '/login'
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

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-semibold text-lg mb-3">Hybrid ATS</h3>
            <p className="text-sm text-slate-400 mb-4">
              Modern application tracking system designed to streamline your hiring process and manage applications efficiently.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="mailto:contact@hybridats.com" className="hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" onClick={scrollToTop} className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/jobs" onClick={scrollToTop} className="hover:text-white transition-colors">Jobs</Link>
              </li>
              {user ? (
                <li>
                  <Link to={getDashboardRoute()} onClick={scrollToTop} className="hover:text-white transition-colors">Dashboard</Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/login" onClick={scrollToTop} className="hover:text-white transition-colors">Login</Link>
                  </li>
                  <li>
                    <Link to="/register" onClick={scrollToTop} className="hover:text-white transition-colors">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">Help Center</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Contact Us</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-sm text-slate-400 text-center">
          <p>&copy; {new Date().getFullYear()} Hybrid ATS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
