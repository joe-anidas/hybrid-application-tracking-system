import { Briefcase, Users, Bot, Shield, BarChart3, FileText, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section id="home" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">
              Hybrid Application Tracking System
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              A comprehensive full-stack solution that handles both automated (technical roles) and manual (non-technical roles) application workflows with complete audit trails and role-based access control.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="/register" className="inline-flex items-center justify-center rounded-md bg-slate-900 text-white px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-slate-800">
                Get Started
              </a>
              <a href="#features" className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Learn more
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                  <Briefcase className="size-5" />
                </div>
                <div>
                  <p className="text-slate-900 font-medium">Senior Full Stack Developer</p>
                  <p className="text-slate-500 text-sm">Applied · Technical Assessment</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-md border border-slate-200 p-3">
                  <p className="text-slate-500">Type</p>
                  <p className="font-medium text-slate-900">Technical</p>
                </div>
                <div className="rounded-md border border-slate-200 p-3">
                  <p className="text-slate-500">Location</p>
                  <p className="font-medium text-slate-900">Remote</p>
                </div>
                <div className="rounded-md border border-slate-200 p-3">
                  <p className="text-slate-500">Stage</p>
                  <p className="font-medium text-slate-900">Assessment</p>
                </div>
              </div>
              <div className="mt-4 rounded-md bg-slate-50 border border-slate-200 p-3 text-slate-700 text-sm">
                <span className="font-medium text-slate-900">Bot Mimic:</span> Automatically processed - Technical assessment scheduled
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">Everything you need to streamline hiring</h2>
          <p className="mt-3 text-lg text-slate-600">Powerful features for applicants, admins, and automated workflows</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="size-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
              <Users className="size-7" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Role-Based Access</h3>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Secure JWT authentication</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Three distinct user roles</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Tailored permissions & dashboards</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="size-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
              <Briefcase className="size-7" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Job Management</h3>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Technical & non-technical postings</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Detailed requirements & skills</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Salary ranges & deadlines</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="size-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mb-4">
              <Bot className="size-7" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Automated Processing</h3>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Bot Mimic for technical roles</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Intelligent status progression</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Scheduled & on-demand execution</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="size-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
              <FileText className="size-7" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Application Tracking</h3>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Real-time status updates</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Resume uploads & cover letters</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Complete application history</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="size-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 mb-4">
              <BarChart3 className="size-7" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Analytics & Insights</h3>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Interactive dashboards</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Visual charts & metrics</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Recruitment funnel tracking</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="size-12 rounded-lg bg-red-100 flex items-center justify-center text-red-600 mb-4">
              <Shield className="size-7" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Security & Audit</h3>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Complete audit trails</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Enterprise-grade security</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>User attribution & timestamps</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Key Workflows */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-slate-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">Workflows for Every User Type</h2>
          <p className="mt-3 text-lg text-slate-600">Tailored experiences for applicants, admins, and automated systems</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="size-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
              <Users className="size-7" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Applicant Workflow</h3>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Register and create detailed profile</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Browse and filter job postings</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Apply with resume and cover letter</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Track application status in real-time</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>View feedback and comments</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="size-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
              <Shield className="size-7" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Admin Workflow</h3>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Create and manage job postings</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Review applications with full details</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Update status for non-technical roles</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Access analytics and reports</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Monitor audit logs and user activity</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="size-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mb-4">
              <Bot className="size-7" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Bot Mimic Workflow</h3>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Automated technical role processing</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Intelligent status progression</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Scheduled and on-demand execution</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Processing metrics and statistics</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Complete activity logging</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-8 sm:p-10 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">Ready to streamline your hiring process?</h3>
              <p className="mt-2 text-white/80 text-lg">Start tracking applications with automated and manual workflows today.</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/70">
                <span className="flex items-center gap-1">
                  <CheckCircle className="size-4" /> Complete audit trails
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="size-4" /> Role-based access
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="size-4" /> Real-time analytics
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="/register"
                className="inline-flex items-center justify-center rounded-md bg-white text-slate-900 px-5 py-3 text-sm font-medium shadow-sm hover:bg-white/90 whitespace-nowrap"
              >
                Create Account
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-md border border-white/20 text-white px-5 py-3 text-sm font-medium hover:bg-white/10 whitespace-nowrap"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

