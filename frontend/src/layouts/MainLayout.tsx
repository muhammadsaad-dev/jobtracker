import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 text-gray-900 font-sans antialiased">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800">JobTracker</span>
            <span>—</span>
            <span>Engineered for ambitious job seekers.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="font-medium text-gray-600">
              Tech Stack: React 19 • TypeScript • Node.js • Express • MongoDB • Tailwind CSS
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
