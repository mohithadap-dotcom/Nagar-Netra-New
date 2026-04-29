"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Camera,
  MapPin,
  Users,
  Search,
  ShieldCheck,
  LogOut,
  Eye,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/report", label: "Report", icon: Camera },
  { href: "/map", label: "Live Map", icon: MapPin },
  { href: "/contractors", label: "Contractors", icon: Users },
  { href: "/track", label: "Track", icon: Search },
  { href: "/verify", label: "Verify", icon: ShieldCheck },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 hidden lg:flex h-screen w-64 flex-col border-r border-white/[0.06] bg-navy-100/95 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-amber/20">
          <Eye className="h-5 w-5 text-accent-amber" />
        </div>
        <div>
          <h1 className="font-sora text-lg font-bold tracking-tight text-white">
            NagarNetra
          </h1>
          <p className="text-[10px] font-medium uppercase tracking-widest text-gray-500">
            नगर नेत्र
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
          Navigation
        </p>
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-accent-amber/10 text-accent-amber"
                  : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-accent-amber" />
              )}
              <Icon className={`h-[18px] w-[18px] ${isActive ? "text-accent-amber" : "text-gray-500 group-hover:text-gray-300"}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/[0.06] p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-500 transition-all duration-200 hover:bg-white/[0.04] hover:text-white"
        >
          <Eye className="h-[18px] w-[18px]" />
          Home
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-500 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </aside>
  );
}
