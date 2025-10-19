import reactLogo from '../assets/react.svg'

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section id="home" className="mx-auto max-w-6xl px-4 py-16 sm:py-24 grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">
              Track applications the simple way
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              A lightweight, no-fuss landing to kickstart your Hybrid Application Tracking System.
              Add roles, statuses, and notes—all in one clean interface.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#cta" className="inline-flex items-center justify-center rounded-md bg-slate-900 text-white px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-slate-800">
                Create your first entry
              </a>
              <a href="#features" className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Learn more
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                <div>
                  <p className="text-slate-900 font-medium">Frontend Developer</p>
                  <p className="text-slate-500 text-sm">Applied · In Review</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-md border border-slate-200 p-3">
                  <p className="text-slate-500">Company</p>
                  <p className="font-medium text-slate-900">Acme Inc.</p>
                </div>
                <div className="rounded-md border border-slate-200 p-3">
                  <p className="text-slate-500">Location</p>
                  <p className="font-medium text-slate-900">Remote</p>
                </div>
                <div className="rounded-md border border-slate-200 p-3">
                  <p className="text-slate-500">Stage</p>
                  <p className="font-medium text-slate-900">Phone Screen</p>
                </div>
              </div>
              <div className="mt-4 rounded-md bg-slate-50 border border-slate-200 p-3 text-slate-700 text-sm">
                "Remember to highlight the design system work and metrics."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">Everything you need</h2>
        <p className="mt-2 text-slate-600">Start simple. Extend as you go.</p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Quick capture',
              body: 'Add roles with company, location, status, and notes in seconds.'
            },
            {
              title: 'Progress at a glance',
              body: 'See where each application stands and what\'s next.'
            },
            {
              title: 'Portable data',
              body: 'Keep it lightweight—export or sync however you prefer.'
            },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="size-8 rounded-md bg-slate-900/90 mb-3" />
              <h3 className="text-slate-900 font-medium">{f.title}</h3>
              <p className="mt-1 text-slate-600 text-sm">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-8 sm:p-10 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">Ready to get organized?</h3>
              <p className="mt-1 text-white/80">Spin up your tracker and add your first position now.</p>
            </div>
            <a
              href="#home"
              className="inline-flex items-center justify-center rounded-md bg-white text-slate-900 px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-white/90"
            >
              Add a role
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500 flex items-center justify-between">
          <p>© {new Date().getFullYear()} Hybrid ATS</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-700">Privacy</a>
            <a href="#" className="hover:text-slate-700">Terms</a>
          </div>
        </div>
      </footer>
    </>
  )
}

