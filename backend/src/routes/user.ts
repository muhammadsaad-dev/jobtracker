import { Router } from "express"
import {
  signupController,
  loginController,
  getProfile,
  updateProfile,
} from "../controllers/userController"
import authMiddleware from "../middlewares/authMiddleware"

const userRouter = Router()

userRouter.post("/signup", signupController)
userRouter.post("/login", loginController)
userRouter.get("/profile", authMiddleware, getProfile)
userRouter.patch("/profile", authMiddleware, updateProfile)

export default userRouter
