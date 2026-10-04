import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { api } from "../services/api"
import type { Job, JobFilters, JobStatus } from "../types"
import FilterBar from "../components/FilterBar"
import KanbanBoard from "../components/KanbanBoard"
import JobCard from "../components/JobCard"
import JobsTable from "../components/JobsTable"
import DeleteConfirmModal from "../components/DeleteConfirmModal"
import { useToast } from "../context/ToastContext"

export default function JobsPage() {
  const { success, error } = useToast()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"kanban" | "grid" | "table">("kanban")
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [filters, setFilters] = useState<JobFilters>({
    search: "",
    status: "All",
    workplaceType: "All",
    sortBy: "dateApplied",
    sortOrder: "desc",
  })

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.getJobs(filters)
      if (res.success) {
        setJobs(res.jobs)
      }
    } catch (err: any) {
      error(err.message || "Failed to fetch jobs")
    } finally {
      setLoading(false)
    }
  }, [filters, error])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const handleFilterChange = (key: keyof JobFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "All",
      workplaceType: "All",
      sortBy: "dateApplied",
      sortOrder: "desc",
    })
  }

  const handleStatusChange = async (jobId: string, newStatus: JobStatus) => {
    try {
      const res = await api.updateJob(jobId, { status: newStatus })
      if (res.success) {
        setJobs((prev) =>
          prev.map((job) => (job._id === jobId ? { ...job, status: newStatus } : job))
        )
        success(`Status updated to ${newStatus}`)
      }
    } catch (err: any) {
      error(err.message || "Failed to update status")
    }
  }

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return
    setIsDeleting(true)
    try {
      await api.deleteJob(jobToDelete._id)
      success(`Application at ${jobToDelete.company} removed.`)
      setJobs((prev) => prev.filter((j) => j._id !== jobToDelete._id))
      setJobToDelete(null)
    } catch (err: any) {
      error(err.message || "Failed to delete job")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExportCsv = () => {
    if (jobs.length === 0) {
      error("No job records to export.")
      return
    }

    const headers = [
      "Company",
      "Job Title",
      "Status",
      "Workplace Type",
      "Location",
      "Salary",
      "Date Applied",
      "Interview Date",
      "Job URL",
      "Contact Email",
      "Notes",
    ]

    const rows = jobs.map((j) => [
      `"${j.company.replace(/"/g, '""')}"`,
      `"${j.jobTitle.replace(/"/g, '""')}"`,
      `"${j.status}"`,
      `"${j.workplaceType}"`,
      `"${(j.location || "").replace(/"/g, '""')}"`,
      `"${(j.salary || "").replace(/"/g, '""')}"`,
      `"${new Date(j.dateApplied).toLocaleDateString()}"`,
      `"${j.interviewDate ? new Date(j.interviewDate).toLocaleDateString() : ""}"`,
      `"${(j.jobUrl || "").replace(/"/g, '""')}"`,
      `"${(j.contactEmail || "").replace(/"/g, '""')}"`,
      `"${(j.notes || "").replace(/"/g, '""')}"`,
    ])

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `job-tracker-applications-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    success("Applications exported to CSV successfully!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Job Applications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track, manage, and accelerate your recruitment pipeline.
          </p>
        </div>

        <Link
          to="/jobs/add-job"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-indigo-200 transition flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <span>+ Add Application</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        totalCount={jobs.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExportCsv={handleExportCsv}
      />

      {/* Content views */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-gray-500 font-medium">Filtering applications...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <span className="text-4xl mb-3 block">🔍</span>
          <h3 className="text-lg font-bold text-gray-800">No matching applications</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1 mb-6">
            We couldn't find any job applications matching your current search or filter criteria.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
            >
              Reset Filters
            </button>
            <Link
              to="/jobs/add-job"
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition"
            >
              + Add New Application
            </Link>
          </div>
        </div>
      ) : viewMode === "kanban" ? (
        <KanbanBoard
          jobs={jobs}
          onDeleteClick={(j) => setJobToDelete(j)}
          onStatusChange={handleStatusChange}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onDeleteClick={(j) => setJobToDelete(j)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <JobsTable
          jobs={jobs}
          onDeleteClick={(j) => setJobToDelete(j)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!jobToDelete}
        title="Delete Application?"
        message={`Are you sure you want to delete your application for ${jobToDelete?.jobTitle} at ${jobToDelete?.company}? This will permanently remove this record.`}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setJobToDelete(null)}
      />
    </div>
  )
}
