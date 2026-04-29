import { NextResponse } from "next/server";
import { SEED_POTHOLES, SEED_CONTRACTORS } from "@/lib/constants";

export async function GET() {
  // Generate stats from seed data
  const potholes = SEED_POTHOLES;
  const contractors = SEED_CONTRACTORS;

  const total_reports = potholes.length;

  const by_status = {
    reported: potholes.filter((p) => p.status === "reported").length,
    acknowledged: potholes.filter((p) => p.status === "acknowledged").length,
    in_progress: potholes.filter((p) => p.status === "in_progress").length,
    completed: potholes.filter((p) => p.status === "completed").length,
    verified: potholes.filter((p) => p.status === "verified").length,
  };

  const by_severity = {
    L1: potholes.filter((p) => p.severity === "L1").length,
    L2: potholes.filter((p) => p.severity === "L2").length,
    L3: potholes.filter((p) => p.severity === "L3").length,
  };

  const by_ward: Record<string, number> = {};
  potholes.forEach((p) => {
    by_ward[p.ward] = (by_ward[p.ward] || 0) + 1;
  });

  const critical_unresolved = potholes.filter(
    (p) => p.severity === "L3" && !["completed", "verified"].includes(p.status)
  ).length;

  const avg_resolution_days = 6.3;
  const contractor_compliance =
    contractors.reduce((sum, c) => sum + c.accountability_score, 0) / contractors.length;

  // Generate trend data (last 30 days)
  const recent_trend = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 5) + 1,
    };
  });

  return NextResponse.json({
    total_reports,
    critical_unresolved,
    avg_resolution_days,
    contractor_compliance: Math.round(contractor_compliance * 10) / 10,
    by_status,
    by_severity,
    by_ward,
    recent_trend,
  });
}
