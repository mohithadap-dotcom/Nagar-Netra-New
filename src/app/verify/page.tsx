"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Camera,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Shield,
  ArrowRight,
  MapPin,
  Image as ImageIcon,
} from "lucide-react";
import { SEED_POTHOLES, SEVERITY_CONFIG, formatCurrency } from "@/lib/constants";

export default function VerifyPage() {
  const [selectedPothole, setSelectedPothole] = useState<number | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [afterBase64, setAfterBase64] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<{
    verified: boolean;
    confidence: number;
    result: string;
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const assignedPotholes = SEED_POTHOLES.filter(
    (p) => p.status === "in_progress" || p.status === "completed"
  ).map((p, i) => ({ ...p, id: `pothole-${String(i + 1).padStart(3, "0")}` }));

  const handleAfterImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setAfterImage(dataUrl);
      setAfterBase64(dataUrl.split(",")[1]);
      setResult(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleVerify = async () => {
    if (!afterBase64 || selectedPothole === null) return;
    setVerifying(true);

    try {
      const res = await fetch("/api/verify-repair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          potholeId: assignedPotholes[selectedPothole]?.id,
          afterImage: afterBase64,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        verified: false,
        confidence: 0,
        result: "error",
        message: "Verification failed. Please try again.",
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-8 pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="font-sora text-2xl font-bold text-white">Verify Repair</h1>
          <p className="text-sm text-gray-500">
            Upload after-repair photo for AI verification
          </p>
        </div>

        <div className="space-y-6">
          {/* Select Pothole */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5"
          >
            <h3 className="font-sora text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent-amber" />
              Select Pothole to Verify
            </h3>
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {assignedPotholes.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPothole(i)}
                  className={`w-full text-left rounded-lg p-3 transition-all text-sm ${
                    selectedPothole === i
                      ? "bg-accent-amber/10 border border-accent-amber/30"
                      : "bg-white/[0.03] border border-transparent hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-xs">{p.address}</p>
                      <p className="text-gray-500 text-[10px] mt-0.5">
                        {p.ward} • {p.severity} — {SEVERITY_CONFIG[p.severity].label}
                      </p>
                    </div>
                    <span className={`badge-${p.status}`}>
                      {p.status === "in_progress" ? "In Progress" : "Completed"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Before/After Upload */}
          {selectedPothole !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Before */}
                <div className="glass-card p-4">
                  <p className="text-xs font-medium text-gray-400 mb-3 flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Before (Original Report)
                  </p>
                  <div className="h-48 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                    <div className="text-center">
                      <AlertTriangle className="h-8 w-8 text-red-400/50 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">
                        {assignedPotholes[selectedPothole].severity} Pothole
                      </p>
                      <p className="text-[10px] text-gray-600">
                        {assignedPotholes[selectedPothole].address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="glass-card p-4">
                  <p className="text-xs font-medium text-gray-400 mb-3 flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5" />
                    After (Repair Photo)
                  </p>
                  {afterImage ? (
                    <div className="h-48 rounded-lg overflow-hidden relative">
                      <img
                        src={afterImage}
                        alt="After repair"
                        className="h-full w-full object-cover"
                      />
                      <button
                        onClick={() => { setAfterImage(null); setAfterBase64(null); setResult(null); }}
                        className="absolute top-2 right-2 bg-black/60 rounded-full p-1"
                      >
                        <XCircle className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="h-48 rounded-lg border-2 border-dashed border-white/10 hover:border-accent-amber/30 flex items-center justify-center cursor-pointer transition-all"
                    >
                      <div className="text-center">
                        <Upload className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">Upload after photo</p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAfterImage(file);
                    }}
                  />
                </div>
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerify}
                disabled={!afterBase64 || verifying}
                className="btn-primary w-full mt-4 disabled:opacity-50"
              >
                {verifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    AI Verifying Repair...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Run AI Verification
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`glass-card p-8 text-center ${
                  result.result === "approved"
                    ? "border-emerald-500/30"
                    : result.result === "partial"
                    ? "border-yellow-500/30"
                    : "border-red-500/30"
                }`}
              >
                <div
                  className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                    result.result === "approved"
                      ? "bg-emerald-500/20"
                      : result.result === "partial"
                      ? "bg-yellow-500/20"
                      : "bg-red-500/20"
                  }`}
                >
                  {result.result === "approved" ? (
                    <CheckCircle className="h-8 w-8 text-emerald-400" />
                  ) : result.result === "partial" ? (
                    <AlertTriangle className="h-8 w-8 text-yellow-400" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-400" />
                  )}
                </div>
                <h3 className="font-sora text-xl font-bold text-white mb-2">
                  {result.message}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  AI Confidence: {Math.round(result.confidence * 100)}%
                </p>
                {result.result === "approved" && (
                  <p className="text-xs text-emerald-400/70">
                    Contractor accountability score will be updated automatically.
                  </p>
                )}
                {result.result === "rejected" && (
                  <p className="text-xs text-red-400/70">
                    This result has been logged. Contractor will receive a -20 penalty.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
