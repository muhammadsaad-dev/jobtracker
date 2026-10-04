import dotenv from "dotenv"

dotenv.config()

export const config = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  MONGO_URL: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/jobtracker",
  JWT_SECRET: process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || "supersecret_jwt_dev_key_change_in_prod",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CORS_ORIGIN: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
  NODE_ENV: process.env.NODE_ENV || "development",
}
