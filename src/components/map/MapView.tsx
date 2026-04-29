"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { NAGPUR_CENTER, DEFAULT_ZOOM, SEVERITY_CONFIG, STATUS_CONFIG, formatCurrency, getDaysOpen } from "@/lib/constants";
import type { Severity } from "@/lib/types";

interface PotholeData {
  latitude: number;
  longitude: number;
  address: string;
  ward: string;
  severity: Severity;
  severity_score: number;
  status: string;
  ai_confidence: number;
  estimated_repair_cost: number;
  photo_hash?: string;
}

interface MapViewProps {
  potholes: PotholeData[];
}

function getMarkerColor(pothole: PotholeData): string {
  if (pothole.status === "completed" || pothole.status === "verified") {
    return "#10B981";
  }
  return SEVERITY_CONFIG[pothole.severity]?.color || "#6B7280";
}

export default function MapView({ potholes }: MapViewProps) {
  return (
    <MapContainer
      center={[NAGPUR_CENTER.lat, NAGPUR_CENTER.lng]}
      zoom={DEFAULT_ZOOM}
      style={{ height: "100%", width: "100%" }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {potholes.map((pothole, idx) => {
        const color = getMarkerColor(pothole);
        const isL3Active =
          pothole.severity === "L3" &&
          !["completed", "verified"].includes(pothole.status);
        const createdDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString();

        return (
          <CircleMarker
            key={idx}
            center={[pothole.latitude, pothole.longitude]}
            radius={isL3Active ? 10 : 7}
            pathOptions={{
              fillColor: color,
              color: color,
              weight: isL3Active ? 2 : 1,
              fillOpacity: 0.7,
              opacity: 0.9,
            }}
          >
            <Popup>
              <div className="min-w-[220px] text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                <p className="font-semibold text-sm text-white mb-2">
                  {pothole.address}
                </p>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ward</span>
                    <span className="text-white font-medium">{pothole.ward}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Severity</span>
                    <span className="font-medium" style={{ color }}>
                      {pothole.severity} — {SEVERITY_CONFIG[pothole.severity]?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className="text-white">
                      {STATUS_CONFIG[pothole.status as keyof typeof STATUS_CONFIG]?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">AI Confidence</span>
                    <span className="text-white font-mono">
                      {Math.round(pothole.ai_confidence * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Est. Cost</span>
                    <span className="text-amber-400 font-medium">
                      {formatCurrency(pothole.estimated_repair_cost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Days Open</span>
                    <span className="text-white">{getDaysOpen(createdDate)}</span>
                  </div>
                </div>
                {pothole.photo_hash && (
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="text-[10px] text-gray-500 font-mono truncate">
                      Hash: {pothole.photo_hash}
                    </p>
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
