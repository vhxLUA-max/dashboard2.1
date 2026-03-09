import { useState } from "react"
import {
  Activity,
  Users,
  TrendingUp,
  Clock,
  Zap,
  RefreshCw,
  Settings,
  Database,
  CheckCircle2,
  XCircle,
} from "lucide-react"

const timeRanges = ["Last 24h", "7d", "30d", "90d"]

const recentActivity = [
  { user: "user14", time: "1m ago", duration: "3.13s", status: "Success" },
  { user: "user13", time: "2m ago", duration: "5.09s", status: "Success" },
  { user: "user23", time: "4m ago", duration: "1.10s", status: "Success" },
  { user: "user3",  time: "13m ago", duration: "3.68s", status: "Success" },
  { user: "user6",  time: "31m ago", duration: "3.04s", status: "Success" },
  { user: "user28", time: "34m ago", duration: "2.85s", status: "Success" },
  { user: "user39", time: "1h ago",  duration: "2.08s", status: "Success" },
  { user: "user15", time: "1h ago",  duration: "498ms", status: "Success" },
  { user: "user50", time: "1h ago",  duration: "2.15s", status: "Success" },
  { user: "user15", time: "1h ago",  duration: "1.29s", status: "Success" },
]

export default function App() {
  const [activeRange, setActiveRange] = useState("Last 24h")

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white font-sans">
      <nav className="border-b border-white/[0.06] px-6 py-3 flex items-center justify-between bg-[#10131a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white leading-none">Execution Analytics</div>
            <div className="text-[11px] text-white/40 mt-0.5">Real-time monitoring dashboard</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[12px]">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-white/60">Demo Mode</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2 text-[12px] text-white/60">
            <Database className="w-3.5 h-3.5" />
            <span>Dual DB</span>
          </div>
          <Settings className="w-4 h-4 text-white/40 hover:text-white/70 cursor-pointer transition-colors" />
        </div>
      </nav>

      <main className="p-6 max-w-[1200px] mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Dashboard Overview</h1>
            <p className="text-sm text-white/40 mt-0.5">Monitor your execution metrics and performance</p>
          </div>
          <div className="flex items-center gap-1 bg-[#181c25] border border-white/[0.07] rounded-lg p-1">
            {timeRanges.map((r) => (
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
            <button className="ml-1 p-1.5 rounded-md text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 grid grid-cols-2 gap-4 content-start">
            <StatCard
              label="Total Executions"
              value="128"
              sub="In last 24h"
              icon={<Activity className="w-4 h-4 text-white/30" />}
            />
            <StatCard
              label="Unique Users"
              value="44"
              sub="Active users"
              icon={<Users className="w-4 h-4 text-white/30" />}
            />
            <StatCard
              label="Success Rate"
              value="89.8%"
              sub="115 successful"
              icon={<TrendingUp className="w-4 h-4 text-white/30" />}
            />
            <StatCard
              label="Average Duration"
              value="2.45s"
              sub="Per execution"
              icon={<Clock className="w-4 h-4 text-white/30" />}
            />

            <div className="col-span-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Recent Activity
                </div>
                <span className="text-xs text-white/40">Last 10 executions</span>
              </div>
              <div className="space-y-1.5">
                {recentActivity.map((item, i) => (
                  <ActivityRow key={i} {...item} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#13161f] border border-white/[0.07] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-white">Quick Stats</span>
              </div>
              <div className="space-y-2">
                <QuickStatRow label="Success Rate" value="89.8%" accent="indigo" icon={<TrendingUp className="w-3.5 h-3.5" />} />
                <QuickStatRow label="Successful" value="115" accent="green" icon={<CheckCircle2 className="w-3.5 h-3.5" />} />
                <QuickStatRow label="Failed" value="13" accent="red" icon={<XCircle className="w-3.5 h-3.5" />} />
                <QuickStatRow label="Total Executions" value="128" accent="blue" icon={<Activity className="w-3.5 h-3.5" />} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#13161f] border border-white/[0.07] rounded-xl p-4 flex items-start justify-between">
      <div>
        <p className="text-xs text-white/40 mb-1">{label}</p>
        <p className="text-2xl font-bold text-white leading-none">{value}</p>
        <p className="text-xs text-white/30 mt-1.5">{sub}</p>
      </div>
      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
        {icon}
      </div>
    </div>
  )
}

function ActivityRow({ user, time, duration, status }: { user: string; time: string; duration: string; status: string }) {
  return (
    <div className="bg-[#13161f] border border-white/[0.05] rounded-lg px-4 py-2.5 flex items-center justify-between hover:border-white/10 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
          <Users className="w-3.5 h-3.5 text-white/30" />
        </div>
        <div>
          <span className="text-sm font-medium text-white">{user}</span>
          <span className="text-xs text-white/30 ml-2">· {time}</span>
          <div className="text-[11px] text-white/30 mt-0.5">
            <span className="mr-1">↓</span>{duration} <span className="ml-1 text-white/20">via mock</span>
          </div>
        </div>
      </div>
      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        {status}
      </span>
    </div>
  )
}

function QuickStatRow({
  label, value, accent, icon
}: {
  label: string; value: string; accent: "indigo" | "green" | "red" | "blue"; icon: React.ReactNode
}) {
  const colors = {
    indigo: "text-indigo-400 bg-indigo-500/10",
    green:  "text-emerald-400 bg-emerald-500/10",
    red:    "text-red-400 bg-red-500/10",
    blue:   "text-blue-400 bg-blue-500/10",
  }
  return (
    <div className="bg-[#0d0f14] border border-white/[0.05] rounded-lg px-3 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded-md flex items-center justify-center ${colors[accent]}`}>
          {icon}
        </div>
        <span className="text-xs text-white/40">{label}</span>
      </div>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  )
}
