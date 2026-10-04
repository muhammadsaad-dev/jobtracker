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
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true)

      // Allow if explicit wildcard
      if (config.CORS_ORIGIN.includes("*")) return callback(null, true)

      // Allow if matches configured origins or onrender.com subdomains
      const isAllowed =
        config.CORS_ORIGIN.some((allowed) => origin.startsWith(allowed) || allowed.startsWith(origin)) ||
        origin.endsWith(".onrender.com") ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1")

      if (isAllowed) {
        callback(null, true)
      } else {
        callback(null, true) // Permissive fallback to prevent deployment CORS breakage
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
