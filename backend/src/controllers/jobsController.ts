import { Response, NextFunction } from "express"
import mongoose from "mongoose"
import { AuthRequest } from "../middlewares/authMiddleware"
import Job, { JobStatus, WorkplaceType } from "../models/jobModel"

// Adds a Job
// POST /api/jobs
export const addJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      company,
      jobTitle,
      status,
      workplaceType,
      location,
      salary,
      jobUrl,
      contactEmail,
      dateApplied,
      interviewDate,
      notes,
    } = req.body

    if (!company || !jobTitle) {
      return res.status(400).json({
        success: false,
        error: "Company and Job Title are required.",
      })
    }

    const newJob = await Job.create({
      userId: req.userId,
      company: company.trim(),
      jobTitle: jobTitle.trim(),
      status: status || "Applied",
      workplaceType: workplaceType || "Remote",
      location: location?.trim(),
      salary: salary?.trim(),
      jobUrl: jobUrl?.trim(),
      contactEmail: contactEmail?.trim(),
      dateApplied: dateApplied ? new Date(dateApplied) : new Date(),
      interviewDate: interviewDate ? new Date(interviewDate) : undefined,
      notes: notes?.trim(),
    })

    res.status(201).json({
      success: true,
      message: "Job application added successfully.",
      job: newJob,
    })
  } catch (error) {
    next(error)
  }
}

// Gets all jobs with search, filtering, and sorting
// GET /api/jobs
export const getJobs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const { search, status, workplaceType, sortBy = "dateApplied", sortOrder = "desc" } =
      req.query

    const filter: any = { userId }

    // Status filter
    if (status && typeof status === "string" && status !== "All") {
      filter.status = status
    }

    // Workplace type filter
    if (workplaceType && typeof workplaceType === "string" && workplaceType !== "All") {
      filter.workplaceType = workplaceType
    }

    // Search query (matches company, jobTitle, location, or notes)
    if (search && typeof search === "string" && search.trim().length > 0) {
      const searchRegex = new RegExp(search.trim(), "i")
      filter.$or = [
        { company: searchRegex },
        { jobTitle: searchRegex },
        { location: searchRegex },
        { notes: searchRegex },
      ]
    }

    // Sorting
    const sortField = typeof sortBy === "string" ? sortBy : "dateApplied"
    const order = sortOrder === "asc" ? 1 : -1
    const sortOptions: any = { [sortField]: order }

    const jobs = await Job.find(filter).sort(sortOptions)

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    })
  } catch (error) {
    next(error)
  }
}

// Gets dashboard statistics and analytics
// GET /api/jobs/stats
export const getJobStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId)

    // Aggregate counts by status
    const statusStats = await Job.aggregate([
      { $match: { userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ])

    const statusCounts: Record<JobStatus, number> = {
      Applied: 0,
      Interviewing: 0,
      Offer: 0,
      Rejected: 0,
      Hired: 0,
    }

    statusStats.forEach((stat) => {
      if (stat._id in statusCounts) {
        statusCounts[stat._id as JobStatus] = stat.count
      }
    })

    const totalJobs = Object.values(statusCounts).reduce((acc, curr) => acc + curr, 0)

    // Aggregate counts by workplaceType
    const workplaceStats = await Job.aggregate([
      { $match: { userId } },
      { $group: { _id: "$workplaceType", count: { $sum: 1 } } },
    ])

    const workplaceCounts: Record<WorkplaceType, number> = {
      Remote: 0,
      Hybrid: 0,
      "On-site": 0,
    }

    workplaceStats.forEach((stat) => {
      if (stat._id in workplaceCounts) {
        workplaceCounts[stat._id as WorkplaceType] = stat.count
      }
    })

    // Calculate conversion rates
    const interviewRate = totalJobs > 0
      ? Math.round(((statusCounts.Interviewing + statusCounts.Offer + statusCounts.Hired) / totalJobs) * 100)
      : 0

    const offerRate = totalJobs > 0
      ? Math.round(((statusCounts.Offer + statusCounts.Hired) / totalJobs) * 100)
      : 0

    // Recent 6-month application activity
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
    sixMonthsAgo.setDate(1)
    sixMonthsAgo.setHours(0, 0, 0, 0)

    const monthlyTrends = await Job.aggregate([
      {
        $match: {
          userId,
          dateApplied: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$dateApplied" },
            month: { $month: "$dateApplied" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ])

    // Format monthly trends
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const monthlyData: { month: string; count: number }[] = []

    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const year = d.getFullYear()
      const month = d.getMonth() + 1
      const label = `${monthNames[d.getMonth()]} ${year.toString().slice(2)}`

      const match = monthlyTrends.find(
        (t) => t._id.year === year && t._id.month === month
      )
      monthlyData.push({
        month: label,
        count: match ? match.count : 0,
      })
    }

    // Count upcoming interviews
    const now = new Date()
    const upcomingInterviews = await Job.countDocuments({
      userId,
      status: "Interviewing",
      interviewDate: { $gte: now },
    })

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        statusCounts,
        workplaceCounts,
        interviewRate,
        offerRate,
        upcomingInterviews,
        monthlyData,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Gets One Job by ID
// GET /api/jobs/:id
export const getJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const rawId = req.params.id
    const jobId = Array.isArray(rawId) ? rawId[0] : (rawId as string)
    const userId = req.userId

    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ success: false, error: "Invalid Job ID format" })
    }

    const job = await Job.findOne({ _id: jobId, userId })

    if (!job) {
      return res.status(404).json({ success: false, error: "Job application not found." })
    }

    res.status(200).json({ success: true, job })
  } catch (error) {
    next(error)
  }
}

