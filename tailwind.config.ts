import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A0F1E",
          50: "#1A2235",
          100: "#111827",
          200: "#1F2937",
          300: "#374151",
          400: "#4B5563",
        },
        accent: {
          amber: "#D97706",
          "amber-light": "#F59E0B",
          "amber-dark": "#B45309",
          blue: "#3B82F6",
          "blue-light": "#60A5FA",
          "blue-dark": "#2563EB",
        },
        severity: {
          l1: "#FBBF24",
          l2: "#F97316",
          l3: "#EF4444",
        },
        status: {
          reported: "#F97316",
          acknowledged: "#3B82F6",
          in_progress: "#8B5CF6",
          completed: "#10B981",
          verified: "#06D6A0",
        },
        success: "#10B981",
        danger: "#EF4444",
        warning: "#F59E0B",
      },
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        hindi: ["Noto Sans Devanagari", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "slide-in-right": "slideInRight 0.3s ease-out forwards",
        "slide-in-left": "slideInLeft 0.3s ease-out forwards",
        "pulse-marker": "pulseMarker 2s ease-in-out infinite",
        "count-up": "countUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out forwards",
        "shimmer": "shimmer 2s infinite linear",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseMarker: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.5)", opacity: "0.5" },
        },
        countUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(217, 119, 6, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(217, 119, 6, 0.4)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
