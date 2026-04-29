"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { SEED_POTHOLES, SEVERITY_CONFIG, STATUS_CONFIG, formatCurrency, getDaysOpen } from "@/lib/constants";
import type { DashboardStats } from "@/lib/types";

function CountUp({ target, decimals = 0 }: { target: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString("en-IN")}</span>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card h-32 shimmer" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card h-80 shimmer" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Reports",
      value: stats.total_reports,
      icon: TrendingUp,
      change: "+12%",
      positive: true,
      color: "text-accent-blue",
      bgColor: "bg-accent-blue/15",
    },
    {
      label: "Critical Unresolved",
      value: stats.critical_unresolved,
      icon: AlertTriangle,
      change: "-3",
      positive: false,
      color: "text-red-400",
      bgColor: "bg-red-500/15",
    },
    {
      label: "Avg Resolution (days)",
      value: stats.avg_resolution_days,
      icon: Clock,
      change: "-1.2d",
      positive: true,
      color: "text-accent-amber",
      bgColor: "bg-accent-amber/15",
      decimals: 1,
    },
    {
      label: "Compliance Rate",
      value: stats.contractor_compliance,
      icon: CheckCircle,
      change: "+2.1%",
      positive: true,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/15",
      suffix: "%",
      decimals: 1,
    },
  ];

  const statusData = Object.entries(stats.by_status).map(([key, value]) => ({
    name: STATUS_CONFIG[key as keyof typeof STATUS_CONFIG]?.label || key,
    value,
    color: STATUS_CONFIG[key as keyof typeof STATUS_CONFIG]?.color || "#6B7280",
  }));

  const wardData = Object.entries(stats.by_ward)
    .map(([ward, count]) => ({ ward, count }))
    .sort((a, b) => b.count - a.count);

  // Pothole table data
  const potholes = SEED_POTHOLES.map((p, i) => ({
    ...p,
    id: `NN-${String(i + 1).padStart(3, "0")}`,
    created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
  }));

  return (
    <div className="p-4 lg:p-8 space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-sora text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-500">Nagpur Municipal Corporation — Live Overview</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost text-xs">
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
          <button className="btn-ghost text-xs">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="glass-card p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <span className={`inline-flex items-center gap-1 text-xs font-medium ${card.positive ? "text-emerald-400" : "text-red-400"}`}>
                {card.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {card.change}
              </span>
            </div>
            <p className={`font-sora text-2xl font-bold ${card.color}`}>
              <CountUp target={card.value} decimals={card.decimals || 0} />
              {card.suffix || ""}
            </p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5 lg:col-span-2"
        >
          <h3 className="font-sora text-sm font-semibold text-white mb-4">
            Reports — Last 30 Days
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats.recent_trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => new Date(d).getDate().toString()}
                tick={{ fontSize: 11, fill: "#6B7280" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#1A2235",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#D97706"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#D97706" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status Donut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5"
        >
          <h3 className="font-sora text-sm font-semibold text-white mb-4">
            Status Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#1A2235",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[10px] text-gray-400">{s.name}: {s.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Ward Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-5"
      >
        <h3 className="font-sora text-sm font-semibold text-white mb-4">
          Reports by Ward
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={wardData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="ward"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              width={100}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#1A2235",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="count" fill="#D97706" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Pothole Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card overflow-hidden"
      >
        <div className="p-5 border-b border-white/[0.06]">
          <h3 className="font-sora text-sm font-semibold text-white">
            Recent Reports
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Location</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ward</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Severity</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Cost Est.</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Days Open</th>
              </tr>
            </thead>
            <tbody>
              {potholes.slice(0, 10).map((p, i) => (
                <tr
                  key={p.id}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3 font-mono text-xs text-gray-400">{p.id}</td>
                  <td className="px-5 py-3 text-xs text-gray-300 max-w-[200px] truncate">{p.address}</td>
                  <td className="px-5 py-3 text-xs text-gray-400">{p.ward}</td>
                  <td className="px-5 py-3">
                    <span className={`badge-${p.severity.toLowerCase()}`}>
                      {p.severity} — {SEVERITY_CONFIG[p.severity].label}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`badge-${p.status}`}>
                      {STATUS_CONFIG[p.status].label}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-400">
                    {formatCurrency(p.estimated_repair_cost)}
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-400">
                    {getDaysOpen(p.created_at)}d
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
