"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Clock, Layers, Filter } from "lucide-react";
import { SEED_POTHOLES, SEVERITY_CONFIG, STATUS_CONFIG, NAGPUR_WARDS } from "@/lib/constants";
import type { Severity, PotholeStatus } from "@/lib/types";

const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-navy">
      <div className="text-center">
        <div className="h-8 w-8 border-2 border-accent-amber border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const [severityFilter, setSeverityFilter] = useState<Severity[]>([]);
  const [statusFilter, setStatusFilter] = useState<PotholeStatus[]>([]);
  const [wardFilter, setWardFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = SEED_POTHOLES.filter((p) => {
    if (severityFilter.length > 0 && !severityFilter.includes(p.severity)) return false;
    if (statusFilter.length > 0 && !statusFilter.includes(p.status)) return false;
    if (wardFilter && p.ward !== wardFilter) return false;
    return true;
  });

  const activeCritical = SEED_POTHOLES.filter(
    (p) => p.severity === "L3" && !["completed", "verified"].includes(p.status)
  ).length;
  const totalRepaired = SEED_POTHOLES.filter(
    (p) => p.status === "completed" || p.status === "verified"
  ).length;

  return (
    <div className="relative h-screen flex flex-col">
      {/* Stats Bar */}
      <div className="border-b border-white/[0.06] bg-navy-100/95 backdrop-blur-xl px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent-amber animate-pulse" />
              <span className="text-xs text-gray-400">
                <span className="font-semibold text-white">{filtered.length}</span> Active
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-3 w-3 text-red-400" />
              <span className="text-xs text-gray-400">
                <span className="font-semibold text-red-400">{activeCritical}</span> Critical
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-emerald-400" />
              <span className="text-xs text-gray-400">
                <span className="font-semibold text-emerald-400">{totalRepaired}</span> Repaired
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-ghost text-xs ${showFilters ? "bg-white/5 text-white" : ""}`}
          >
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-b border-white/[0.06] bg-navy-100/95 backdrop-blur-xl px-4 py-3 space-y-3"
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-2">Severity</p>
            <div className="flex gap-2">
              {(["L1", "L2", "L3"] as Severity[]).map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    setSeverityFilter((prev) =>
                      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                    )
                  }
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    severityFilter.includes(s)
                      ? `${SEVERITY_CONFIG[s].bgClass} ${SEVERITY_CONFIG[s].textClass} ring-1 ring-current`
                      : "bg-white/5 text-gray-500"
                  }`}
                >
                  {s} — {SEVERITY_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-2">Status</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(STATUS_CONFIG) as PotholeStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    setStatusFilter((prev) =>
                      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                    )
                  }
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    statusFilter.includes(s)
                      ? "bg-white/10 text-white ring-1 ring-white/20"
                      : "bg-white/5 text-gray-500"
                  }`}
                >
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-2">Ward</p>
            <select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              className="input-field text-xs py-1.5"
            >
              <option value="">All Wards</option>
              {NAGPUR_WARDS.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
        </motion.div>
      )}

      {/* Map */}
      <div className="flex-1">
        <MapView potholes={filtered} />
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-4 z-[500]">
        <div className="glass-card p-3 space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1">
            <Layers className="h-3 w-3 inline mr-1" /> Legend
          </p>
          {[
            { color: "#EF4444", label: "L3 Critical" },
            { color: "#F97316", label: "L2 Moderate" },
            { color: "#FBBF24", label: "L1 Minor" },
            { color: "#10B981", label: "Repaired" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
