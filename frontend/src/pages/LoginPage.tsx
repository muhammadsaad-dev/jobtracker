import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const { login } = useAuth()
  const { success, error } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as any)?.from?.pathname || "/dashboard"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !password) {
      error("Please enter both email and password.")
      return
    }

    setSubmitting(true)
    try {
      await login(email.trim(), password)
      success("Logged in successfully! Welcome back.")
      navigate(from, { replace: true })
    } catch (err: any) {
      error(err.message || "Failed to log in. Please check your credentials.")
    } finally {
      setSubmitting(false)
    }
  }

  // Quick Demo credentials button
  const handleQuickDemo = () => {
    setEmail("demo@jobtracker.dev")
    setPassword("password123")
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center mx-auto text-2xl shadow-inner">
            🔐
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-gray-500">
            Sign in to access your recruitment pipeline and metrics.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 text-sm font-bold text-white rounded-xl shadow-md transition flex items-center justify-center gap-2 ${
              submitting
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
            }`}
          >
            {submitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>{submitting ? "Signing in..." : "Sign In"}</span>
          </button>
        </form>

        {/* Demo Account Fill Helper */}
        <div className="pt-2 border-t border-gray-100 text-center">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline"
          >
            Fill with Demo Credentials (Quick Test)
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-bold text-indigo-600 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
