"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Mail, Lock, User, ArrowRight, Loader2, Building } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { NAGPUR_WARDS } from "@/lib/constants";
import type { UserRole } from "@/lib/types";

const ROLES: { value: UserRole; label: string; desc: string }[] = [
  { value: "citizen", label: "Citizen", desc: "Report potholes and track complaints" },
  { value: "officer", label: "Municipal Officer", desc: "Manage reports and assign contractors" },
  { value: "contractor", label: "Contractor", desc: "View assignments and submit repairs" },
];

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("citizen");
  const [ward, setWard] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const needsVerification = role === "officer" || role === "contractor";

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (needsVerification && verificationCode !== "NAGPUR2024") {
      setError("Invalid verification code. Contact your administrator.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role } },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (authData.user) {
        await supabase.from("users").insert({
          id: authData.user.id,
          email,
          name,
          role,
          ward: ward || null,
          city: "Nagpur",
        });
      }

      router.push("/dashboard");
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute right-1/4 top-1/3">
        <div className="h-[400px] w-[400px] rounded-full bg-accent-blue/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-amber/20">
              <Eye className="h-6 w-6 text-accent-amber" />
            </div>
            <div className="text-left">
              <h1 className="font-sora text-2xl font-bold text-white">NagarNetra</h1>
              <p className="text-[10px] uppercase tracking-widest text-gray-500">
                Create Account
              </p>
            </div>
          </Link>
        </div>

        <div className="glass-card p-8">
          <h2 className="font-sora text-xl font-semibold text-white mb-1">
            Join NagarNetra
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Create an account to start reporting
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400">
                I am a
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    type="button"
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    className={`rounded-lg border px-3 py-2.5 text-xs font-medium transition-all ${
                      role === r.value
                        ? "border-accent-amber bg-accent-amber/10 text-accent-amber"
                        : "border-white/10 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-400">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rajesh Kumar"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-400">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {(role === "officer" || role === "citizen") && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  Ward
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="input-field pl-10 appearance-none"
                  >
                    <option value="">Select ward (optional)</option>
                    {NAGPUR_WARDS.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {needsVerification && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter code from administrator"
                  className="input-field font-mono"
                  required
                />
                <p className="mt-1 text-[10px] text-gray-600">
                  Hint for demo: NAGPUR2024
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-accent-amber hover:text-accent-amber-light transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
