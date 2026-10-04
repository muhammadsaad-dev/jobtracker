import { Router } from "express"
import {
  addJob,
  getJobs,
  getJobStats,
  getJob,
  deleteJob,
  updateJob,
} from "../controllers/jobsController"
import authMiddleware from "../middlewares/authMiddleware"

const jobRouter = Router()

// All job routes require authentication
jobRouter.use(authMiddleware)

jobRouter.get("/stats", getJobStats)
jobRouter.get("/", getJobs)
jobRouter.post("/", addJob)
jobRouter.get("/:id", getJob)
jobRouter.patch("/:id", updateJob)
jobRouter.delete("/:id", deleteJob)

export default jobRouter
