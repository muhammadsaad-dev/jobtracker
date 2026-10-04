import { Request, Response, NextFunction } from "express"

export interface AppError extends Error {
  statusCode?: number
  code?: number | string
  keyValue?: Record<string, any>
  errors?: Record<string, any>
}

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  })
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500
  let message = err.message || "Internal Server Error"

  // Handle Mongoose duplicate key error
  if (err.code === 11000 && err.keyValue) {
    statusCode = 409
    const field = Object.keys(err.keyValue)[0]
    message = `An account with this ${field} already exists.`
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError" && err.errors) {
    statusCode = 400
    message = Object.values(err.errors)
      .map((e: any) => e.message)
      .join(", ")
  }

  // Handle CastError (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400
    message = "Invalid resource ID format"
  }

  if (process.env.NODE_ENV !== "test" && statusCode === 500) {
    console.error("❌ Unhandled Error:", err)
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}
