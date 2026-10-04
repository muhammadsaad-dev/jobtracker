import type { Job, JobStats, User } from "../types"

const getApiBaseUrl = (): string => {
  const raw = import.meta.env.VITE_API_URL
  if (!raw) return "http://localhost:5000/api"
  let url = raw.trim()
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`
  }
  if (!url.endsWith("/api")) {
    url = `${url.replace(/\/+$/, "")}/api`
  }
  return url
}

const API_BASE_URL = getApiBaseUrl()

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem("accessToken")
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken()
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      if (response.status === 401 && !endpoint.includes("/user/login") && !endpoint.includes("/user/signup")) {
        // Token invalid or expired
        localStorage.removeItem("accessToken")
        localStorage.removeItem("user")
        window.dispatchEvent(new Event("auth-changed"))
      }
      throw new Error(data.error || data.message || `Request failed with status ${response.status}`)
    }

    return data
  }

  // Auth Endpoints
  async signup(name: string, email: string, password: string, targetRole?: string): Promise<{ success: boolean; message: string; user: User & { accessToken: string } }> {
    return this.request("/user/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password, targetRole }),
    })
  }

  async login(email: string, password: string): Promise<{ success: boolean; message: string; user: User & { accessToken: string } }> {
    return this.request("/user/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async getProfile(): Promise<{ success: boolean; user: User }> {
    return this.request("/user/profile", { method: "GET" })
  }

  async updateProfile(name: string, targetRole?: string): Promise<{ success: boolean; user: User; message: string }> {
    return this.request("/user/profile", {
      method: "PATCH",
      body: JSON.stringify({ name, targetRole }),
    })
  }

  // Job Endpoints
  async getJobs(params?: {
    search?: string
    status?: string
    workplaceType?: string
    sortBy?: string
    sortOrder?: string
  }): Promise<{ success: boolean; count: number; jobs: Job[] }> {
    const query = new URLSearchParams()
    if (params?.search) query.append("search", params.search)
    if (params?.status && params.status !== "All") query.append("status", params.status)
    if (params?.workplaceType && params.workplaceType !== "All") query.append("workplaceType", params.workplaceType)
    if (params?.sortBy) query.append("sortBy", params.sortBy)
    if (params?.sortOrder) query.append("sortOrder", params.sortOrder)

    const queryString = query.toString() ? `?${query.toString()}` : ""
    return this.request(`/jobs${queryString}`, { method: "GET" })
  }

  async getStats(): Promise<{ success: boolean; stats: JobStats }> {
    return this.request("/jobs/stats", { method: "GET" })
  }

  async getJob(id: string): Promise<{ success: boolean; job: Job }> {
    return this.request(`/jobs/${id}`, { method: "GET" })
  }

  async createJob(jobData: Partial<Job>): Promise<{ success: boolean; message: string; job: Job }> {
    return this.request("/jobs", {
      method: "POST",
      body: JSON.stringify(jobData),
    })
  }

  async updateJob(id: string, jobData: Partial<Job>): Promise<{ success: boolean; message: string; job: Job }> {
    return this.request(`/jobs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(jobData),
    })
  }

  async deleteJob(id: string): Promise<{ success: boolean; message: string; jobId: string }> {
    return this.request(`/jobs/${id}`, {
      method: "DELETE",
    })
  }
}

export const api = new ApiClient()
