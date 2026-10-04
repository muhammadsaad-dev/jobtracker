import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { config } from "../config/env"

export interface AuthRequest extends Request {
  userId?: string
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Access denied. No token provided or invalid format.",
      })
    }

    const token = authHeader.split(" ")[1]
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access denied. Token missing.",
      })
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string }
    req.userId = decoded.userId
    next()
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token has expired. Please log in again.",
        code: "TOKEN_EXPIRED",
      })
    }
    return res.status(401).json({
      success: false,
      error: "Invalid or malformed authentication token.",
    })
  }
}

export default authMiddleware
