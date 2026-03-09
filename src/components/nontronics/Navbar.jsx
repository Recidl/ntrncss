import { useEffect, useState } from "react";
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
  { label: "Resources", page: "Resources" },
  { label: "Contact", page: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const location = useLocation();
  const { dark, setDark } = useTheme();

  const isActive = (page) => location.pathname === createPageUrl(page);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isOnline
              ? "var(--glass-strong-bg)"
              : dark
                ? "rgba(127, 29, 29, 0.72)"
                : "rgba(254, 226, 226, 0.9)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            borderBottom: isOnline
              ? "1px solid var(--glass-strong-border)"
              : dark
                ? "1px solid rgba(220, 38, 38, 0.55)"
                : "1px solid rgba(248, 113, 113, 0.65)",
          }}
        />
        <div className="relative flex items-center justify-between px-5 md:px-12 py-3.5">
          {/* Logo */}
          <Link to={createPageUrl("Home")} className="z-10 flex items-center">
            <img
              src="/assets/nontronicslog.png"
              alt="Nontronics"
              className="h-8 w-auto logo-img"
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.page);
              return (
                <li key={item.page}>
                  <Link
                    to={createPageUrl(item.page)}
                    className={`flex flex-col items-center font-mono text-[11px] tracking-[0.18em] uppercase transition-colors duration-300 ${
                      active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span
                      className={`block transition-transform duration-300 ease-out ${
                        active ? "-translate-y-0.5" : "translate-y-0"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`block w-full h-px bg-primary mt-1.5 transition-all duration-300 ease-out ${
                        active ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right side: theme toggle + mobile hamburger */}
          <div className="flex items-center gap-1">
            {/* Subtle theme toggle — 44px min touch target on mobile */}
            <button
              onClick={() => setDark(!dark)}
              aria-label="Toggle theme"
              className="min-w-[44px] min-h-[44px] w-8 h-8 md:w-8 md:h-8 md:min-w-0 md:min-h-0 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors hover:bg-black/5 dark:hover:bg-white/5 -my-1 rounded-full"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile hamburger — 44px min touch target for easy tapping */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
              className="md:hidden text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center -my-1 -mr-1 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <Menu className="w-5 h-5 shrink-0" />
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
              className="fixed inset-0 z-40 dark:bg-black/30 bg-black/10 backdrop-blur-sm md:hidden"
            />

            {/* Drawer — slides from right, partial width */}
            <motion.div
              id="mobile-nav-drawer"
              role="dialog"
              aria-label="Navigation menu"
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
              {/* Close button — 44px min touch target */}
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors hover:bg-black/5 dark:hover:bg-white/5"
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
                      className={`flex items-center gap-3 py-3 px-3 font-mono text-sm tracking-[0.1em] uppercase transition-colors ${
                        isActive(item.page)
                          ? "text-primary bg-primary/8"
                          : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      {isActive(item.page) && (
                        <div className="w-1 h-1 bg-primary" />
                      )}
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* Theme toggle at bottom of drawer */}
              <button
                onClick={() => setDark(!dark)}
                className="flex items-center gap-3 py-3 px-3 text-muted-foreground hover:text-foreground font-mono text-xs tracking-[0.1em] uppercase transition-colors hover:bg-black/5 dark:hover:bg-white/5"
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