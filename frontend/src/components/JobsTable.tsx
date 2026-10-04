import { Link } from "react-router-dom"
import type { Job, JobStatus } from "../types"
import { statusColors, workplaceBadges } from "./JobCard"

interface JobsTableProps {
  jobs: Job[]
  onDeleteClick: (job: Job) => void
  onStatusChange: (jobId: string, newStatus: JobStatus) => void
}

export default function JobsTable({ jobs, onDeleteClick, onStatusChange }: JobsTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50/75 text-xs uppercase font-bold text-gray-400 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Company & Title</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Workplace</th>
              <th className="px-6 py-4">Salary</th>
              <th className="px-6 py-4">Applied Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {jobs.map((job) => {
              const statusConfig = statusColors[job.status] || statusColors.Applied
              return (
                <tr key={job._id} className="hover:bg-gray-50/50 transition">
                  {/* Company & Title */}
                  <td className="px-6 py-4">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="font-bold text-gray-900 hover:text-indigo-600 transition block text-sm"
                    >
                      {job.jobTitle}
                    </Link>
                    <span className="text-xs text-gray-500 font-medium">{job.company}</span>
                    {job.location && (
                      <span className="text-[11px] text-gray-400 ml-2">📍 {job.location}</span>
                    )}
                  </td>

                  {/* Status Dropdown */}
                  <td className="px-6 py-4">
                    <select
                      value={job.status}
                      onChange={(e) => onStatusChange(job._id, e.target.value as JobStatus)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} cursor-pointer focus:outline-none`}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Hired">Hired</option>
                    </select>
                  </td>

                  {/* Workplace */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                        workplaceBadges[job.workplaceType] || "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {job.workplaceType}
                    </span>
                  </td>

                  {/* Salary */}
                  <td className="px-6 py-4 text-xs font-semibold text-gray-700">
                    {job.salary ? `💰 ${job.salary}` : "—"}
                  </td>

                  {/* Applied Date */}
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(job.dateApplied).toLocaleDateString()}
                    {job.interviewDate && job.status === "Interviewing" && (
                      <span className="block text-[11px] font-semibold text-amber-600 mt-0.5">
                        🗓️ Int: {new Date(job.interviewDate).toLocaleDateString()}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-xs">
                      {job.jobUrl && (
                        <a
                          href={job.jobUrl.startsWith("http") ? job.jobUrl : `https://${job.jobUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:text-indigo-600 transition"
                          title="Open Link"
                        >
                          🔗
                        </a>
                      )}
                      <Link
                        to={`/jobs/update/${job._id}`}
                        className="p-1.5 hover:text-indigo-600 transition font-medium"
                        title="Edit Job"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => onDeleteClick(job)}
                        className="p-1.5 hover:text-rose-600 transition"
                        title="Delete Job"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