// Deletes a Job
// DELETE /api/jobs/:id
export const deleteJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const rawId = req.params.id
    const jobId = Array.isArray(rawId) ? rawId[0] : (rawId as string)
    const userId = req.userId

    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ success: false, error: "Invalid Job ID format" })
    }

    const job = await Job.findOneAndDelete({ _id: jobId, userId })

    if (!job) {
      return res.status(404).json({ success: false, error: "Job application not found." })
    }

    res.status(200).json({
      success: true,
      message: "Job application deleted successfully.",
      jobId,
    })
  } catch (error) {
    next(error)
  }
}

// Updates a Job
// PATCH /api/jobs/:id
export const updateJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const rawId = req.params.id
    const jobId = Array.isArray(rawId) ? rawId[0] : (rawId as string)
    const userId = req.userId

    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ success: false, error: "Invalid Job ID format" })
    }

    const job = await Job.findOne({ _id: jobId, userId })

    if (!job) {
      return res.status(404).json({ success: false, error: "Job application not found." })
    }

    const {
      company,
      jobTitle,
      status,
      workplaceType,
      location,
      salary,
      jobUrl,
      contactEmail,
      dateApplied,
      interviewDate,
      notes,
    } = req.body

    const validStatuses: JobStatus[] = ["Applied", "Interviewing", "Offer", "Rejected", "Hired"]
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid job status value" })
    }

    const validWorkplaces: WorkplaceType[] = ["Remote", "Hybrid", "On-site"]
    if (workplaceType && !validWorkplaces.includes(workplaceType)) {
      return res.status(400).json({ success: false, error: "Invalid workplace type value" })
    }

    if (company !== undefined) job.company = company.trim()
    if (jobTitle !== undefined) job.jobTitle = jobTitle.trim()
    if (status !== undefined) job.status = status
    if (workplaceType !== undefined) job.workplaceType = workplaceType
    if (location !== undefined) job.location = location ? location.trim() : undefined
    if (salary !== undefined) job.salary = salary ? salary.trim() : undefined
    if (jobUrl !== undefined) job.jobUrl = jobUrl ? jobUrl.trim() : undefined
    if (contactEmail !== undefined) job.contactEmail = contactEmail ? contactEmail.trim() : undefined
    if (dateApplied !== undefined) job.dateApplied = new Date(dateApplied)
    if (interviewDate !== undefined) job.interviewDate = interviewDate ? new Date(interviewDate) : undefined
    if (notes !== undefined) job.notes = notes ? notes.trim() : undefined

    await job.save()

    res.status(200).json({
      success: true,
      message: "Job application updated successfully.",
      job,
    })
  } catch (error) {
    next(error)
  }
}
