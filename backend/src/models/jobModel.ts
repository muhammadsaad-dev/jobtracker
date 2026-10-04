import { model, Schema, Document, Types } from "mongoose"

export type JobStatus = "Applied" | "Interviewing" | "Offer" | "Rejected" | "Hired"
export type WorkplaceType = "Remote" | "Hybrid" | "On-site"

export interface IJob extends Document {
  userId: Types.ObjectId
  company: string
  jobTitle: string
  status: JobStatus
  workplaceType: WorkplaceType
  location?: string
  salary?: string
  jobUrl?: string
  contactEmail?: string
  dateApplied: Date
  interviewDate?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const jobSchema = new Schema<IJob>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    company: { type: String, required: [true, "Company name is required"], trim: true },
    jobTitle: { type: String, required: [true, "Job title is required"], trim: true },
    status: {
      type: String,
      enum: {
        values: ["Applied", "Interviewing", "Offer", "Rejected", "Hired"],
        message: "{VALUE} is not a valid job status",
      },
      default: "Applied",
      index: true,
    },
    workplaceType: {
      type: String,
      enum: {
        values: ["Remote", "Hybrid", "On-site"],
        message: "{VALUE} is not a valid workplace type",
      },
      default: "Remote",
    },
    location: { type: String, trim: true },
    salary: { type: String, trim: true },
    jobUrl: { type: String, trim: true },
    contactEmail: { type: String, trim: true },
    dateApplied: { type: Date, required: true, default: Date.now },
    interviewDate: { type: Date },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
)

// Index for search optimization
jobSchema.index({ userId: 1, createdAt: -1 })
jobSchema.index({ userId: 1, status: 1 })

export default model<IJob>("Job", jobSchema)
