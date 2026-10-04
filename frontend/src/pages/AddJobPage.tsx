import { useState } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { api } from "../services/api"
import type { JobStatus, WorkplaceType } from "../types"
import { useToast } from "../context/ToastContext"

export default function AddJobPage() {
  const [searchParams] = useSearchParams()
  const initialStatus = (searchParams.get("status") as JobStatus) || "Applied"

  const [company, setCompany] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [status, setStatus] = useState<JobStatus>(initialStatus)
  const [workplaceType, setWorkplaceType] = useState<WorkplaceType>("Remote")
  const [location, setLocation] = useState("")
  const [salary, setSalary] = useState("")
  const [jobUrl, setJobUrl] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [dateApplied, setDateApplied] = useState(
    new Date().toISOString().split("T")[0]
  )
  const [interviewDate, setInterviewDate] = useState("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()
  const { success, error } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!company.trim() || !jobTitle.trim()) {
      error("Please provide both company name and job title.")
      return
    }

    setSubmitting(true)
    try {
      const res = await api.createJob({
        company: company.trim(),
        jobTitle: jobTitle.trim(),
        status,
        workplaceType,
        location: location.trim() || undefined,
        salary: salary.trim() || undefined,
        jobUrl: jobUrl.trim() || undefined,
        contactEmail: contactEmail.trim() || undefined,
        dateApplied: new Date(dateApplied).toISOString(),
        interviewDate: interviewDate ? new Date(interviewDate).toISOString() : undefined,
        notes: notes.trim() || undefined,
      })

      if (res.success) {
        success(`Added application for ${company}!`)
        navigate("/jobs")
      }
    } catch (err: any) {
      error(err.message || "Failed to add job application")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top breadcrumb */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition"
      >
        <span>←</span>
        <span>Back to Applications</span>
      </Link>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <div className="mb-6 pb-4 border-b border-gray-100">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Track New Application
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details below to log your job application into the tracker.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Company & Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google, Stripe, Linear"
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer"
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Row 2: Status & Workplace Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as JobStatus)}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer Received</option>
                <option value="Rejected">Rejected</option>
                <option value="Hired">Hired 🎉</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Workplace Type
              </label>
              <select
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value as WorkplaceType)}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="Remote">🌐 Remote</option>
                <option value="Hybrid">🏢 Hybrid</option>
                <option value="On-site">📍 On-site</option>
              </select>
            </div>
          </div>

          {/* Row 3: Compensation & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Compensation / Salary
              </label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. $130,000 - $160,000 / yr"
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA or Remote"
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Row 4: Dates (Applied & Interview) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Date Applied
              </label>
              <input
                type="date"
                value={dateApplied}
                onChange={(e) => setDateApplied(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Upcoming Interview Date (optional)
              </label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Row 5: Job URL & Contact Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Job Posting URL (optional)
              </label>
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Recruiter / Contact Email (optional)
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="recruiter@company.com"
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Row 6: Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Notes & Follow-up Details
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Referral name, questions asked during screener, tech stack highlights, or next steps..."
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition leading-relaxed"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <Link
              to="/jobs"
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-md transition flex items-center gap-2 ${
                submitting
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
              }`}
            >
              {submitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{submitting ? "Saving..." : "Save Application"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
