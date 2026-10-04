export type JobStatus = "Applied" | "Interviewing" | "Offer" | "Rejected" | "Hired"
export type WorkplaceType = "Remote" | "Hybrid" | "On-site"

export interface Job {
  _id: string
  userId: string
  company: string
  jobTitle: string
  status: JobStatus
  workplaceType: WorkplaceType
  location?: string
  salary?: string
  jobUrl?: string
  contactEmail?: string
  dateApplied: string
  interviewDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  targetRole?: string
  createdAt?: string
}

export interface JobStats {
  totalJobs: number
  statusCounts: Record<JobStatus, number>
  workplaceCounts: Record<WorkplaceType, number>
  interviewRate: number
  offerRate: number
  upcomingInterviews: number
  monthlyData: { month: string; count: number }[]
}

export interface JobFilters {
  search: string
  status: string
  workplaceType: string
  sortBy: string
  sortOrder: "asc" | "desc"
}
