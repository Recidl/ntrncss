import { motion } from "framer-motion";
import { ArrowRight, Cpu, Wrench, Monitor } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import HeroSection from "../components/nontronics/HeroSection";
import Marquee from "../components/nontronics/Marquee";
import ServiceCard from "../components/nontronics/ServiceCard";
import SectionHeader from "../components/nontronics/SectionHeader";
import StatsBar from "../components/nontronics/StatsBar";
import GlassCard from "../components/nontronics/GlassCard";

const SERVICES = [
  {
    title: "REPAIRS",
    description: "Screen replacements, battery swaps, charging port fixes, water damage recovery, and full diagnostics.",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80",
    tags: ["SCREENS", "BATTERIES", "DIAGNOSTICS"],
    link: "Repairs",
  },
  {
    title: "MODIFICATIONS",
    description: "Custom controller mods, console modifications, LED installations, and performance upgrades.",
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80",
    tags: ["CONTROLLERS", "CONSOLES", "LED MODS"],
    link: "Modifications",
  },
  {
    title: "CUSTOM BUILDS",
    description: "Bespoke gaming PCs, workstations, and server builds tailored to your exact specifications.",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
    tags: ["GAMING PCS", "WORKSTATIONS", "SERVERS"],
    link: "CustomBuilds",
  },
];

const WHY_ITEMS = [
  { icon: Wrench, title: "Precision Work", desc: "Every repair done with precision and quality parts." },
  { icon: Cpu, title: "Expert Knowledge", desc: "Deep understanding of modern electronics at the component level." },
  { icon: Monitor, title: "Custom Solutions", desc: "Tailored builds and mods designed for your exact needs." },
];

const FEATURED_JOBS = [
  {
    tag: "PS5 HDMI Recovery",
    outcome: "Signal Restored",
    detail: "Replaced damaged port, reinforced pads, passed 4-hour thermal and signal test.",
    turnaround: "48 Hours",
  },
  {
    tag: "Performance Build",
    outcome: "216 FPS Avg",
    detail: "Built and tuned for 1440p competitive play with controlled noise profile.",
    turnaround: "6 Days",
  },
  {
    tag: "Controller Drift Fix",
    outcome: "0 Deadzone Drift",
    detail: "Module swap + calibration profile with trigger response retune.",
    turnaround: "24 Hours",
  },
];

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Marquee />

      {/* Services Section */}
      <section className="px-6 md:px-12 py-24 md:py-32 max-w-7xl mx-auto">
        <SectionHeader
          number="01"
          title="SERVICES"
          subtitle="From precision repairs to full custom builds — we handle everything electronics."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 overflow-hidden">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} {...service} index={i} />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        <StatsBar />
      </section>

      {/* Why Section */}
      <section className="relative px-6 md:px-12 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-secondary/40" />

        <div className="relative max-w-7xl mx-auto">
          <SectionHeader
            number="02"
            title="WHY NONTRONICS"
            subtitle="The Nontronics Group is a new, yet already experienced team who understands what your devices mean to you."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {WHY_ITEMS.map((item, i) => (
              <GlassCard key={item.title}>
                <item.icon className="w-8 h-8 text-primary mb-6" />
                <h3 className="font-display text-2xl tracking-wide text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  {item.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Proof */}
      <section className="px-6 md:px-12 py-24 max-w-7xl mx-auto">
        <SectionHeader
          number="03"
          title="RECENT WINS"
          subtitle="Verified service outcomes from real jobs, tracked by turnaround and final QA result."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {FEATURED_JOBS.map((job, i) => (
            <motion.div
              key={job.tag}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-panel p-7"
            >
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-primary">{job.tag}</span>
              <h3 className="font-display text-3xl tracking-wide text-foreground mt-3">{job.outcome}</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed mt-3">{job.detail}</p>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">Turnaround</span>
                <span className="text-xs font-mono uppercase tracking-[0.16em] text-primary">{job.turnaround}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-12 py-24 md:py-32 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel-strong p-10 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-56 h-56 dark:bg-primary/5 bg-primary/15 blur-[80px]" />

          <div className="relative">
            <h2 className="font-display text-4xl md:text-6xl tracking-wide text-black dark:text-foreground mb-4">
              READY TO <span className="text-primary">START</span>?
            </h2>

            <p className="text-muted-foreground text-sm md:text-base font-light mb-10 max-w-md mx-auto">
              Whether it's a cracked screen, a custom controller, or a dream PC build — we've got you covered.
            </p>

            {/* Buttons */}
            <div className="flex justify-center items-center gap-12">
              <Link
                to={createPageUrl("Contact")}
                className="inline-flex items-center gap-3 bg-primary text-primary-foreground font-mono text-xs tracking-[0.15em] uppercase px-8 py-4 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200"
              >
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to={createPageUrl("Resources")}
                className="font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground border-b border-muted pb-0.5 hover:text-foreground hover:border-foreground transition-colors"
              >
                Shipping & Policies
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}