"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-navy relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[400px] w-[400px] rounded-full bg-accent-amber/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-amber/20">
              <Eye className="h-6 w-6 text-accent-amber" />
            </div>
            <div className="text-left">
              <h1 className="font-sora text-2xl font-bold text-white">NagarNetra</h1>
              <p className="text-[10px] uppercase tracking-widest text-gray-500">
                Civic Accountability Platform
              </p>
            </div>
          </Link>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8">
          <h2 className="font-sora text-xl font-semibold text-white mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Sign in to continue to NagarNetra
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@nagpur.gov.in"
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
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-accent-amber hover:text-accent-amber-light transition-colors">
              Create one
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 rounded-lg border border-white/[0.06] bg-navy-100/50 p-4 text-center">
          <p className="text-xs text-gray-500 mb-2">Demo Mode — Skip auth and explore</p>
          <Link href="/dashboard" className="text-xs text-accent-amber hover:underline">
            Enter Dashboard →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
