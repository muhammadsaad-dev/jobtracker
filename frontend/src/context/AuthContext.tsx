import React, { createContext, useContext, useState, useEffect } from "react"
import type { User } from "../types"
import { api } from "../services/api"

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, targetRole?: string) => Promise<void>
  logout: () => void
  updateUserProfile: (name: string, targetRole?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user")
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("accessToken")
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("accessToken")
      if (storedToken) {
        try {
          const data = await api.getProfile()
          if (data.user) {
            setUser(data.user)
            localStorage.setItem("user", JSON.stringify(data.user))
          }
        } catch {
          console.warn("Session verification failed. Clearing credentials.")
          logout()
        }
      }
      setIsLoading(false)
    }

    checkAuth()

    const handleAuthChanged = () => {
      setUser(null)
      setToken(null)
    }

    window.addEventListener("auth-changed", handleAuthChanged)
    return () => window.removeEventListener("auth-changed", handleAuthChanged)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password)
    const { accessToken, ...userData } = res.user
    setToken(accessToken)
    setUser(userData)
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const signup = async (name: string, email: string, password: string, targetRole?: string) => {
    const res = await api.signup(name, email, password, targetRole)
    const { accessToken, ...userData } = res.user
    setToken(accessToken)
    setUser(userData)
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
  }

  const updateUserProfile = async (name: string, targetRole?: string) => {
    const res = await api.updateProfile(name, targetRole)
    if (res.user) {
      setUser(res.user)
      localStorage.setItem("user", JSON.stringify(res.user))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
