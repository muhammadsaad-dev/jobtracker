import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { api } from "../services/api"
import type { Job, JobStatus } from "../types"
import { statusColors, workplaceBadges } from "../components/JobCard"
import DeleteConfirmModal from "../components/DeleteConfirmModal"
import { useToast } from "../context/ToastContext"

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { success, error } = useToast()

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return
      try {
        const res = await api.getJob(id)
        if (res.success) {
          setJob(res.job)
        }
      } catch (err: any) {
        error(err.message || "Failed to load application details")
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id, error])

  const handleStatusChange = async (newStatus: JobStatus) => {
    if (!id || !job) return
    try {
      const res = await api.updateJob(id, { status: newStatus })
      if (res.success) {
        setJob((prev) => (prev ? { ...prev, status: newStatus } : null))
        success(`Status changed to ${newStatus}`)
      }
    } catch (err: any) {
      error(err.message || "Failed to update status")
    }
  }

  const handleDelete = async () => {
    if (!id || !job) return
    setIsDeleting(true)
    try {
      await api.deleteJob(id)
      success("Job application deleted successfully")
      navigate("/jobs")
    } catch (err: any) {
      error(err.message || "Failed to delete application")
    } finally {
      setIsDeleting(false)
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

  if (!job) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 max-w-lg mx-auto mt-8">
        <span className="text-4xl mb-3 block">⚠️</span>
        <h2 className="text-xl font-bold text-gray-900">Application Not Found</h2>
        <p className="text-sm text-gray-500 mt-2 mb-6">
          The requested job application record does not exist or was deleted.
        </p>
        <Link
          to="/jobs"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
        >
          ← Back to Applications
        </Link>
      </div>
    )
  }

  const statusConfig = statusColors[job.status] || statusColors.Applied

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition"
      >
        <span>←</span>
        <span>Back to Applications</span>
      </Link>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{job.jobTitle}</h1>
            </div>
            <p className="text-lg font-bold text-indigo-600 mt-1">{job.company}</p>
            {job.location && (
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <span>📍</span> {job.location}
              </p>
            )}
          </div>

          {/* Status selector */}
          <div className="flex flex-col sm:items-end gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Current Status
            </span>
            <select
              value={job.status}
              onChange={(e) => handleStatusChange(e.target.value as JobStatus)}
              className={`text-sm font-bold px-4 py-2 rounded-xl border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} cursor-pointer focus:outline-none`}
            >
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer Received</option>
              <option value="Rejected">Rejected</option>
              <option value="Hired">Hired</option>
            </select>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <span className="text-xs font-bold text-gray-400 uppercase">Workplace</span>
            <div className="mt-1">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold border ${
                  workplaceBadges[job.workplaceType]
                }`}
              >
                {job.workplaceType}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <span className="text-xs font-bold text-gray-400 uppercase">Compensation</span>
            <p className="text-sm font-bold text-gray-900 mt-1">
              {job.salary ? `💰 ${job.salary}` : "Not specified"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <span className="text-xs font-bold text-gray-400 uppercase">Date Applied</span>
            <p className="text-sm font-bold text-gray-900 mt-1">
              {new Date(job.dateApplied).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <span className="text-xs font-bold text-gray-400 uppercase">Interview Date</span>
            <p className="text-sm font-bold text-amber-700 mt-1">
              {job.interviewDate
                ? `🗓️ ${new Date(job.interviewDate).toLocaleDateString()}`
                : "None scheduled"}
            </p>
          </div>
        </div>

        {/* Links & Contact */}
        {(job.jobUrl || job.contactEmail) && (
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-xs text-gray-400">
              External References
            </h3>
            <div className="flex flex-wrap gap-3">
              {job.jobUrl && (
                <a
                  href={job.jobUrl.startsWith("http") ? job.jobUrl : `https://${job.jobUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition"
                >
                  <span>🔗 View Original Job Posting</span>
                </a>
              )}
              {job.contactEmail && (
                <a
                  href={`mailto:${job.contactEmail}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition"
                >
                  <span>✉️ Contact Recruiter ({job.contactEmail})</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Notes & Logs */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Application Notes & Interview Log
          </h3>
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed min-h-[100px]">
            {job.notes || <span className="text-gray-400 italic">No notes added for this role yet.</span>}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-gray-400">
            Last updated: {new Date(job.updatedAt).toLocaleString()}
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to={`/jobs/update/${job._id}`}
              className="flex-1 sm:flex-initial text-center px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold rounded-xl transition"
            >
              ✏️ Edit Details
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-sm font-bold rounded-xl transition"
            >
              🗑️ Delete Application
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete Job Application?"
        message={`Are you sure you want to delete your application for ${job.jobTitle} at ${job.company}?`}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  )
}
