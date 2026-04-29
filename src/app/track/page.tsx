"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle,
  Clock,
  Bell,
  Wrench,
  ShieldCheck,
  FileText,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

const MOCK_TIMELINE = [
  {
    status: "filed",
    label: "Complaint Filed",
    icon: FileText,
    date: "16 Apr 2026, 10:32 AM",
    done: true,
    detail: "Complaint registered with NMC via NagarNetra platform",
  },
  {
    status: "notified",
    label: "Municipality Notified",
    icon: Bell,
    date: "16 Apr 2026, 10:35 AM",
    done: true,
    detail: "Nagpur Municipal Corporation — Ward Office Dharampeth notified via email",
  },
  {
    status: "assigned",
    label: "Contractor Assigned",
    icon: Wrench,
    date: "17 Apr 2026, 02:15 PM",
    done: true,
    detail: "Assigned to: Nagpur Road Works Pvt Ltd (NMC-CON-001)",
  },
  {
    status: "progress",
    label: "Repair In Progress",
    icon: Clock,
    date: "18 Apr 2026",
    done: false,
    active: true,
    detail: "Contractor has acknowledged. Repair work scheduled.",
  },
  {
    status: "verified",
    label: "AI Verification",
    icon: ShieldCheck,
    date: "Pending",
    done: false,
    detail: "After repair photo will be analyzed by AI",
  },
  {
    status: "closed",
    label: "Case Closed",
    icon: CheckCircle,
    date: "Pending",
    done: false,
    detail: "Will be closed after successful AI verification",
  },
];

export default function TrackPage() {
  const [complaintNumber, setComplaintNumber] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintNumber.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setSearched(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen p-4 lg:p-8 pb-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-sora text-2xl font-bold text-white">Track Complaint</h1>
          <p className="text-sm text-gray-500">
            Enter your complaint number to view status
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="glass-card p-5">
            <label className="text-xs font-medium text-gray-400 block mb-2">
              Complaint Number
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={complaintNumber}
                  onChange={(e) => {
                    setComplaintNumber(e.target.value.toUpperCase());
                    setSearched(false);
                  }}
                  placeholder="NN-2026-XXXXX"
                  className="input-field pl-10 font-mono"
                />
              </div>
              <button type="submit" className="btn-primary px-6" disabled={loading}>
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Track <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
            <p className="text-[10px] text-gray-600 mt-2">
              Try: NN-2026-48291 for demo
            </p>
          </div>
        </form>

        {/* Timeline */}
        <AnimatePresence>
          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Complaint Info */}
              <div className="glass-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono text-lg font-bold text-accent-amber">
                      {complaintNumber || "NN-2026-48291"}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Filed on 16 Apr 2026
                    </p>
                  </div>
                  <span className="badge-in_progress">
                    <Clock className="h-3 w-3" />
                    In Progress
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-white/[0.03] p-3">
                    <p className="text-gray-500 mb-0.5">Location</p>
                    <p className="text-gray-300">Law College Square, Dharampeth</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] p-3">
                    <p className="text-gray-500 mb-0.5">Severity</p>
                    <p className="text-red-400 font-semibold">L3 — Critical</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="glass-card p-5">
                <h3 className="font-sora text-sm font-semibold text-white mb-5">
                  Complaint Timeline
                </h3>
                <div className="relative pl-8">
                  {/* Vertical line */}
                  <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-white/[0.06]" />

                  {MOCK_TIMELINE.map((item, i) => (
                    <motion.div
                      key={item.status}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.12 }}
                      className="relative mb-6 last:mb-0"
                    >
                      {/* Dot */}
                      <div
                        className={`absolute -left-8 top-0.5 flex h-6 w-6 items-center justify-center rounded-full ${
                          item.done
                            ? "bg-emerald-500/20"
                            : item.active
                            ? "bg-accent-amber/20 ring-2 ring-accent-amber/30"
                            : "bg-white/5"
                        }`}
                      >
                        <item.icon
                          className={`h-3 w-3 ${
                            item.done
                              ? "text-emerald-400"
                              : item.active
                              ? "text-accent-amber"
                              : "text-gray-600"
                          }`}
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-medium ${
                              item.done
                                ? "text-emerald-400"
                                : item.active
                                ? "text-white"
                                : "text-gray-600"
                            }`}
                          >
                            {item.done && "✅ "}{item.label}
                          </p>
                          {item.active && (
                            <span className="h-1.5 w-1.5 rounded-full bg-accent-amber animate-pulse" />
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5">{item.date}</p>
                        <p className="text-xs text-gray-400 mt-1">{item.detail}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
