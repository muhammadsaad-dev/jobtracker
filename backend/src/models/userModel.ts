import { model, Schema, Document } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  targetRole?: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name must not exceed 100 characters"],
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    targetRole: {
      type: String,
      trim: true,
      default: "Software Engineer",
    },
  },
  { timestamps: true }
)

export default model<IUser>("User", userSchema)
