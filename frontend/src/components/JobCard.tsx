import { Link } from "react-router-dom"
import type { Job, JobStatus, WorkplaceType } from "../types"

interface JobCardProps {
  job: Job
  onDeleteClick: (job: Job) => void
  onStatusChange?: (jobId: string, newStatus: JobStatus) => void
}

export const statusColors: Record<JobStatus, { bg: string; text: string; border: string; dot: string }> = {
  Applied: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  Interviewing: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  Offer: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
  Rejected: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
  Hired: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
}

export const workplaceBadges: Record<WorkplaceType, string> = {
  Remote: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Hybrid: "bg-blue-50 text-blue-700 border-blue-100",
  "On-site": "bg-violet-50 text-violet-700 border-violet-100",
}

export default function JobCard({ job, onDeleteClick, onStatusChange }: JobCardProps) {
  const statusConfig = statusColors[job.status] || statusColors.Applied
  const companyInitial = job.company ? job.company.charAt(0).toUpperCase() : "J"

  // Quick avatar colors based on company letter
  const avatarBgColors = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-red-600",
    "from-cyan-500 to-blue-600",
  ]
  const avatarIndex = (job.company.charCodeAt(0) || 0) % avatarBgColors.length
  const avatarGradient = avatarBgColors[avatarIndex]

  return (
    <div className="bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 p-5 flex flex-col justify-between group">
      <div>
        {/* Header: Company Avatar, Title, Status & Actions */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${avatarGradient} text-white font-black text-lg flex items-center justify-center shadow-sm flex-shrink-0`}
            >
              {companyInitial}
            </div>
            <div className="min-w-0">
              <Link
                to={`/jobs/${job._id}`}
                className="font-bold text-gray-900 text-base hover:text-indigo-600 transition truncate block group-hover:text-indigo-600"
              >
                {job.jobTitle}
              </Link>
              <p className="text-xs font-semibold text-gray-500 truncate">{job.company}</p>
            </div>
          </div>

          {/* Status selector / badge */}
          {onStatusChange ? (
            <select
              value={job.status}
              onChange={(e) => onStatusChange(job._id, e.target.value as JobStatus)}
              onClick={(e) => e.stopPropagation()}
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} cursor-pointer focus:outline-none`}
            >
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
              <option value="Hired">Hired</option>
            </select>
          ) : (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
              {job.status}
            </span>
          )}
        </div>

        {/* Badges / Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3 text-xs">
          <span
            className={`px-2 py-0.5 rounded-md border font-medium ${
              workplaceBadges[job.workplaceType] || "bg-gray-50 text-gray-700"
            }`}
          >
            {job.workplaceType}
          </span>
          {job.location && (
            <span className="px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-gray-600 font-medium truncate max-w-[140px]">
              📍 {job.location}
            </span>
          )}
          {job.salary && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
              💰 {job.salary}
            </span>
          )}
        </div>

        {/* Notes preview */}
        {job.notes && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-3 bg-gray-50/70 p-2 rounded-lg border border-gray-100">
            {job.notes}
          </p>
        )}

        {/* Upcoming Interview alert */}
        {job.interviewDate && job.status === "Interviewing" && (
          <div className="mb-3 px-2.5 py-1.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-xs text-amber-800 font-medium">
            <span>🗓️ Interview:</span>
            <span>{new Date(job.interviewDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Footer: Date applied, Link, Actions */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
        <span>Applied: {new Date(job.dateApplied).toLocaleDateString()}</span>

        <div className="flex items-center gap-2">
          {job.jobUrl && (
            <a
              href={job.jobUrl.startsWith("http") ? job.jobUrl : `https://${job.jobUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:text-indigo-600 transition"
              title="Open Job Posting"
              onClick={(e) => e.stopPropagation()}
            >
              🔗
            </a>
          )}
          <Link
            to={`/jobs/update/${job._id}`}
            className="p-1 hover:text-indigo-600 transition"
            title="Edit Application"
          >
            ✏️
          </Link>
          <button
            onClick={() => onDeleteClick(job)}
            className="p-1 hover:text-rose-600 transition"
            title="Delete Application"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
