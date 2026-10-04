import { Request, Response, NextFunction } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/userModel"
import { AuthRequest } from "../middlewares/authMiddleware"
import { config } from "../config/env"

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, targetRole } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and password are required.",
      })
    }

    const trimmedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters long.",
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "An account with this email already exists. Please log in instead.",
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
      targetRole: targetRole?.trim() || "Software Engineer",
    })

    // Sign JWT token
    const token = jwt.sign(
      { userId: newUser._id.toString() },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN as any }
    )

    res.status(201).json({
      success: true,
      message: `Account created successfully. Welcome, ${newUser.name}!`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        targetRole: newUser.targetRole,
        accessToken: token,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide both email and password.",
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const user = await User.findOne({ email: normalizedEmail })

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password. Please try again.",
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password. Please try again.",
      })
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN as any }
    )

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        accessToken: token,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized access" })
    }

    const user = await User.findById(userId).select("-password")
    if (!user) {
      return res.status(404).json({ success: false, error: "User profile not found" })
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const { name, targetRole } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" })
    }

    if (name) user.name = name.trim()
    if (targetRole !== undefined) user.targetRole = targetRole.trim()

    await user.save()

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
      },
    })
  } catch (error) {
    next(error)
  }
}
