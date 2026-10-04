import { Link } from "react-router-dom"

type JobStatus = "Applied" | "Interviewing" | "Offer" | "Rejected" | "Hired"

export interface Job {
  _id: string
  userId: string
  company: string
  jobTitle: string
  status: JobStatus
  dateApplied: string
  notes?: string
  createdAt: string
  updatedAt: string
}

const statusColors: Record<JobStatus, string> = {
  Applied: "bg-blue-100 text-blue-700",
  Interviewing: "bg-yellow-100 text-yellow-700",
  Offer: "bg-purple-100 text-purple-700",
  Rejected: "bg-red-100 text-red-700",
  Hired: "bg-green-100 text-green-700",
}

export default function Job({ job }: { job: Job }) {
  return (
    <Link to={`/jobs/${job._id}`} className="block">
      <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 border border-gray-200 hover:shadow-lg transition cursor-pointer">
        {/* Company & Title */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">{job.company}</h2>
          <p className="text-gray-600 text-sm">{job.jobTitle}</p>
        </div>

        {/* Status & Date */}
        <div className="flex justify-between items-center mb-4">
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${
              statusColors[job.status]
            }`}
          >
            {job.status}
          </span>
          <span className="text-gray-500 text-sm">
            Applied: {new Date(job.dateApplied).toLocaleDateString()}
          </span>
        </div>

        {/* Notes */}
        {job.notes && <p className="text-gray-700 text-sm mb-4">{job.notes}</p>}

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>{new Date(job.createdAt).toLocaleDateString()}</span>
          <span>ID: {job._id}</span>
        </div>
      </div>
    </Link>
  )
}
