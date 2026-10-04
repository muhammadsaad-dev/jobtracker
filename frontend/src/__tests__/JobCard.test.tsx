import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import JobCard from "../components/JobCard"
import type { Job } from "../types"

const mockJob: Job = {
  _id: "job-123",
  userId: "user-456",
  company: "Stripe",
  jobTitle: "Senior Frontend Engineer",
  status: "Interviewing",
  workplaceType: "Remote",
  location: "San Francisco, CA",
  salary: "$160,000",
  dateApplied: "2026-09-15T00:00:00.000Z",
  notes: "Passed recruiter phone screen.",
  createdAt: "2026-09-15T00:00:00.000Z",
  updatedAt: "2026-09-15T00:00:00.000Z",
}

describe("JobCard Component", () => {
  it("renders company name, job title, and salary correctly", () => {
    const onDelete = vi.fn()

    render(
      <BrowserRouter>
        <JobCard job={mockJob} onDeleteClick={onDelete} />
      </BrowserRouter>
    )

    expect(screen.getByText("Senior Frontend Engineer")).toBeInTheDocument()
    expect(screen.getByText("Stripe")).toBeInTheDocument()
    expect(screen.getByText("Remote")).toBeInTheDocument()
    expect(screen.getByText("💰 $160,000")).toBeInTheDocument()
    expect(screen.getByText("Passed recruiter phone screen.")).toBeInTheDocument()
  })
})
