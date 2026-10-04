import { describe, it, expect } from "vitest"
import request from "supertest"
import app from "../app"

describe("Authentication & Authorization Middleware", () => {
  it("should block requests to /api/jobs without an Authorization header", async () => {
    const res = await request(app).get("/api/jobs")
    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
    expect(res.body.error).toContain("Access denied")
  })

  it("should block requests with a malformed token", async () => {
    const res = await request(app)
      .get("/api/jobs")
      .set("Authorization", "Bearer invalid-or-corrupt-jwt-token")

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
    expect(res.body.error).toContain("Invalid or malformed")
  })

  it("should reject signup when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/user/signup")
      .send({ email: "incomplete@example.com" })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  it("should reject login when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({ email: "" })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })
})
