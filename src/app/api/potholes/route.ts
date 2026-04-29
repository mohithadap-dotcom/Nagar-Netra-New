import { NextRequest, NextResponse } from "next/server";
import { SEED_POTHOLES } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ward = searchParams.get("ward");
  const severity = searchParams.get("severity");
  const status = searchParams.get("status");

  let filtered = [...SEED_POTHOLES];

  if (ward) {
    filtered = filtered.filter((p) => p.ward === ward);
  }
  if (severity) {
    filtered = filtered.filter((p) => p.severity === severity);
  }
  if (status) {
    filtered = filtered.filter((p) => p.status === status);
  }

  // Add IDs and timestamps for the response
  const potholes = filtered.map((p, i) => ({
    ...p,
    id: `pothole-${String(i + 1).padStart(3, "0")}`,
    reported_by: "citizen-demo-001",
    created_at: new Date(
      Date.now() - Math.floor(Math.random() * 30) * 86400000
    ).toISOString(),
    updated_at: new Date(
      Date.now() - Math.floor(Math.random() * 10) * 86400000
    ).toISOString(),
  }));

  // Return as GeoJSON-compatible
  const geojson = {
    type: "FeatureCollection",
    features: potholes.map((p) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [p.longitude, p.latitude],
      },
      properties: {
        id: p.id,
        address: p.address,
        ward: p.ward,
        severity: p.severity,
        severity_score: p.severity_score,
        status: p.status,
        ai_confidence: p.ai_confidence,
        estimated_repair_cost: p.estimated_repair_cost,
        photo_hash: p.photo_hash,
        created_at: p.created_at,
        updated_at: p.updated_at,
      },
    })),
    total: potholes.length,
  };

  return NextResponse.json(geojson);
}
