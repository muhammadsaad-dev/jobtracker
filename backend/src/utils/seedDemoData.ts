import bcrypt from "bcrypt"
import User from "../models/userModel"
import Job from "../models/jobModel"

export const seedDemoData = async () => {
  try {
    const demoEmail = "demo@jobtracker.dev"
    const existingUser = await User.findOne({ email: demoEmail })

    if (existingUser) {
      return
    }

    console.log("🌱 Seeding default demo account and sample applications...")

    const hashedPassword = await bcrypt.hash("password123", 10)
    const demoUser = await User.create({
      name: "Alex Developer",
      email: demoEmail,
      password: hashedPassword,
      targetRole: "Senior Full Stack Engineer",
    })

    const sampleJobs = [
      {
        userId: demoUser._id,
        company: "Stripe",
        jobTitle: "Senior Full Stack Engineer",
        status: "Interviewing",
        workplaceType: "Remote",
        location: "San Francisco, CA",
        salary: "$165,000 - $185,000",
        jobUrl: "https://stripe.com/jobs",
        contactEmail: "recruiting@stripe.com",
        dateApplied: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        interviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        notes: "Passed recruiter phone screen and technical interview. System design round scheduled next.",
      },
      {
        userId: demoUser._id,
        company: "Linear",
        jobTitle: "Frontend Infrastructure Engineer",
        status: "Offer",
        workplaceType: "Remote",
        location: "San Francisco, CA",
        salary: "$175,000 + Equity",
        jobUrl: "https://linear.app/careers",
        dateApplied: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        notes: "Received offer package! Reviewing benefits and compensation details.",
      },
      {
        userId: demoUser._id,
        company: "Vercel",
        jobTitle: "Solutions Architect",
        status: "Applied",
        workplaceType: "Remote",
        location: "Worldwide",
        salary: "$150,000 - $170,000",
        jobUrl: "https://vercel.com/careers",
        dateApplied: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        notes: "Applied via referral from engineering meetup.",
      },
      {
        userId: demoUser._id,
        company: "Datadog",
        jobTitle: "Cloud Backend Engineer",
        status: "Interviewing",
        workplaceType: "Hybrid",
        location: "New York, NY",
        salary: "$160,000",
        dateApplied: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        interviewDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        notes: "Coding challenge submitted. Live pair programming round coming up.",
      },
      {
        userId: demoUser._id,
        company: "Meta",
        jobTitle: "Software Engineer - Core Systems",
        status: "Rejected",
        workplaceType: "On-site",
        location: "Menlo Park, CA",
        salary: "$180,000",
        dateApplied: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        notes: "Position filled internally.",
      },
      {
        userId: demoUser._id,
        company: "GitHub",
        jobTitle: "Staff Software Engineer",
        status: "Hired",
        workplaceType: "Remote",
        location: "Remote",
        salary: "$190,000",
        dateApplied: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        notes: "Offer accepted! Starting next month.",
      },
    ]

    await Job.insertMany(sampleJobs)
    console.log("✅ Demo account created with sample pipeline applications.")
  } catch (error) {
    console.warn("⚠️ Could not auto-seed demo data:", error)
  }
}
