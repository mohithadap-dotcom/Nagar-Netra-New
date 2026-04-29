"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  Eye,
  Camera,
  MapPin,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  Zap,
  FileText,
  BarChart3,
} from "lucide-react";

function CountUpNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = target;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="font-sora text-4xl md:text-5xl font-bold text-white">
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-navy">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy/50 to-navy" />

        {/* Ambient Glow */}
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[500px] w-[500px] rounded-full bg-accent-amber/5 blur-[120px]" />
        </div>
        <div className="absolute right-1/4 top-1/2">
          <div className="h-[300px] w-[300px] rounded-full bg-accent-blue/5 blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent-amber/20 bg-accent-amber/10 px-4 py-1.5"
          >
            <Zap className="h-3.5 w-3.5 text-accent-amber" />
            <span className="text-xs font-semibold tracking-wide text-accent-amber">
              AI-POWERED CIVIC TECHNOLOGY
            </span>
          </motion.div>

          {/* Title */}
          <h1 className="font-sora text-6xl font-bold leading-[1.1] tracking-tight text-white md:text-7xl lg:text-8xl">
            Nagar
            <span className="text-accent-amber">Netra</span>
          </h1>

          {/* Hindi */}
          <p className="mt-3 font-hindi text-lg text-gray-400 md:text-xl">
            नगर नेत्र — शहर की आँख
          </p>

          {/* Subtitle */}
          <p className="mt-6 font-sora text-lg font-medium text-gray-300 md:text-xl">
            India&apos;s First AI-Powered Civic Accountability Platform
          </p>

          {/* Tagline */}
          <p className="mt-3 max-w-2xl mx-auto text-sm text-gray-500 md:text-base">
            Every ward. Every contractor. Every pothole.{" "}
            <span className="text-white font-medium">Accountable.</span>
          </p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link href="/report" className="btn-primary text-base px-8 py-3.5">
              <Camera className="h-5 w-5" />
              Report a Pothole
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/dashboard" className="btn-secondary text-base px-8 py-3.5">
              <BarChart3 className="h-5 w-5" />
              View Dashboard
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 flex flex-col items-center gap-2 text-gray-600"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </motion.div>
      </section>

      {/* ═══ STATS SECTION ═══ */}
      <section className="relative border-y border-white/[0.06] bg-navy-100/50 py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 md:grid-cols-3">
          {[
            { number: 1247, label: "Reports Filed", suffix: "+" },
            { number: 892, label: "Potholes Repaired", suffix: "" },
            { number: 15600, label: "Lives Potentially Saved", suffix: "+" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <CountUpNumber target={stat.number} suffix={stat.suffix} />
              <span className="text-sm font-medium uppercase tracking-widest text-gray-500">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-amber mb-3">
              How It Works
            </p>
            <h2 className="font-sora text-3xl font-bold text-white md:text-4xl">
              Three Steps to Accountability
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: Camera,
                title: "1. Detect",
                desc: "Upload a photo. Our YOLOv8 AI instantly detects potholes, classifies severity (L1-L3), and generates a tamper-proof SHA-256 evidence hash.",
                accent: "amber",
              },
              {
                icon: FileText,
                title: "2. Report",
                desc: "Gemini AI auto-generates RTI-grade legal complaint letters with references to Motor Vehicles Act. Filed directly to the municipality.",
                accent: "blue",
              },
              {
                icon: ShieldCheck,
                title: "3. Verify",
                desc: "Contractors submit repair photos. AI verifies repairs are genuine. Accountability scores are public. No more fake fixes.",
                accent: "green",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="glass-card-hover p-8"
              >
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${
                    card.accent === "amber"
                      ? "bg-accent-amber/15 text-accent-amber"
                      : card.accent === "blue"
                      ? "bg-accent-blue/15 text-accent-blue"
                      : "bg-emerald-500/15 text-emerald-400"
                  }`}
                >
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="font-sora text-xl font-semibold text-white mb-3">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/[0.06] py-12 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-accent-amber" />
              <span className="font-sora text-lg font-bold">NagarNetra</span>
            </div>
            <p className="max-w-lg text-xs text-gray-600 leading-relaxed">
              NagarNetra is a civic technology initiative. This platform is not affiliated
              with any government body. Data is collected from citizens and verified by AI.
              For official municipal complaints, please contact your local ward office.
            </p>
            <p className="text-xs text-gray-700">
              © {new Date().getFullYear()} NagarNetra. Built for India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
