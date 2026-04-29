/* ═══════════════════════════════════════════════
   NAGARNETRA — TypeScript Types
   ═══════════════════════════════════════════════ */

export type UserRole = "citizen" | "officer" | "contractor" | "admin";

export type Severity = "L1" | "L2" | "L3";

export type PotholeStatus =
  | "reported"
  | "acknowledged"
  | "in_progress"
  | "completed"
  | "verified";

export type VerificationResult = "approved" | "rejected" | "partial";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  ward?: string;
  city: string;
  created_at: string;
}

export interface Pothole {
  id: string;
  reported_by: string;
  latitude: number;
  longitude: number;
  address: string;
  ward: string;
  severity: Severity;
  severity_score: number;
  status: PotholeStatus;
  photo_before_url?: string;
  photo_after_url?: string;
  photo_hash?: string;
  ai_confidence: number;
  estimated_repair_cost: number;
  assigned_contractor_id?: string;
  complaint_id?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  contractor?: Contractor;
  complaint?: Complaint;
  reporter?: User;
}

export interface Complaint {
  id: string;
  pothole_id: string;
  complaint_text: string;
  complaint_number: string;
  filed_by: string;
  status: string;
  municipality_notified: boolean;
  created_at: string;
}

export interface Contractor {
  id: string;
  name: string;
  license_number: string;
  accountability_score: number;
  total_assigned: number;
  total_completed: number;
  total_verified: number;
  avg_completion_days: number;
  city: string;
  created_at: string;
}

export interface Verification {
  id: string;
  pothole_id: string;
  verified_by_ai: boolean;
  ai_confidence: number;
  verification_result: VerificationResult;
  notes?: string;
  created_at: string;
}

export interface DetectionResult {
  detected: boolean;
  severity: Severity | null;
  confidence: number;
  damage_type: "pothole" | "crack" | "sinkhole" | "surface_erosion" | "none";
  road_condition: string;
  estimated_dimensions: {
    width_cm: number;
    depth_cm: number;
  } | null;
  safety_risk: "low" | "medium" | "high" | "critical";
  repair_recommendation: string;
  estimated_cost_min: number;
  estimated_cost_max: number;
  description: string;
  message?: string;
}

export interface DashboardStats {
  total_reports: number;
  critical_unresolved: number;
  avg_resolution_days: number;
  contractor_compliance: number;
  by_status: Record<PotholeStatus, number>;
  by_severity: Record<Severity, number>;
  by_ward: Record<string, number>;
  recent_trend: { date: string; count: number }[];
}

export interface MapFilter {
  severity?: Severity[];
  status?: PotholeStatus[];
  ward?: string[];
  dateRange?: { from: string; to: string };
}
