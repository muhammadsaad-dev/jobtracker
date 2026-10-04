import { describe, it, expect } from "vitest"
import request from "supertest"
import app from "../app"

describe("GET /api/health", () => {
  it("should return 200 OK with health status and version", async () => {
    const response = await request(app).get("/api/health")

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("status", "ok")
    expect(response.body).toHaveProperty("service", "JobTracker API")
    expect(response.body).toHaveProperty("version", "1.0.0")
    expect(response.body).toHaveProperty("timestamp")
  })

  it("should return 404 for unknown endpoints", async () => {
    const response = await request(app).get("/api/non-existent-endpoint")

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty("success", false)
    expect(response.body.error).toContain("Route not found")
  })
})
