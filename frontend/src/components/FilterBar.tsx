import type { JobFilters, JobStatus, WorkplaceType } from "../types"

interface FilterBarProps {
  filters: JobFilters
  onFilterChange: (key: keyof JobFilters, value: string) => void
  onClearFilters: () => void
  totalCount: number
  viewMode: "kanban" | "grid" | "table"
  onViewModeChange: (mode: "kanban" | "grid" | "table") => void
  onExportCsv: () => void
}

const statusOptions: (JobStatus | "All")[] = [
  "All",
  "Applied",
  "Interviewing",
  "Offer",
  "Rejected",
  "Hired",
]

const workplaceOptions: (WorkplaceType | "All")[] = [
  "All",
  "Remote",
  "Hybrid",
  "On-site",
]

export default function FilterBar({
  filters,
  onFilterChange,
  onClearFilters,
  totalCount,
  viewMode,
  onViewModeChange,
  onExportCsv,
}: FilterBarProps) {
  const hasActiveFilters =
    filters.search !== "" ||
    filters.status !== "All" ||
    filters.workplaceType !== "All"

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm space-y-4 mb-6">
      {/* Top row: Search & View Toggle & Export */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Search by company, job title, location, or notes..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange("search", "")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* View Mode Toggle & Export Button */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* View toggle */}
          <div className="flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200 text-xs font-medium text-gray-600">
            <button
              onClick={() => onViewModeChange("kanban")}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === "kanban"
                  ? "bg-white text-indigo-600 font-bold shadow-sm"
                  : "hover:text-gray-900"
              }`}
            >
              <span>📋</span> Kanban
            </button>
            <button
              onClick={() => onViewModeChange("grid")}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === "grid"
                  ? "bg-white text-indigo-600 font-bold shadow-sm"
                  : "hover:text-gray-900"
              }`}
            >
              <span>🗂️</span> Cards
            </button>
            <button
              onClick={() => onViewModeChange("table")}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === "table"
                  ? "bg-white text-indigo-600 font-bold shadow-sm"
                  : "hover:text-gray-900"
              }`}
            >
              <span>📄</span> Table
            </button>
          </div>

          {/* Export CSV button */}
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl shadow-sm transition"
            title="Export filtered applications to CSV"
          >
            <span>📥</span> Export CSV
          </button>
        </div>
      </div>

      {/* Bottom row: Filter Chips & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-gray-400 uppercase mr-1">Status:</span>
          {statusOptions.map((st) => (
            <button
              key={st}
              onClick={() => onFilterChange("status", st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                filters.status === st
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Right filters: Workplace & Sort */}
        <div className="flex items-center gap-3">
          {/* Workplace type selector */}
          <select
            value={filters.workplaceType}
            onChange={(e) => onFilterChange("workplaceType", e.target.value)}
            className="px-2.5 py-1 text-xs font-medium bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {workplaceOptions.map((w) => (
              <option key={w} value={w}>
                Workplace: {w}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split("-")
              onFilterChange("sortBy", by)
              onFilterChange("sortOrder", order as "asc" | "desc")
            }}
            className="px-2.5 py-1 text-xs font-medium bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="dateApplied-desc">Applied (Newest)</option>
            <option value="dateApplied-asc">Applied (Oldest)</option>
            <option value="company-asc">Company (A-Z)</option>
            <option value="company-desc">Company (Z-A)</option>
            <option value="createdAt-desc">Recently Added</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-xs font-medium text-rose-600 hover:underline"
            >
              Reset
            </button>
          )}

          <span className="text-xs font-semibold text-gray-400">
            ({totalCount} {totalCount === 1 ? "job" : "jobs"})
          </span>
        </div>
      </div>
    </div>
  )
}
