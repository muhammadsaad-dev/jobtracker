import { Link } from "react-router-dom"
import type { Job, JobStatus } from "../types"
import JobCard from "./JobCard"

interface KanbanBoardProps {
  jobs: Job[]
  onDeleteClick: (job: Job) => void
  onStatusChange: (jobId: string, newStatus: JobStatus) => void
}

const columns: { status: JobStatus; title: string; color: string; border: string; bg: string }[] = [
  {
    status: "Applied",
    title: "Applied",
    color: "text-blue-700 bg-blue-100",
    border: "border-t-4 border-t-blue-500",
    bg: "bg-blue-50/30",
  },
  {
    status: "Interviewing",
    title: "Interviewing",
    color: "text-amber-700 bg-amber-100",
    border: "border-t-4 border-t-amber-500",
    bg: "bg-amber-50/30",
  },
  {
    status: "Offer",
    title: "Offer Received",
    color: "text-purple-700 bg-purple-100",
    border: "border-t-4 border-t-purple-500",
    bg: "bg-purple-50/30",
  },
  {
    status: "Rejected",
    title: "Rejected",
    color: "text-rose-700 bg-rose-100",
    border: "border-t-4 border-t-rose-500",
    bg: "bg-rose-50/30",
  },
  {
    status: "Hired",
    title: "Hired 🎉",
    color: "text-emerald-700 bg-emerald-100",
    border: "border-t-4 border-t-emerald-500",
    bg: "bg-emerald-50/30",
  },
]

export default function KanbanBoard({ jobs, onDeleteClick, onStatusChange }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
      {columns.map((col) => {
        const columnJobs = jobs.filter((j) => j.status === col.status)

        return (
          <div
            key={col.status}
            className={`bg-gray-50/80 rounded-2xl p-3.5 border border-gray-200 ${col.border} min-h-[420px] flex flex-col`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-gray-800 text-sm">{col.title}</h4>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.color}`}
                >
                  {columnJobs.length}
                </span>
              </div>
              <Link
                to={`/jobs/add-job?status=${col.status}`}
                className="w-6 h-6 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-gray-200 flex items-center justify-center text-sm font-bold transition"
                title={`Add application to ${col.title}`}
              >
                +
              </Link>
            </div>

            {/* Column Cards */}
            <div className="space-y-3 flex-1">
              {columnJobs.length === 0 ? (
                <div className="h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-4 text-center">
                  <span className="text-xs text-gray-400 font-medium">No jobs in {col.status}</span>
                </div>
              ) : (
                columnJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onDeleteClick={onDeleteClick}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
