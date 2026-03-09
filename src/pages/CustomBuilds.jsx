import { motion } from "framer-motion";
import { ArrowRight, Cpu, Monitor, HardDrive } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import SectionHeader from "../components/nontronics/SectionHeader";
import ServiceDetailCard from "../components/nontronics/ServiceDetailCard";
import GlassCard from "../components/nontronics/GlassCard";
import Marquee from "../components/nontronics/Marquee";

const BUILD_SERVICES = [
  {
    title: "GAMING PC BUILDS",
    description: "High-performance gaming rigs built to dominate. From 1080p esports machines to 4K ultra-wide powerhouses — we spec and assemble PCs that deliver frames where it matters.",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
    features: [
      "Custom component selection & sourcing",
      "Cable management & clean builds",
      "Custom RGB lighting configurations",
      "Overclocking & performance tuning",
      "Stress testing & burn-in benchmarks",
    ],
  },
  {
    title: "WORKSTATION BUILDS",
    description: "Professional workstations for content creators, developers, and engineers. Multi-threaded performance, ECC memory options, and reliability-focused builds.",
    image: "https://images.unsplash.com/photo-1600614518987-f9c081f69e0e?q=80&w=1170",
    features: [
      "Multi-core CPU configurations",
      "High-capacity RAM options (64GB+)",
      "NVMe storage arrays",
      "Professional GPU options (Quadro/Pro)",
      "Quiet cooling solutions",
    ],
  },
  {
    title: "COMPACT & ITX BUILDS",
    description: "Maximum power in minimal space. Small form factor builds that don't compromise on performance. Perfect for desk setups and LAN parties.",
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80",
    features: [
      "Mini-ITX & Micro-ATX builds",
      "Optimized airflow designs",
      "Custom loop cooling options",
      "Portable LAN party builds",
      "Console-killer form factors",
    ],
  },
];

const TIERS = [
  {
    name: "STARTER",
    tier: "Entry Gaming",
    specs: ["AMD Ryzen 5 / Intel i5", "16GB DDR5", "RTX 5/4060 / RX 7600", "500GB NVMe SSD"],
    icon: HardDrive,
  },
  {
    name: "PERFORMANCE",
    tier: "Enthusiast",
    specs: ["AMD Ryzen 7 / Intel i7", "32GB DDR5", "RTX 4/5070+ Ti / RX 7800 XT", "1TB NVMe SSD"],
    icon: Cpu,
    featured: true,
  },
  {
    name: "ULTIMATE",
    tier: "No Compromise",
    specs: ["AMD Ryzen 9 / Intel i9", "64GB DDR5", "RTX 4/5090 / RX 7900 XTX", "2TB NVMe SSD"],
    icon: Monitor,
  },
];

export default function CustomBuilds() {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 px-5 md:px-12 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1920&q=80"
            alt="Custom PC build"
            className="w-full h-full object-cover opacity-50 dark:opacity-[0.35]"
            loading="eager"
          />
          <div className="absolute inset-0" style={{ background: "var(--bg-overlay)" }} />
        </div>
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-primary/10 blur-[120px]" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-8 h-px bg-primary" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-primary">Service / Custom Builds</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl sm:text-7xl md:text-8xl tracking-tight text-foreground"
          >
            CUSTOM <span className="text-primary">BUILDS</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-muted-foreground text-sm md:text-base font-light leading-relaxed max-w-lg"
          >
            Custom PC builds tailored to your exact needs. From competitive gaming to professional workstations — built with precision.
          </motion.p>
        </div>
      </section>

      <Marquee />

      {/* Build types */}
      <section className="px-6 md:px-12 py-24 md:py-32 max-w-7xl mx-auto">
        <SectionHeader
          number="01"
          title="BUILD TYPES"
          subtitle="Whether it's raw gaming power or professional reliability — we build it right."
        />
        <div className="space-y-6 md:space-y-8">
          {BUILD_SERVICES.map((service, i) => (
            <ServiceDetailCard key={service.title} {...service} index={i} />
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section className="relative px-6 md:px-12 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-secondary/40" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/3 blur-[150px]" />
        
        <div className="relative max-w-7xl mx-auto">
          <SectionHeader
            number="02"
            title="BUILD TIERS"
            subtitle="Starting configurations — all fully customizable to your needs and budget."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 md:p-10 ${
                  tier.featured
                    ? "glass-panel-strong border-primary/30 accent-glow"
                    : "glass-panel"
                }`}
              >
                <tier.icon className={`w-8 h-8 mb-6 ${tier.featured ? "text-primary" : "text-muted-foreground"}`} />
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{tier.tier}</span>
                <h3 className="font-display text-3xl tracking-wide text-foreground mt-2 mb-6">{tier.name}</h3>
                <ul className="space-y-3">
                  {tier.specs.map((spec) => (
                    <li key={spec} className="text-sm text-muted-foreground font-light flex items-center gap-2">
                      <div className="w-1 h-1 bg-primary" />
                      {spec}
                    </li>
                  ))}
                </ul>
                {tier.featured && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary">Most Popular</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="px-6 md:px-12 py-24 md:py-32 max-w-7xl mx-auto">
        <SectionHeader number="03" title="BUILD PROCESS" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: "01", title: "CONSULT", desc: "We discuss your use case, budget, and preferences to define the perfect build." },
            { step: "02", title: "SPEC", desc: "We select and source the best components for your build, optimized for value and performance." },
            { step: "03", title: "BUILD", desc: "Expert assembly with proper cable management, thermal optimization, and clean aesthetics." },
            { step: "04", title: "TEST", desc: "Full stress testing, benchmarking, and burn-in to ensure stability before handoff." },
          ].map((item, i) => (
            <GlassCard key={item.step}>
              <span className="font-mono text-xs text-primary tracking-wider">{item.step}</span>
              <h3 className="font-display text-2xl tracking-wide text-foreground mt-4 mb-3">{item.title}</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel-strong p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div>
            <h2 className="font-display text-3xl md:text-4xl tracking-wide text-foreground mb-2">
              LET'S <span className="text-primary">BUILD</span>
            </h2>
            <p className="text-muted-foreground text-sm font-light">Tell us about your dream build — we'll make it reality.</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Link
              to={createPageUrl("Contact")}
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground font-mono text-xs tracking-[0.15em] uppercase px-8 py-4 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 shrink-0"
            >
              Start Your Build <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={createPageUrl("Resources")}
              className="font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground border-b border-muted pb-0.5 hover:text-foreground hover:border-foreground transition-colors"
            >
              Deposit & shipping info
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}