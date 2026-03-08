import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeContext";

const NAV_ITEMS = [
  { label: "Home", page: "Home" },
  { label: "Repairs", page: "Repairs" },
  { label: "Mods", page: "Modifications" },
  { label: "Builds", page: "CustomBuilds" },
  { label: "Contact", page: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { dark, setDark } = useTheme();

  const isActive = (page) => location.pathname === createPageUrl(page);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "var(--glass-strong-bg)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            borderBottom: "1px solid var(--glass-strong-border)",
          }}
        />
        <div className="relative flex items-center justify-between px-5 md:px-12 py-3.5">
          {/* Logo */}
          <Link to={createPageUrl("Home")} className="z-10 flex items-center">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69acca1bfb112d09d1f7b474/914300974_nontronics1.png"
              alt="Nontronics"
              className="h-8 w-auto logo-img"
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.page}>
                <Link
                  to={createPageUrl(item.page)}
                  className={`font-mono text-[11px] tracking-[0.18em] uppercase transition-colors ${
                    isActive(item.page)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {isActive(item.page) && (
                    <div className="w-full h-px bg-primary mt-1" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side: theme toggle + mobile hamburger */}
          <div className="flex items-center gap-3">
            {/* Subtle theme toggle */}
            <button
              onClick={() => setDark(!dark)}
              aria-label="Toggle theme"
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-foreground w-8 h-8 flex items-center justify-center"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-in drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            />

            {/* Drawer — slides from right, partial width */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-64 md:hidden flex flex-col pt-20 pb-8 px-6"
              style={{
                background: "var(--glass-strong-bg)",
                backdropFilter: "blur(50px)",
                WebkitBackdropFilter: "blur(50px)",
                borderLeft: "1px solid var(--glass-strong-border)",
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <ul className="space-y-1 flex-1">
                {NAV_ITEMS.map((item, i) => (
                  <motion.li
                    key={item.page}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={createPageUrl(item.page)}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 py-3 px-3 rounded-lg font-mono text-sm tracking-[0.1em] uppercase transition-colors ${
                        isActive(item.page)
                          ? "text-primary bg-primary/8"
                          : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      {isActive(item.page) && (
                        <div className="w-1 h-1 rounded-full bg-primary" />
                      )}
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* Theme toggle at bottom of drawer */}
              <button
                onClick={() => setDark(!dark)}
                className="flex items-center gap-3 py-3 px-3 rounded-lg text-muted-foreground hover:text-foreground font-mono text-xs tracking-[0.1em] uppercase transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              >
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {dark ? "Light Mode" : "Dark Mode"}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}