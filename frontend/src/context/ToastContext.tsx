import React, { createContext, useContext, useState, useCallback } from "react"

export type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      removeToast(id)
    }, 4000)
  }, [removeToast])

  const success = useCallback((msg: string) => showToast(msg, "success"), [showToast])
  const error = useCallback((msg: string) => showToast(msg, "error"), [showToast])
  const info = useCallback((msg: string) => showToast(msg, "info"), [showToast])
  const warning = useCallback((msg: string) => showToast(msg, "warning"), [showToast])

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg border text-sm font-medium transition-all transform translate-y-0 duration-200 ${
              toast.type === "success"
                ? "bg-emerald-50 text-emerald-900 border-emerald-200 shadow-emerald-100"
                : toast.type === "error"
                ? "bg-rose-50 text-rose-900 border-rose-200 shadow-rose-100"
                : toast.type === "warning"
                ? "bg-amber-50 text-amber-900 border-amber-200 shadow-amber-100"
                : "bg-blue-50 text-blue-900 border-blue-200 shadow-blue-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">
                {toast.type === "success" && "✅"}
                {toast.type === "error" && "❌"}
                {toast.type === "warning" && "⚠️"}
                {toast.type === "info" && "ℹ️"}
              </span>
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-gray-400 hover:text-gray-700 transition"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
