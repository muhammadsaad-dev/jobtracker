import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth()
  const { success, error } = useToast()

  const [name, setName] = useState(user?.name || "")
  const [targetRole, setTargetRole] = useState(user?.targetRole || "")
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      error("Name cannot be empty.")
      return
    }

    setSaving(true)
    try {
      await updateUserProfile(name.trim(), targetRole.trim())
      success("Profile settings updated successfully!")
    } catch (err: any) {
      error(err.message || "Failed to update profile.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">{user?.name}</h1>
            <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ""}
              className="w-full px-4 py-2.5 text-sm bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
            />
            <span className="text-[11px] text-gray-400 mt-1 block">
              Email address is linked to your account credentials.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Target Career Role / Title
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-md transition flex items-center gap-2 ${
                saving
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
              }`}
            >
              {saving && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{saving ? "Updating..." : "Save Settings"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
