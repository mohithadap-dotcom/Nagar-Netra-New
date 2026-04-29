"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Medal,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  ShieldCheck,
  AlertTriangle,
  Star,
  Minus,
  Plus,
} from "lucide-react";
import { SEED_CONTRACTORS, getScoreColor } from "@/lib/constants";

export default function ContractorsPage() {
  const ranked = [...SEED_CONTRACTORS]
    .sort((a, b) => b.accountability_score - a.accountability_score)
    .map((c, i) => ({ ...c, rank: i + 1 }));

  return (
    <div className="p-4 lg:p-8 pb-12 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-sora text-2xl font-bold text-white">
          Contractor Accountability Scoreboard
        </h1>
        <p className="text-sm text-gray-500">
          Nagpur Municipal Corporation — Public Record
        </p>
      </div>

      {/* Scoring System Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5"
      >
        <h3 className="font-sora text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Star className="h-4 w-4 text-accent-amber" />
          Scoring System
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Base Score", value: "100", icon: Star, color: "text-accent-amber" },
            { label: "Per Day Late", value: "-5", icon: Minus, color: "text-red-400" },
            { label: "AI Rejected", value: "-20", icon: AlertTriangle, color: "text-red-400" },
            { label: "Early Completion", value: "+10", icon: Plus, color: "text-emerald-400" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 rounded-lg bg-white/[0.03] p-3"
            >
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <div>
                <p className={`font-mono text-sm font-bold ${item.color}`}>{item.value}</p>
                <p className="text-[10px] text-gray-500">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Rank
                </th>
                <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Contractor
                </th>
                <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  License
                </th>
                <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Score
                </th>
                <th className="px-5 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Assigned
                </th>
                <th className="px-5 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Completed
                </th>
                <th className="px-5 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Verified
                </th>
                <th className="px-5 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Avg Days
                </th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((contractor, i) => {
                const scoreColor = getScoreColor(contractor.accountability_score);
                const completionRate = Math.round(
                  (contractor.total_completed / contractor.total_assigned) * 100
                );
                const verifyRate = Math.round(
                  (contractor.total_verified / contractor.total_completed) * 100
                );

                return (
                  <motion.tr
                    key={contractor.license_number}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {contractor.rank === 1 && <Trophy className="h-4 w-4 text-yellow-400" />}
                        {contractor.rank === 2 && <Medal className="h-4 w-4 text-gray-300" />}
                        {contractor.rank === 3 && <Medal className="h-4 w-4 text-amber-600" />}
                        <span className="font-sora font-bold text-white">
                          #{contractor.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-white text-sm">{contractor.name}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{contractor.city}</p>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-gray-400">
                      {contractor.license_number}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="font-sora text-lg font-bold"
                          style={{ color: scoreColor }}
                        >
                          {contractor.accountability_score}
                        </span>
                        <div className="w-20 h-2 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${contractor.accountability_score}%`,
                              backgroundColor: scoreColor,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center text-gray-400">
                      {contractor.total_assigned}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-gray-300">{contractor.total_completed}</span>
                      <span className="text-[10px] text-gray-600 ml-1">({completionRate}%)</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-gray-300">{contractor.total_verified}</span>
                      <span className="text-[10px] text-gray-600 ml-1">({verifyRate}%)</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span className={`font-mono text-xs ${contractor.avg_completion_days > 10 ? "text-red-400" : contractor.avg_completion_days > 7 ? "text-yellow-400" : "text-emerald-400"}`}>
                          {contractor.avg_completion_days}d
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <p className="text-center text-[10px] text-gray-700">
        Scores are updated automatically based on AI verification results. This is public data under the Right
        to Information Act, 2005.
      </p>
    </div>
  );
}
