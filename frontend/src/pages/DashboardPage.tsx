import { useEffect, useState, useCallback } from "react"
import { Link } from "react-router-dom"
import { api } from "../services/api"
import type { Job, JobStats } from "../types"
import AnalyticsCards from "../components/AnalyticsCards"
import JobCard from "../components/JobCard"
import DeleteConfirmModal from "../components/DeleteConfirmModal"
import { useToast } from "../context/ToastContext"
import { useAuth } from "../context/AuthContext"

export default function DashboardPage() {
  const { user } = useAuth()
  const { success, error } = useToast()
  const [stats, setStats] = useState<JobStats | null>(null)
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, jobsRes] = await Promise.all([
        api.getStats(),
        api.getJobs({ sortBy: "createdAt", sortOrder: "desc" }),
      ])

      if (statsRes.success) {
        setStats(statsRes.stats)
      }
      if (jobsRes.success) {
        setRecentJobs(jobsRes.jobs.slice(0, 4))
      }
    } catch (err: any) {
      error(err.message || "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return
    setIsDeleting(true)
    try {
      await api.deleteJob(jobToDelete._id)
      success(`Application for ${jobToDelete.company} removed.`)
      setJobToDelete(null)
      fetchData()
    } catch (err: any) {
      error(err.message || "Failed to delete application.")
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-500 font-medium">Loading dashboard analytics...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with Welcome and Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Welcome back, {user?.name || "Job Hunter"}! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {user?.targetRole ? `Targeting: ${user.targetRole}` : "Here is your recruitment overview."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/jobs"
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl shadow-sm transition"
          >
            View All Applications
          </Link>
          <Link
            to="/jobs/add-job"
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition flex items-center gap-2"
          >
            <span>+ Add Application</span>
          </Link>
        </div>
      </div>

      {/* Analytics KPI Section */}
      {stats && <AnalyticsCards stats={stats} />}

      {/* Recent Applications Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>🕒</span>
            <span>Recently Added Applications</span>
          </h2>
          <Link
            to="/jobs"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Explore all →
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
            <span className="text-4xl mb-3 block">💼</span>
            <h3 className="text-lg font-bold text-gray-800">No applications tracked yet</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1 mb-6">
              Start building your momentum by adding your first job application today.
            </p>
            <Link
              to="/jobs/add-job"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition"
            >
              + Add First Application
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onDeleteClick={(j) => setJobToDelete(j)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!jobToDelete}
        title="Delete Job Application?"
        message={`Are you sure you want to delete your application for ${jobToDelete?.jobTitle} at ${jobToDelete?.company}? This action cannot be undone.`}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setJobToDelete(null)}
      />
    </div>
  )
}
