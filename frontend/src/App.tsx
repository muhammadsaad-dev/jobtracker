import { Routes, Route, Navigate } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import DashboardPage from "./pages/DashboardPage"
import JobsPage from "./pages/JobsPage"
import JobDetailsPage from "./pages/JobDetailsPage"
import AddJobPage from "./pages/AddJobPage"
import UpdateJobPage from "./pages/UpdateJobPage"
import ProfilePage from "./pages/ProfilePage"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicOnlyRoute from "./components/PublicOnlyRoute"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Landing Page */}
        <Route index element={<LandingPage />} />

        {/* Public Only (Login / Signup) */}
        <Route
          path="login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="signup"
          element={
            <PublicOnlyRoute>
              <SignupPage />
            </PublicOnlyRoute>
          }
        />

        {/* Protected Dashboard & Job Routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="jobs"
          element={
            <ProtectedRoute>
              <JobsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="jobs/:id"
          element={
            <ProtectedRoute>
              <JobDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="jobs/add-job"
          element={
            <ProtectedRoute>
              <AddJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="jobs/update/:id"
          element={
            <ProtectedRoute>
              <UpdateJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
