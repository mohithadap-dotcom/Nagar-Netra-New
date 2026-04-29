/* ═══════════════════════════════════════════════
   NAGARNETRA — Constants & Seed Data
   ═══════════════════════════════════════════════ */

import { Contractor, Pothole, PotholeStatus, Severity } from "./types";

// ─── Map Configuration ──────────────────────────
export const NAGPUR_CENTER = { lat: 21.1458, lng: 79.0882 };
export const DEFAULT_ZOOM = 12;

// ─── Wards ──────────────────────────────────────
export const NAGPUR_WARDS = [
  "Dharampeth",
  "Sadar",
  "Sitabuldi",
  "Gandhibagh",
  "Lakadganj",
  "Hanuman Nagar",
  "Nehru Nagar",
  "Ashi Nagar",
  "Mangalwari",
  "Lashkaribagh",
] as const;

// ─── Severity Config ────────────────────────────
export const SEVERITY_CONFIG: Record<
  Severity,
  { label: string; labelHi: string; color: string; costMin: number; costMax: number; bgClass: string; textClass: string }
> = {
  L1: {
    label: "Minor",
    labelHi: "मामूली",
    color: "#FBBF24",
    costMin: 3000,
    costMax: 8000,
    bgClass: "bg-yellow-500/15",
    textClass: "text-yellow-400",
  },
  L2: {
    label: "Moderate",
    labelHi: "मध्यम",
    color: "#F97316",
    costMin: 8000,
    costMax: 25000,
    bgClass: "bg-orange-500/15",
    textClass: "text-orange-400",
  },
  L3: {
    label: "Critical",
    labelHi: "गंभीर",
    color: "#EF4444",
    costMin: 25000,
    costMax: 100000,
    bgClass: "bg-red-500/15",
    textClass: "text-red-400",
  },
};

// ─── Status Config ──────────────────────────────
export const STATUS_CONFIG: Record<
  PotholeStatus,
  { label: string; color: string; icon: string }
> = {
  reported: { label: "Reported", color: "#F97316", icon: "AlertCircle" },
  acknowledged: { label: "Acknowledged", color: "#3B82F6", icon: "Eye" },
  in_progress: { label: "In Progress", color: "#8B5CF6", icon: "Wrench" },
  completed: { label: "Completed", color: "#10B981", icon: "CheckCircle" },
  verified: { label: "Verified", color: "#06D6A0", icon: "ShieldCheck" },
};

// ─── Seed Contractors ───────────────────────────
export const SEED_CONTRACTORS: Omit<Contractor, "id" | "created_at">[] = [
  {
    name: "Nagpur Road Works Pvt Ltd",
    license_number: "NMC-CON-001",
    accountability_score: 96,
    total_assigned: 45,
    total_completed: 45,
    total_verified: 42,
    avg_completion_days: 3.2,
    city: "Nagpur",
  },
  {
    name: "Maharashtra Infra Solutions",
    license_number: "NMC-CON-002",
    accountability_score: 89,
    total_assigned: 38,
    total_completed: 36,
    total_verified: 33,
    avg_completion_days: 5.1,
    city: "Nagpur",
  },
  {
    name: "City Build Contractors",
    license_number: "NMC-CON-003",
    accountability_score: 78,
    total_assigned: 30,
    total_completed: 27,
    total_verified: 22,
    avg_completion_days: 7.4,
    city: "Nagpur",
  },
  {
    name: "Vidarbha Highway Services",
    license_number: "NMC-CON-004",
    accountability_score: 67,
    total_assigned: 25,
    total_completed: 20,
    total_verified: 14,
    avg_completion_days: 11.2,
    city: "Nagpur",
  },
  {
    name: "Quick Fix Roads Ltd",
    license_number: "NMC-CON-005",
    accountability_score: 45,
    total_assigned: 20,
    total_completed: 12,
    total_verified: 6,
    avg_completion_days: 18.5,
    city: "Nagpur",
  },
];

