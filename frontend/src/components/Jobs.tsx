import { useEffect, useState } from "react"
import Job from "./Job"

type JobStatus = "Applied" | "Interviewing" | "Offer" | "Rejected" | "Hired"

interface Job {
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

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true) // ✅ Loading state

  useEffect(() => {
    const fetchJobs = async () => {
      const accessToken = localStorage.getItem("accessToken")

      try {
        const res = await fetch("http://localhost:8000/api/jobs", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        })

        if (res.ok) {
          const data = await res.json()
          setJobs(data.jobs)
        } else {
          console.error("Failed to fetch jobs:", res.status)
        }
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setLoading(false) // ✅ Stop loading after fetch
      }
    }

    fetchJobs()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Jobs</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">
          No jobs added yet. Start tracking your applications!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Job key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}
