import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/nontronics/Navbar";
import Footer from "./components/nontronics/Footer";

const PAGE_TRANSITION_DURATION = 0.34;
const TRANSITION_BRAND_DURATION = 0.9;

const PAGE_TITLES = {
  home: "Nontronics LLC | Built with Precision.",
  repairs: "Nontronics LLC | Repairs",
  modifications: "Nontronics LLC | Modifications",
  custombuilds: "Nontronics LLC | Custom Builds",
  contact: "Nontronics LLC | Contact",
  resources: "Nontronics LLC | Resources",
};

export default function Layout({ children }) {
  const location = useLocation();

  useLayoutEffect(() => {
    // Reset scroll before paint so route transitions fade in from the top seamlessly.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  useEffect(() => {
    const routeKey = location.pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
    document.title = PAGE_TITLES[routeKey || "home"] || "Nontronics LLC | Built with Precision.";
  }, [location.pathname]);

  return (
    <div className="min-h-screen text-foreground bg-background">
      <div className="site-grid-overlay" aria-hidden="true" />
      <AnimatePresence>
        <motion.div
          key={`transition-brand-${location.pathname}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          exit={{ opacity: 0 }}
          transition={{
            duration: TRANSITION_BRAND_DURATION,
            times: [0, 0.16, 0.8, 1],
            ease: [0.22, 1, 0.36, 1],
          }}
          className="fixed inset-0 z-[1] pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_50%_45%,hsl(var(--primary)/0.09),transparent_60%)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/assets/nontronicsbwplog.png"
              alt=""
              className="logo-img w-[220px] md:w-[300px] opacity-30 mix-blend-soft-light"
              loading="eager"
            />
          </div>
        </motion.div>
      </AnimatePresence>
      <Navbar />
      <main className="bg-background">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
            transition={{ duration: PAGE_TRANSITION_DURATION, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-[2]"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}