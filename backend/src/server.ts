import mongoose from "mongoose"
import app from "./app"
import { config } from "./config/env"

const startServer = async () => {
  try {
    console.log("Connecting to MongoDB at:", config.MONGO_URL)
    await mongoose.connect(config.MONGO_URL)
    console.log("✅ Successfully connected to MongoDB database.")

    const server = app.listen(config.PORT, () => {
      console.log(`🚀 Server running in ${config.NODE_ENV} mode on http://localhost:${config.PORT}/`)
    })

    // Graceful shutdown handling
    const gracefulShutdown = async (signal: string) => {
      console.log(`\nReceived ${signal}. Closing server gracefully...`)
      server.close(async () => {
        await mongoose.connection.close()
        console.log("MongoDB connection closed. Process terminating.")
        process.exit(0)
      })
    }

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
    process.on("SIGINT", () => gracefulShutdown("SIGINT"))
  } catch (error) {
    console.error("❌ Fatal error connecting to database:", error)
    process.exit(1)
  }
}

startServer()
