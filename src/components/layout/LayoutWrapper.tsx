"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { AnimatePresence, motion } from "framer-motion";

const NO_SIDEBAR_ROUTES = ["/", "/login", "/signup"];

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = !NO_SIDEBAR_ROUTES.includes(pathname);

  return (
    <div className="flex min-h-screen">
      {showSidebar && (
        <>
          <Sidebar />
          <MobileNav />
        </>
      )}
      <main
        className={`flex-1 min-h-screen ${showSidebar ? "lg:ml-64" : ""}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="min-h-screen"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
