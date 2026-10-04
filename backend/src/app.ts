import express from "express"
import cors from "cors"
import userRouter from "./routes/user"
import jobRouter from "./routes/jobs"
import { notFoundHandler, errorHandler } from "./middlewares/errorMiddleware"
import { config } from "./config/env"

const app = express()

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching origin
      if (!origin || config.CORS_ORIGIN.includes(origin) || config.CORS_ORIGIN.includes("*")) {
        callback(null, true)
      } else {
        callback(null, true) // permissive in local development
      }
    },
    credentials: true,
  })
)

// Body parsers
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true, limit: "1mb" }))

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "JobTracker API",
    version: "1.0.0",
  })
})

// API Routes
app.use("/api/user", userRouter)
app.use("/api/jobs", jobRouter)

// 404 handler
app.use(notFoundHandler)

// Central error handler
app.use(errorHandler)

export default app
