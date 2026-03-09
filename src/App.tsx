import { useState, useEffect, useCallback } from "react"
import { createClient } from "@supabase/supabase-js"
import { Activity, Users, TrendingUp, Clock, Zap, RefreshCw, Settings, Database } from "lucide-react"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const TIME_RANGES = ["Last 24h", "7d", "30d", "90d"]

function getTimeFilter(range: string) {
  const now = new Date()
  const map: Record<string, number> = { "Last 24h": 1, "7d": 7, "30d": 30, "90d": 90 }
  const days = map[range] ?? 1
  const d = new Date(now)
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return `${Math.floor(diff)}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

type GameExecution = {
  place_id: number
  count: number
  last_executed_at: string
}

type UniqueUser = {
  user_id: number
  place_id: number
  username: string
  first_seen: string
  last_seen: string
}

export default function App() {
  const [activeRange, setActiveRange] = useState("Last 24h")
  const [executions, setExecutions] = useState<GameExecution[]>([])
  const [users, setUsers] = useState<UniqueUser[]>([])
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const fetchData = useCallback(async () => {
    setLoading(true)
    const since = getTimeFilter(activeRange)

    const [{ data: exData }, { data: uData }] = await Promise.all([
      supabase
        .from("game_executions")
        .select("*")
        .gte("last_executed_at", since)
        .order("last_executed_at", { ascending: false }),
      supabase
        .from("unique_users")
        .select("*")
        .gte("last_seen", since)
        .order("last_seen", { ascending: false }),
    ])

    setExecutions(exData ?? [])
    setUsers(uData ?? [])
    setLastRefresh(new Date())
    setLoading(false)
  }, [activeRange])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const totalExecutions = executions.reduce((s, e) => s + (e.count ?? 0), 0)
  const uniqueUserCount = users.length
  const recentActivity = executions.slice(0, 10)

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <nav className="border-b border-white/[0.06] px-6 py-3 flex items-center justify-between bg-[#10131a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-sm font-semibold leading-none">Execution Analytics</div>
            <div className="text-[11px] text-white/40 mt-0.5">Real-time monitoring dashboard</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[12px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/60">Live</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2 text-[12px] text-white/60">
            <Database className="w-3.5 h-3.5" />
            <span>projectcounter</span>
          </div>
          <Settings className="w-4 h-4 text-white/40 hover:text-white/70 cursor-pointer transition-colors" />
        </div>
      </nav>

      <main className="p-6 max-w-[1200px] mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">Dashboard Overview</h1>
            <p className="text-sm text-white/40 mt-0.5">Monitor your execution metrics and performance</p>
          </div>
          <div className="flex items-center gap-1 bg-[#181c25] border border-white/[0.07] rounded-lg p-1">
            {TIME_RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRange(r)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeRange === r
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {r}
              </button>
            ))}
            <button
              onClick={fetchData}
              className="ml-1 p-1.5 rounded-md text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-white/30 text-sm">Loading...</div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <StatCard label="Total Executions" value={totalExecutions.toLocaleString()} sub={`In ${activeRange}`} icon={<Activity className="w-4 h-4 text-white/30" />} />
                <StatCard label="Unique Users" value={uniqueUserCount.toLocaleString()} sub="Active users" icon={<Users className="w-4 h-4 text-white/30" />} />
                <StatCard label="Active Places" value={executions.length.toLocaleString()} sub="Distinct place IDs" icon={<TrendingUp className="w-4 h-4 text-white/30" />} />
                <StatCard
                  label="Last Execution"
                  value={executions[0] ? timeAgo(executions[0].last_executed_at) : "—"}
                  sub="Most recent activity"
                  icon={<Clock className="w-4 h-4 text-white/30" />}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Recent Activity
                  </div>
                  <span className="text-xs text-white/40">Last {recentActivity.length} executions</span>
                </div>
                <div className="space-y-1.5">
                  {recentActivity.length === 0 ? (
                    <div className="text-sm text-white/30 text-center py-8">No executions in this range</div>
                  ) : (
                    recentActivity.map((item) => (
                      <ActivityRow
                        key={item.place_id}
                        placeId={item.place_id}
                        count={item.count}
                        time={timeAgo(item.last_executed_at)}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-[#13161f] border border-white/[0.07] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-semibold">Quick Stats</span>
                </div>
                <div className="space-y-2">
                  <QuickStatRow label="Total Executions" value={totalExecutions.toLocaleString()} dot="bg-indigo-400" />
                  <QuickStatRow label="Unique Users" value={uniqueUserCount.toLocaleString()} dot="bg-emerald-400" />
                  <QuickStatRow label="Active Places" value={executions.length.toLocaleString()} dot="bg-blue-400" />
                  <QuickStatRow label="Last Updated" value={lastRefresh.toLocaleTimeString()} dot="bg-amber-400" />
                </div>

                {users.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/[0.05]">
                    <p className="text-xs text-white/40 mb-2">Recent Users</p>
                    <div className="space-y-1.5">
                      {users.slice(0, 5).map((u) => (
                        <div key={u.user_id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                              <Users className="w-2.5 h-2.5 text-white/30" />
                            </div>
                            <span className="text-xs text-white/70">{u.username ?? `user${u.user_id}`}</span>
                          </div>
                          <span className="text-[10px] text-white/30">{timeAgo(u.last_seen)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function StatCard({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#13161f] border border-white/[0.07] rounded-xl p-4 flex items-start justify-between">
      <div>
        <p className="text-xs text-white/40 mb-1">{label}</p>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-xs text-white/30 mt-1.5">{sub}</p>
      </div>
      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
        {icon}
      </div>
    </div>
  )
}

function ActivityRow({ placeId, count, time }: { placeId: number; count: number; time: string }) {
  return (
    <div className="bg-[#13161f] border border-white/[0.05] rounded-lg px-4 py-2.5 flex items-center justify-between hover:border-white/10 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
          <Activity className="w-3.5 h-3.5 text-white/30" />
        </div>
        <div>
          <span className="text-sm font-medium">Place {placeId}</span>
          <span className="text-xs text-white/30 ml-2">· {time}</span>
          <div className="text-[11px] text-white/30 mt-0.5">{count.toLocaleString()} executions</div>
        </div>
      </div>
      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        Active
      </span>
    </div>
  )
}

function QuickStatRow({ label, value, dot }: { label: string; value: string; dot: string }) {
  return (
    <div className="bg-[#0d0f14] border border-white/[0.05] rounded-lg px-3 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${dot}`} />
        <span className="text-xs text-white/40">{label}</span>
      </div>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  )
}
