"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LayoutDashboard,
  Camera,
  MapPin,
  Users,
  Search,
  ShieldCheck,
  Eye,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/report", label: "Report", icon: Camera },
  { href: "/map", label: "Live Map", icon: MapPin },
  { href: "/contractors", label: "Contractors", icon: Users },
  { href: "/track", label: "Track", icon: Search },
  { href: "/verify", label: "Verify", icon: ShieldCheck },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-white/[0.06] bg-navy-100/95 backdrop-blur-xl px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-amber/20">
            <Eye className="h-4 w-4 text-accent-amber" />
          </div>
          <span className="font-sora text-base font-bold">NagarNetra</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-white/5"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-screen w-72 border-r border-white/[0.06] bg-navy-100 p-4 lg:hidden"
            >
              <div className="mb-6 flex items-center gap-3 px-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-amber/20">
                  <Eye className="h-5 w-5 text-accent-amber" />
                </div>
                <div>
                  <h1 className="font-sora text-lg font-bold">NagarNetra</h1>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500">
                    नगर नेत्र
                  </p>
                </div>
              </div>

              <nav className="space-y-1">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-accent-amber/10 text-accent-amber"
                          : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed mobile header */}
      <div className="h-14 lg:hidden" />
    </>
  );
}