// ─── Seed Potholes ──────────────────────────────
export const SEED_POTHOLES: Omit<Pothole, "id" | "reported_by" | "complaint_id" | "assigned_contractor_id" | "created_at" | "updated_at" | "contractor" | "complaint" | "reporter">[] = [
  // Dharampeth Ward (4)
  {
    latitude: 21.1520,
    longitude: 79.0750,
    address: "Law College Square, Dharampeth",
    ward: "Dharampeth",
    severity: "L3",
    severity_score: 0.92,
    status: "reported",
    ai_confidence: 0.92,
    estimated_repair_cost: 45000,
    photo_hash: "a3f9c2e8b1d4f6a7c9e2b5d8f1a3c6e9",
  },
  {
    latitude: 21.1485,
    longitude: 79.0710,
    address: "Seminary Hills Road, Dharampeth",
    ward: "Dharampeth",
    severity: "L2",
    severity_score: 0.75,
    status: "in_progress",
    ai_confidence: 0.78,
    estimated_repair_cost: 15000,
    photo_hash: "b4e8d2c7a1f5e3b9d6c8a2e5f7b1d4a8",
  },
  {
    latitude: 21.1505,
    longitude: 79.0780,
    address: "Ambazari Road, Dharampeth",
    ward: "Dharampeth",
    severity: "L2",
    severity_score: 0.68,
    status: "reported",
    ai_confidence: 0.72,
    estimated_repair_cost: 12000,
    photo_hash: "c5d7e3b8a2f4d6c1e9b3a7f2d8c4e6b1",
  },
  {
    latitude: 21.1460,
    longitude: 79.0730,
    address: "Telangkhedi Garden Road, Dharampeth",
    ward: "Dharampeth",
    severity: "L1",
    severity_score: 0.45,
    status: "completed",
    ai_confidence: 0.52,
    estimated_repair_cost: 5000,
    photo_hash: "d6c8e4b9a3f5e7d2c1b4a8f3e9d5c7b2",
  },
  // Sadar Ward (4)
  {
    latitude: 21.1390,
    longitude: 79.0850,
    address: "Sadar Main Road, near RBI Square",
    ward: "Sadar",
    severity: "L3",
    severity_score: 0.95,
    status: "reported",
    ai_confidence: 0.95,
    estimated_repair_cost: 65000,
    photo_hash: "e7b9d5c1a4f6e8d3c2b5a9f4e1d7c8b3",
  },
  {
    latitude: 21.1375,
    longitude: 79.0890,
    address: "Residency Road, Sadar",
    ward: "Sadar",
    severity: "L3",
    severity_score: 0.88,
    status: "acknowledged",
    ai_confidence: 0.89,
    estimated_repair_cost: 55000,
    photo_hash: "f8c1e6d2b5a7f9e4d3c6b1a2f8e3d9c4",
  },
  {
    latitude: 21.1410,
    longitude: 79.0920,
    address: "Central Avenue, Sadar",
    ward: "Sadar",
    severity: "L2",
    severity_score: 0.72,
    status: "in_progress",
    ai_confidence: 0.75,
    estimated_repair_cost: 18000,
    photo_hash: "a9d2e7c3b6f1a8e5d4c7b2a3f9e1d6c5",
  },
  {
    latitude: 21.1355,
    longitude: 79.0870,
    address: "Kingsway, Sadar",
    ward: "Sadar",
    severity: "L1",
    severity_score: 0.42,
    status: "verified",
    ai_confidence: 0.48,
    estimated_repair_cost: 4000,
    photo_hash: "b1e3d8c4a7f2b9e6d5c8a1f4b2e7d3c6",
  },
  // Sitabuldi Ward (4)
  {
    latitude: 21.1440,
    longitude: 79.0950,
    address: "Sitabuldi Fort Road",
    ward: "Sitabuldi",
    severity: "L3",
    severity_score: 0.91,
    status: "reported",
    ai_confidence: 0.91,
    estimated_repair_cost: 48000,
    photo_hash: "c2f4e9d5b8a1c7e3d6b4a9f5c1e8d2b7",
  },
  {
    latitude: 21.1425,
    longitude: 79.0980,
    address: "Variety Square, Sitabuldi",
    ward: "Sitabuldi",
    severity: "L2",
    severity_score: 0.74,
    status: "reported",
    ai_confidence: 0.76,
    estimated_repair_cost: 14000,
    photo_hash: "d3a5f1e6c9b2d8e4a7c3f6b1e9d5a2c8",
  },
  {
    latitude: 21.1455,
    longitude: 79.1010,
    address: "Morris College Road, Sitabuldi",
    ward: "Sitabuldi",
    severity: "L2",
    severity_score: 0.65,
    status: "completed",
    ai_confidence: 0.69,
    estimated_repair_cost: 11000,
    photo_hash: "e4b6d2a8c1f3e7d9b5a2c8f4e1b7d3a9",
  },
  {
    latitude: 21.1470,
    longitude: 79.0930,
    address: "Cotton Market Road, Sitabuldi",
    ward: "Sitabuldi",
    severity: "L1",
    severity_score: 0.38,
    status: "verified",
    ai_confidence: 0.42,
    estimated_repair_cost: 3500,
    photo_hash: "f5c7e3b9d2a4f8e1c6b3a7d5f2e8c4b1",
  },
  // Gandhibagh Ward (3)
  {
    latitude: 21.1530,
    longitude: 79.1050,
    address: "Gandhibagh Main Road",
    ward: "Gandhibagh",
    severity: "L3",
    severity_score: 0.87,
    status: "reported",
    ai_confidence: 0.88,
    estimated_repair_cost: 42000,
    photo_hash: "a6d8e4c1b3f5a9e2d7c4b8f1a3e6d9c2",
  },
  {
    latitude: 21.1545,
    longitude: 79.1080,
    address: "Itwari Railway Station Road, Gandhibagh",
    ward: "Gandhibagh",
    severity: "L2",
    severity_score: 0.71,
    status: "in_progress",
    ai_confidence: 0.73,
    estimated_repair_cost: 16000,
    photo_hash: "b7e9d5c2a4f6b1e3d8c5a9f2b4e7d1c3",
  },
  {
    latitude: 21.1510,
    longitude: 79.1030,
    address: "Maskasath Road, Gandhibagh",
    ward: "Gandhibagh",
    severity: "L1",
    severity_score: 0.40,
    status: "completed",
    ai_confidence: 0.45,
    estimated_repair_cost: 6000,
    photo_hash: "c8f1e6d3b5a7c2e4d9b6a1f3c5e8d4b8",
  },
  // Lakadganj Ward (3)
  {
    latitude: 21.1580,
    longitude: 79.1120,
    address: "Lakadganj Chowk, Main Road",
    ward: "Lakadganj",
    severity: "L3",
    severity_score: 0.90,
    status: "reported",
    ai_confidence: 0.90,
    estimated_repair_cost: 50000,
    photo_hash: "d9a2e7c4b6f8d1e5c3b9a4f7d2e6c1b5",
  },
  {
    latitude: 21.1600,
    longitude: 79.1150,
    address: "Pardi, Lakadganj",
    ward: "Lakadganj",
    severity: "L2",
    severity_score: 0.69,
    status: "in_progress",
    ai_confidence: 0.71,
    estimated_repair_cost: 13000,
    photo_hash: "e1b3d8c5a7f9e2d4c6b1a8f5e3d7c2b9",
  },
  {
    latitude: 21.1565,
    longitude: 79.1100,
    address: "Nari Road, Lakadganj",
    ward: "Lakadganj",
    severity: "L1",
    severity_score: 0.35,
    status: "verified",
    ai_confidence: 0.40,
    estimated_repair_cost: 4500,
    photo_hash: "f2c4e9d6b8a1f3e5d7c9b2a6f8e1d4c3",
  },
];

// ─── Navigation Items ───────────────────────────
export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/report", label: "Report", icon: "Camera" },
  { href: "/map", label: "Live Map", icon: "MapPin" },
  { href: "/contractors", label: "Contractors", icon: "Users" },
  { href: "/track", label: "Track", icon: "Search" },
  { href: "/verify", label: "Verify", icon: "ShieldCheck" },
] as const;

// ─── Formatting Helpers ─────────────────────────
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function generateComplaintNumber(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(10000 + Math.random() * 90000);
  return `NN-${year}-${num}`;
}

export function getDaysOpen(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
}

export function getScoreColor(score: number): string {
  if (score >= 85) return "#10B981";
  if (score >= 70) return "#F59E0B";
  if (score >= 50) return "#F97316";
  return "#EF4444";
}
