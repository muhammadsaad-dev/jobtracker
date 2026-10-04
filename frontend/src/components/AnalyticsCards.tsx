import type { JobStats, JobStatus } from "../types"

interface AnalyticsCardsProps {
  stats: JobStats
}

const statusBadgeColors: Record<JobStatus, { bg: string; text: string; bar: string }> = {
  Applied: { bg: "bg-blue-50", text: "text-blue-700", bar: "bg-blue-500" },
  Interviewing: { bg: "bg-amber-50", text: "text-amber-700", bar: "bg-amber-500" },
  Offer: { bg: "bg-purple-50", text: "text-purple-700", bar: "bg-purple-500" },
  Rejected: { bg: "bg-rose-50", text: "text-rose-700", bar: "bg-rose-500" },
  Hired: { bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-500" },
}

export default function AnalyticsCards({ stats }: AnalyticsCardsProps) {
  const maxMonthly = Math.max(...stats.monthlyData.map((m) => m.count), 1)

  return (
    <div className="space-y-6 mb-8">
      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Applications */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Applications
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              📁
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">{stats.totalJobs}</span>
            <span className="text-xs text-gray-500 font-medium">all-time logged</span>
          </div>
        </div>

        {/* Card 2: Interview Rate */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Interview Conversion
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              🎯
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">{stats.interviewRate}%</span>
            <span className="text-xs text-gray-500 font-medium">response rate</span>
          </div>
        </div>

        {/* Card 3: Offers Received */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Offers & Hired
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              🏆
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">
              {(stats.statusCounts.Offer || 0) + (stats.statusCounts.Hired || 0)}
            </span>
            <span className="text-xs text-emerald-700 bg-emerald-50 font-semibold px-2 py-0.5 rounded-full">
              {stats.offerRate}% rate
            </span>
          </div>
        </div>

        {/* Card 4: Upcoming Interviews */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Active / Upcoming
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              🗓️
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-600">
              {stats.statusCounts.Interviewing || 0}
            </span>
            <span className="text-xs text-gray-500 font-medium">in discussion</span>
          </div>
        </div>
      </div>

      {/* Grid: Pipeline Breakdown & Monthly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Breakdown Bar */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center justify-between">
            <span>Recruitment Pipeline Distribution</span>
            <span className="text-xs font-medium text-gray-500">
              {stats.totalJobs} total
            </span>
          </h3>

          {/* Segmented Bar */}
          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex mb-6 shadow-inner">
            {stats.totalJobs > 0 ? (
              (Object.keys(statusBadgeColors) as JobStatus[]).map((st) => {
                const count = stats.statusCounts[st] || 0
                const percent = (count / stats.totalJobs) * 100
                if (percent === 0) return null
                return (
                  <div
                    key={st}
                    style={{ width: `${percent}%` }}
                    className={`${statusBadgeColors[st].bar} transition-all duration-500`}
                    title={`${st}: ${count} (${Math.round(percent)}%)`}
                  />
                )
              })
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>

          {/* Status Breakdown Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {(Object.keys(statusBadgeColors) as JobStatus[]).map((st) => {
              const count = stats.statusCounts[st] || 0
              const percent = stats.totalJobs > 0 ? Math.round((count / stats.totalJobs) * 100) : 0
              return (
                <div
                  key={st}
                  className={`p-3 rounded-xl border border-gray-100 ${statusBadgeColors[st].bg}`}
                >
                  <span className={`block text-xs font-semibold ${statusBadgeColors[st].text}`}>
                    {st}
                  </span>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xl font-bold text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500">{percent}%</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Workplace Breakdown */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Workplace Types:
            </span>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-100">
                🌐 Remote: {stats.workplaceCounts.Remote || 0}
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100">
                🏢 Hybrid: {stats.workplaceCounts.Hybrid || 0}
              </span>
              <span className="px-3 py-1 bg-violet-50 text-violet-700 text-xs font-semibold rounded-lg border border-violet-100">
                📍 On-site: {stats.workplaceCounts["On-site"] || 0}
              </span>
            </div>
          </div>
        </div>

        {/* 6-Month Application Trend */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Application Velocity
            </h3>
            <p className="text-xs text-gray-500 mb-6">Last 6 months activity</p>

            {/* Visual SVG / HTML Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-36 pt-4 px-2">
              {stats.monthlyData.map((item, idx) => {
                const heightPercent = maxMonthly > 0 ? (item.count / maxMonthly) * 100 : 0
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[11px] font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition">
                      {item.count}
                    </div>
                    <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden flex items-end h-28">
                      <div
                        style={{ height: `${Math.max(heightPercent, 4)}%` }}
                        className="w-full bg-indigo-600 rounded-t-lg group-hover:bg-indigo-500 transition-all duration-300"
                      />
                    </div>
                    <span className="text-[10px] font-medium text-gray-500 truncate">
                      {item.month.split(" ")[0]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <span className="text-xs text-gray-500">
              ⚡ Consistency is key to landing your target role!
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
