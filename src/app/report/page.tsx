"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  MapPin,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Shield,
  Copy,
  Download,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { SEVERITY_CONFIG, formatCurrency, generateComplaintNumber } from "@/lib/constants";
import type { Severity } from "@/lib/types";

interface DetectionResponse {
  detected: boolean;
  severity: Severity | null;
  confidence: number;
  damage_type: string;
  road_condition: string;
  estimated_dimensions: { width_cm: number; depth_cm: number } | null;
  safety_risk: string;
  repair_recommendation: string;
  estimated_cost_min: number;
  estimated_cost_max: number;
  description: string;
  message?: string;
  error?: string;
}

const STEPS = [
  { label: "Photo", icon: Camera },
  { label: "AI Analysis", icon: Zap },
  { label: "Location", icon: MapPin },
  { label: "Complaint", icon: FileText },
  { label: "Submit", icon: CheckCircle },
];

export default function ReportPage() {
  const [step, setStep] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [photoHash, setPhotoHash] = useState<string>("");
  const [detection, setDetection] = useState<DetectionResponse | null>(null);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [latitude, setLatitude] = useState<number>(21.1458);
  const [longitude, setLongitude] = useState<number>(79.0882);
  const [address, setAddress] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [description, setDescription] = useState("");
  const [complaint, setComplaint] = useState<{ text: string; number: string } | null>(null);
  const [generatingComplaint, setGeneratingComplaint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // SHA-256 hash generation
  const generateHash = async (buffer: ArrayBuffer): Promise<string> => {
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleImageUpload = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);

      // Extract base64
      const base64 = result.split(",")[1];
      setImageBase64(base64);

      // Generate SHA-256 hash
      const buffer = await file.arrayBuffer();
      const hash = await generateHash(buffer);
      setPhotoHash(hash);

      // Auto-advance to AI analysis
      setStep(1);
      setDetection(null);
      setDetectionError(null);

      // Run detection via Roboflow
      setDetecting(true);
      try {
        const res = await fetch("/api/detect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });
        const data = await res.json();

        if (data.error) {
          setDetectionError(data.error);
          setDetection(null);
        } else {
          setDetection(data);
          setDetectionError(null);
        }
      } catch (err) {
        setDetectionError("Network error. Please check your connection and try again.");
        setDetection(null);
      } finally {
        setDetecting(false);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleImageUpload(file);
      }
    },
    [handleImageUpload]
  );

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          // Reverse geocode
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
            );
            const data = await res.json();
            setAddress(data.display_name || "");
          } catch {
            setAddress("Nagpur, Maharashtra");
          }
        },
        () => {
          setAddress("Nagpur, Maharashtra");
        }
      );
    }
  };

  const generateComplaint = async () => {
    setGeneratingComplaint(true);
    try {
      const res = await fetch("/api/generate-complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: address || "Nagpur",
          severity: detection?.severity || "L2",
          hash: photoHash,
          reporterName: reporterName || "Citizen of Nagpur",
          date: new Date().toLocaleDateString("en-IN"),
          description,
          ward: "Dharampeth",
        }),
      });
      const data = await res.json();
      setComplaint({
        text: data.complaintText,
        number: data.complaintNumber,
      });
    } catch {
      setComplaint({
        text: "Failed to generate complaint. Please try again.",
        number: generateComplaintNumber(),
      });
    } finally {
      setGeneratingComplaint(false);
    }
  };

  const copyComplaint = () => {
    if (complaint) {
      navigator.clipboard.writeText(complaint.text);
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-8 pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-sora text-2xl font-bold text-white">Report a Pothole</h1>
        <p className="text-sm text-gray-500">AI-powered detection and legal complaint generation</p>
      </div>

      {/* Stepper */}
      <div className="mb-8 flex items-center justify-between max-w-2xl mx-auto">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  i <= step
                    ? "border-accent-amber bg-accent-amber/20 text-accent-amber"
                    : "border-white/10 text-gray-600"
                }`}
              >
                <s.icon className="h-4 w-4" />
              </div>
              <span className={`mt-1.5 text-[10px] font-medium ${i <= step ? "text-accent-amber" : "text-gray-600"}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-2 h-[2px] w-8 sm:w-16 ${i < step ? "bg-accent-amber" : "bg-white/10"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Step 0: Photo Upload */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="glass-card flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 hover:border-accent-amber/30 cursor-pointer transition-all"
              >
                <Upload className="h-12 w-12 text-gray-500 mb-4" />
                <p className="text-sm text-gray-400 mb-1">Drag & drop a photo or click to upload</p>
                <p className="text-xs text-gray-600">Supports JPG, PNG • Max 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary w-full"
              >
                <Camera className="h-5 w-5" />
                Take Photo
              </button>
            </motion.div>
          )}

          {/* Step 1: AI Analysis */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Image Preview */}
              {imagePreview && (
                <div className="glass-card overflow-hidden relative">
                  <img src={imagePreview} alt="Uploaded" className="w-full h-64 object-cover" />
                  {detection && detection.detected && (
                    <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <AlertTriangle className="h-3 w-3" />
                      {detection.damage_type?.replace("_", " ").toUpperCase()} DETECTED
                    </div>
                  )}
                </div>
              )}

              {detecting ? (
                <div className="glass-card p-8 text-center">
                  <Loader2 className="h-8 w-8 text-accent-amber animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-400">AI analyzing image...</p>
                  <p className="text-xs text-gray-600 mt-1">Powered by Gemini Vision AI</p>
                </div>
              ) : detectionError ? (
                /* ── API Error ── */
                <div className="glass-card p-8 text-center border border-red-500/20">
                  <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-3" />
                  <p className="text-sm text-red-400 font-medium mb-1">Detection Failed</p>
                  <p className="text-xs text-gray-500">{detectionError}</p>
                  <button
                    onClick={() => { setStep(0); setDetection(null); setDetectionError(null); }}
                    className="btn-ghost mt-4 text-xs mx-auto"
                  >
                    <Camera className="h-3.5 w-3.5" /> Try Another Photo
                  </button>
                </div>
              ) : detection && !detection.detected ? (
                /* ── No Pothole Detected ── */
                <div className="glass-card p-8 text-center border border-yellow-500/20">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500/10">
                    <AlertTriangle className="h-7 w-7 text-yellow-400" />
                  </div>
                  <p className="text-sm text-yellow-400 font-semibold mb-2">No Pothole Detected</p>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                    {detection.message || "No pothole detected in this image. Please upload a clear photo of the road surface."}
                  </p>
                  {detection.road_condition && (
                    <p className="text-xs text-gray-500 mt-2 italic">
                      Road condition: {detection.road_condition}
                    </p>
                  )}
                  <button
                    onClick={() => { setStep(0); setDetection(null); }}
                    className="btn-secondary mt-5 text-xs mx-auto"
                  >
                    <Camera className="h-3.5 w-3.5" /> Upload Different Photo
                  </button>
                </div>
              ) : detection && detection.detected ? (
                /* ── Pothole Detected — Rich Gemini Analysis ── */
                <div className="space-y-3">
                  {/* Severity + Confidence Row */}
                  <div className="glass-card p-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Severity Classification</p>
                      <span className={`badge-${detection.severity?.toLowerCase()}`}>
                        <AlertTriangle className="h-3 w-3" />
                        {detection.severity} — {detection.severity ? SEVERITY_CONFIG[detection.severity]?.label : "Unknown"}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">AI Confidence</p>
                      <p className="font-mono text-lg font-bold text-white">
                        {Math.round(detection.confidence * 100)}%
                      </p>
                    </div>
                  </div>

                  {/* Damage Type + Safety Risk */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass-card p-4">
                      <p className="text-xs text-gray-500 mb-1">Damage Type</p>
                      <p className="text-sm font-semibold text-white capitalize">
                        {detection.damage_type?.replace("_", " ") || "Pothole"}
                      </p>
                    </div>
                    <div className="glass-card p-4">
                      <p className="text-xs text-gray-500 mb-1">Safety Risk</p>
                      <p className={`text-sm font-semibold capitalize ${
                        detection.safety_risk === "critical" ? "text-red-400" :
                        detection.safety_risk === "high" ? "text-orange-400" :
                        detection.safety_risk === "medium" ? "text-yellow-400" :
                        "text-green-400"
                      }`}>
                        ● {detection.safety_risk || "Medium"}
                      </p>
                    </div>
                  </div>

                  {/* Estimated Dimensions */}
                  {detection.estimated_dimensions && (
                    <div className="glass-card p-4">
                      <p className="text-xs text-gray-500 mb-2">Estimated Dimensions</p>
                      <div className="flex gap-6">
                        <div>
                          <p className="text-[10px] text-gray-600">Width</p>
                          <p className="font-mono text-sm font-bold text-white">
                            ~{detection.estimated_dimensions.width_cm} cm
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-600">Depth</p>
                          <p className="font-mono text-sm font-bold text-white">
                            ~{detection.estimated_dimensions.depth_cm} cm
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Road Condition */}
                  {detection.road_condition && (
                    <div className="glass-card p-4">
                      <p className="text-xs text-gray-500 mb-1">Road Condition</p>
                      <p className="text-sm text-gray-300">{detection.road_condition}</p>
                    </div>
                  )}

                  {/* AI Description */}
                  {detection.description && (
                    <div className="glass-card p-4 border border-accent-amber/10">
                      <p className="text-xs text-accent-amber mb-1.5 font-medium flex items-center gap-1.5">
                        <Zap className="h-3 w-3" /> AI Analysis
                      </p>
                      <p className="text-xs text-gray-300 leading-relaxed">{detection.description}</p>
                    </div>
                  )}

                  {/* Repair Recommendation */}
                  {detection.repair_recommendation && (
                    <div className="glass-card p-4">
                      <p className="text-xs text-gray-500 mb-1">Repair Recommendation</p>
                      <p className="text-sm text-blue-300">{detection.repair_recommendation}</p>
                    </div>
                  )}

                  {/* Cost Estimate */}
                  <div className="glass-card p-5">
                    <p className="text-xs text-gray-500 mb-1">Estimated Repair Cost</p>
                    <p className="font-sora text-lg font-bold text-accent-amber">
                      {formatCurrency(detection.estimated_cost_min)} — {formatCurrency(detection.estimated_cost_max)}
                    </p>
                  </div>

                  {/* Evidence Hash */}
                  <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-emerald-400" />
                      <p className="text-xs font-medium text-emerald-400">Evidence Locked</p>
                    </div>
                    <p className="font-mono text-xs text-gray-400 break-all">
                      SHA-256: {photoHash.slice(0, 32)}...
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="flex gap-3">
                <button onClick={() => { setStep(0); setDetection(null); setDetectionError(null); }} className="btn-ghost">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={() => { getLocation(); setStep(2); }}
                  className="btn-primary flex-1"
                  disabled={!detection || !detection.detected}
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="glass-card p-5">
                <p className="text-xs text-gray-500 mb-3">GPS Coordinates</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-[10px] text-gray-600 block mb-1">Latitude</label>
                    <input
                      type="number"
                      value={latitude}
                      onChange={(e) => setLatitude(parseFloat(e.target.value))}
                      className="input-field font-mono text-sm"
                      step="0.0001"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-600 block mb-1">Longitude</label>
                    <input
                      type="number"
                      value={longitude}
                      onChange={(e) => setLongitude(parseFloat(e.target.value))}
                      className="input-field font-mono text-sm"
                      step="0.0001"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-gray-600 block mb-1">Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Auto-detected or enter manually"
                    className="input-field text-sm"
                  />
                </div>
                <button onClick={getLocation} className="btn-ghost mt-3 text-xs">
                  <MapPin className="h-3.5 w-3.5" /> Re-detect Location
                </button>
              </div>

              <div className="glass-card p-5 space-y-3">
                <div>
                  <label className="text-[10px] text-gray-600 block mb-1">Your Name</label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="Rajesh Kumar"
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-600 block mb-1">Description (optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Additional details about the pothole..."
                    className="input-field text-sm h-20 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-ghost">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={() => { setStep(3); generateComplaint(); }}
                  className="btn-primary flex-1"
                >
                  Generate Complaint <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Complaint */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {generatingComplaint ? (
                <div className="glass-card p-12 text-center">
                  <Loader2 className="h-8 w-8 text-accent-amber animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-400">Generating RTI-grade legal complaint...</p>
                  <p className="text-xs text-gray-600 mt-1">Powered by Gemini AI</p>
                </div>
              ) : complaint ? (
                <>
                  <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Complaint Number</p>
                        <p className="font-mono text-lg font-bold text-accent-amber">
                          {complaint.number}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={copyComplaint} className="btn-ghost text-xs">
                          <Copy className="h-3.5 w-3.5" /> Copy
                        </button>
                        <button className="btn-ghost text-xs">
                          <Download className="h-3.5 w-3.5" /> PDF
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-6">
                    <pre className="whitespace-pre-wrap text-xs text-gray-300 leading-relaxed font-inter">
                      {complaint.text}
                    </pre>
                  </div>
                </>
              ) : null}

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-ghost">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={() => { setStep(4); setSubmitted(true); }}
                  className="btn-primary flex-1"
                  disabled={!complaint}
                >
                  Submit Report <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && submitted && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20"
              >
                <CheckCircle className="h-10 w-10 text-emerald-400" />
              </motion.div>
              <h2 className="font-sora text-2xl font-bold text-white mb-2">
                Report Submitted Successfully
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Your complaint has been filed and the municipality will be notified.
              </p>
              {complaint && (
                <p className="font-mono text-sm text-accent-amber mb-6">
                  Complaint No: {complaint.number}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="/track" className="btn-secondary text-sm">
                  Track Your Complaint
                </a>
                <a href="/map" className="btn-ghost text-sm">
                  View on Map
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
