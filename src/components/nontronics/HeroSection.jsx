import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useTheme } from "./ThemeContext";

export default function HeroSection() {
  const { dark } = useTheme();

  return (
    <section className="relative min-h-screen flex flex-col justify-end pb-12 md:pb-24 px-5 md:px-12 overflow-hidden">
      {/* Background image — more prominent */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=85"
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: dark ? 0.45 : 0.30 }}
        />
        {/* Gradient: heavy at bottom for text legibility, light at top to show image */}
        <div
          className="absolute inset-0"
          style={{
            background: dark
              ? "linear-gradient(to top, rgba(10,10,18,0.97) 0%, rgba(10,10,18,0.65) 45%, rgba(10,10,18,0.20) 100%)"
              : "linear-gradient(to top, rgba(238,238,244,0.97) 0%, rgba(238,238,244,0.60) 45%, rgba(238,238,244,0.15) 100%)",
          }}
        />
        <div className="absolute inset-0 grid-overlay" />
      </div>

      {/* Purple glow blobs */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/4 left-1/5 w-64 h-64 bg-primary/8 rounded-full blur-[100px]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center gap-4 mb-5"
        >
          <div className="w-8 h-px bg-primary" />
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-primary">
            Electronics Workshop
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mb-4"
        >
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69acca1bfb112d09d1f7b474/914300974_nontronics1.png"
            alt="Nontronics"
            className="h-14 md:h-20 w-auto logo-img"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="font-display text-5xl sm:text-7xl md:text-9xl lg:text-[9rem] leading-[0.9] tracking-tight text-foreground"
        >
          PRECISION<br />
          <span className="text-primary">ELECTRONICS</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between mt-8 md:mt-14 gap-6"
        >
          <p className="text-muted-foreground text-sm font-light leading-relaxed max-w-xs md:max-w-sm">
            Precision repairs, custom mods, and bespoke PC builds.
            Where technology meets craftsmanship.
          </p>

          <div className="flex flex-row md:flex-col items-center md:items-end gap-4">
            <Link
              to={createPageUrl("Contact")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-[11px] tracking-[0.12em] uppercase px-6 py-3 rounded-lg hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
            >
              Get a Quote
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to={createPageUrl("Repairs")}
              className="font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground border-b border-muted pb-0.5 hover:text-foreground hover:border-foreground transition-colors whitespace-nowrap"
            >
              View Services
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2"
      >
        <div className="w-px h-16 bg-gradient-to-b from-transparent to-muted-foreground/40" />
        <span className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground [writing-mode:vertical-rl] rotate-180 uppercase">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}