import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { api } from "../services/api"
import type { JobStatus, WorkplaceType } from "../types"
import { useToast } from "../context/ToastContext"

export default function UpdateJobPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { success, error } = useToast()

  const [company, setCompany] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [status, setStatus] = useState<JobStatus>("Applied")
  const [workplaceType, setWorkplaceType] = useState<WorkplaceType>("Remote")
  const [location, setLocation] = useState("")
  const [salary, setSalary] = useState("")
  const [jobUrl, setJobUrl] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [dateApplied, setDateApplied] = useState("")
  const [interviewDate, setInterviewDate] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return
      try {
        const res = await api.getJob(id)
        if (res.success && res.job) {
          const j = res.job
          setCompany(j.company || "")
          setJobTitle(j.jobTitle || "")
          setStatus(j.status || "Applied")
          setWorkplaceType(j.workplaceType || "Remote")
          setLocation(j.location || "")
          setSalary(j.salary || "")
          setJobUrl(j.jobUrl || "")
          setContactEmail(j.contactEmail || "")
          setDateApplied(
            j.dateApplied ? new Date(j.dateApplied).toISOString().split("T")[0] : ""
          )
          setInterviewDate(
            j.interviewDate ? new Date(j.interviewDate).toISOString().split("T")[0] : ""
          )
          setNotes(j.notes || "")
        }
      } catch (err: any) {
        error(err.message || "Failed to load job details")
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id, error])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    if (!company.trim() || !jobTitle.trim()) {
      error("Company name and Job title are required.")
      return
    }

    setUpdating(true)
    try {
      const res = await api.updateJob(id, {
        company: company.trim(),
        jobTitle: jobTitle.trim(),
        status,
        workplaceType,
        location: location.trim() || undefined,
        salary: salary.trim() || undefined,
        jobUrl: jobUrl.trim() || undefined,
        contactEmail: contactEmail.trim() || undefined,
        dateApplied: dateApplied ? new Date(dateApplied).toISOString() : undefined,
        interviewDate: interviewDate ? new Date(interviewDate).toISOString() : undefined,
        notes: notes.trim() || undefined,
      })

      if (res.success) {
        success("Application updated successfully!")
        navigate(`/jobs/${id}`)
      }
    } catch (err: any) {
      error(err.message || "Failed to update job application")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-500 font-medium">Loading application...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to={id ? `/jobs/${id}` : "/jobs"}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition"
      >
        <span>←</span>
        <span>Back to Application</span>
      </Link>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <div className="mb-6 pb-4 border-b border-gray-100">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Edit Application: {company}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Update stage, schedule interviews, or refine role information.
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
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
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
                placeholder="e.g. $140,000 - $160,000"
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
                placeholder="e.g. Seattle, WA or Remote"
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Row 4: Dates */}
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

          {/* Row 5: URL & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Job Posting URL
              </label>
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Recruiter / Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
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
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition leading-relaxed"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <Link
              to={id ? `/jobs/${id}` : "/jobs"}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={updating}
              className={`px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-md transition flex items-center gap-2 ${
                updating
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
              }`}
            >
              {updating && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{updating ? "Saving Changes..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
