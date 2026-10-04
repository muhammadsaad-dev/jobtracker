import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function LandingPage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-wide uppercase">
          <span>✨</span> Streamline Your Career Search
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-[1.1]">
          Master your job hunt with{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            data-driven clarity
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Say goodbye to chaotic spreadsheets. Track applications, organize interviews, visualize your pipeline with Kanban, and monitor conversion metrics in one cohesive platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition transform hover:-translate-y-0.5 text-base flex items-center justify-center gap-2"
            >
              <span>📊 Go to Dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition transform hover:-translate-y-0.5 text-base flex items-center justify-center gap-2"
              >
                <span>Get Started Free</span>
                <span>→</span>
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-2xl border border-gray-200 shadow-sm transition text-base"
              >
                Sign In to Demo
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl font-bold">
            📋
          </div>
          <h3 className="text-xl font-bold text-gray-900">Interactive Kanban Board</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Move applications seamlessly across status stages — Applied, Interviewing, Offer, and Hired. Maintain momentum with instant visual feedback.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">
            📈
          </div>
          <h3 className="text-xl font-bold text-gray-900">Real-Time Conversion Analytics</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Keep tabs on response rates, interview conversion percentages, and monthly application velocity to optimize your job search strategy.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
            ⚡
          </div>
          <h3 className="text-xl font-bold text-gray-900">Full Search & Data Export</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Instantly search by company, role, or notes. Filter by workplace type (Remote/Hybrid/On-site) and export all records to CSV anytime.
          </p>
        </div>
      </section>

      {/* Interactive Workflow Preview */}
      <section className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            How JobTracker accelerates your job search
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            A battle-tested workflow designed for engineers, designers, and tech professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur space-y-2">
            <span className="text-3xl font-black text-indigo-400">01</span>
            <h4 className="font-bold text-lg">Log in seconds</h4>
            <p className="text-xs text-slate-300">
              Capture company, title, compensation, workplace type, and posting links immediately.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur space-y-2">
            <span className="text-3xl font-black text-amber-400">02</span>
            <h4 className="font-bold text-lg">Track rounds</h4>
            <p className="text-xs text-slate-300">
              Schedule interview dates, write follow-up notes, and track recruiter contact emails.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur space-y-2">
            <span className="text-3xl font-black text-purple-400">03</span>
            <h4 className="font-bold text-lg">Analyze metrics</h4>
            <p className="text-xs text-slate-300">
              Understand which resume versions and role categories yield the highest interview ratios.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur space-y-2">
            <span className="text-3xl font-black text-emerald-400">04</span>
            <h4 className="font-bold text-lg">Land your offer</h4>
            <p className="text-xs text-slate-300">
              Compare multiple offers side-by-side with complete compensation transparency.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
