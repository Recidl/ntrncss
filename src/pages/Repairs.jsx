import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import SectionHeader from "../components/nontronics/SectionHeader";
import ServiceDetailCard from "../components/nontronics/ServiceDetailCard";
import GlassCard from "../components/nontronics/GlassCard";
import Marquee from "../components/nontronics/Marquee";

const REPAIR_SERVICES = [
  {
    value: "general_damage",
    title: "GENERAL DAMAGE",
    description: "Comprehensive repair for everyday damage not covered by a specific category. We diagnose and replace broken parts, restore functionality, and reinforce weak points before they fail again.",
    image: "https://img.global.news.samsung.com/global/wp-content/uploads/2023/12/Self-Repair-Program-Expansion_main1.jpg",
    features: [
      "Broken button & housing repair",
      "Internal part replacement",
      "Connector & bracket fixes",
      "Frame & body damage restoration",
      "General fault diagnosis & repair",
    ],
  },
  {
    value: "screen_replacement",
    title: "SCREEN REPLACEMENT",
    description: "Cracked, shattered, or unresponsive screens replaced with precision. We use high-quality OEM and aftermarket displays for phones, tablets, and laptops.",
    image: "https://images.unsplash.com/photo-1583413230540-ddf9068c9d2d?q=80&w=687",
    features: [
      "iPhone & Android screen repairs",
      "iPad & tablet glass replacement",
      "Laptop display panel replacement",
      "OLED & LCD panel options",
      "Rapid service available",
    ],
  },
  {
    value: "battery_service",
    title: "BATTERY SERVICE",
    description: "Restore your device's battery life to like-new condition. We diagnose battery health and replace worn cells with premium components.",
    image: "https://images.unsplash.com/photo-1512439408685-2e399291a4e6?q=80&w=1095",
    features: [
      "Battery health diagnostics",
      "Phone & tablet battery replacement",
      "Laptop battery swaps",
      "Extended capacity options",
      "Battery calibration",
    ],
  },
  {
    value: "controller_repair",
    title: "CONTROLLER REPAIR",
    description: "Fix worn or faulty controllers with precision component-level repair. We resolve stick drift, unresponsive buttons, charging faults, and connection issues across major platforms.",
    image: "https://images.unsplash.com/photo-1585857188849-f44983e4a509?q=80&w=1170",
    features: [
      "Stick drift diagnosis & repair",
      "Thumbstick module replacement",
      "Button & trigger restoration",
      "Charging & battery connector fixes",
      "Bluetooth & pairing issue repair",
    ],
  },
  {
    value: "firmware_recovery_repair",
    title: "FIRMWARE RECOVERY & REPAIR",
    description: "OS and firmware issues fixed end-to-end. We recover failed updates, remove malware, resolve persistent bugs, and restore stability for any device with an operating system.",
    image: "https://www.zdnet.com/a/img/resize/681bcdc58703a8091ba94dc0574543ad7c1e255f/2025/06/27/789ea75a-8444-49c6-a946-bbf99432df67/gettyimages-2162022885.jpg?auto=webp&width=1280",
    features: [
      "Firmware & OS recovery",
      "Boot loop & startup failure repair",
      "Virus & malware cleanup",
      "System bug & slowdown fixes",
      "Apple restore & update recovery",
    ],
  },
  {
    value: "diagnostics_troubleshooting",
    title: "DIAGNOSTICS & TROUBLESHOOTING",
    description: "Not sure what's wrong? Our comprehensive diagnostic service identifies the exact issue so you know your options before committing to a repair.",
    image: "https://static0.howtogeekimages.com/wordpress/wp-content/uploads/2016/05/IMG_8461-1-650x300.jpg?w=1200&h=628&fit=crop",
    features: [
      "Full hardware diagnostics",
      "Software troubleshooting",
      "Performance analysis",
      "Detailed repair estimate",
      "No-fix, no-fee on diagnostics",
    ],
  },
];

const REPAIR_OUTCOMES = [
  { label: "Water-Damage Phone", result: "Data recovered and board stabilized", time: "3 days" },
  { label: "Laptop No Boot", result: "Power rail fault repaired and tested", time: "2 days" },
  { label: "Controller Drift", result: "Module replacement and calibration", time: "1 day" },
];

export default function Repairs() {
  const navigate = useNavigate();

  const handleSelectService = (category) => {
    const params = new URLSearchParams({
      service: "repairs",
      category,
      from: "service-card",
    });
    navigate(`${createPageUrl("Contact")}?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 px-5 md:px-12 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=1920&q=80"
            alt="Electronics repair workspace"
            className="w-full h-full object-cover opacity-50 dark:opacity-[0.35]"
            loading="eager"
          />
          <div className="absolute inset-0" style={{ background: "var(--bg-overlay)" }} />
          <div className="absolute inset-0 grid-overlay" />
        </div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-primary/10 blur-[120px]" />
        
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-8 h-px bg-primary" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-primary">Service / Repairs</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl sm:text-7xl md:text-8xl tracking-tight text-black dark:text-foreground"
          >
            DEVICE <span className="text-primary">REPAIRS</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-muted-foreground text-sm md:text-base font-light leading-relaxed max-w-lg"
          >
            From cracked screens to water damage — we bring your devices back to life with precision and care.
          </motion.p>
        </div>
      </section>

      <Marquee />

      {/* Services */}
      <section className="px-6 md:px-12 py-24 md:py-32 max-w-7xl mx-auto">
        <SectionHeader
          number="01"
          title="REPAIR SERVICES"
          subtitle="Every repair is performed with professional-grade tools and quality parts."
        />
        <div className="space-y-6 md:space-y-8">
          {REPAIR_SERVICES.map((service, i) => (
            <ServiceDetailCard
              key={service.title}
              {...service}
              serviceLabel="Repairs"
              categoryLabel={service.title}
              index={i}
              onSelect={() => handleSelectService(service.value)}
            />
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        <SectionHeader
          number="02"
          title="RECENT OUTCOMES"
          subtitle="Transparent results from recent intake-to-delivery repair jobs."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {REPAIR_OUTCOMES.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-panel p-6"
            >
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-primary">{item.label}</p>
              <p className="mt-3 text-sm text-foreground font-light leading-relaxed">{item.result}</p>
              <p className="mt-4 text-xs text-muted-foreground uppercase tracking-[0.14em]">Turnaround: {item.time}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="relative px-6 md:px-12 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-secondary/40" />
        <div className="relative max-w-7xl mx-auto">
          <SectionHeader number="03" title="THE PROCESS" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { step: "01", title: "INTAKE", desc: "Drop off your device or describe the issue. We'll give you an initial assessment." },
              { step: "02", title: "DIAGNOSE", desc: "Full diagnostic to identify all issues and provide an accurate quote." },
              { step: "03", title: "REPAIR", desc: "Expert technicians perform the repair with quality parts and precision tools." },
              { step: "04", title: "DELIVER", desc: "Quality tested and returned to you, often within the same week." },
            ].map((item, i) => (
              <GlassCard key={item.step}>
                <span className="font-mono text-xs text-primary tracking-wider">{item.step}</span>
                <h3 className="font-display text-2xl tracking-wide text-foreground mt-4 mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
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
            <h2 className="font-display text-3xl md:text-4xl tracking-wide text-black dark:text-foreground mb-2">
              NEED A <span className="text-primary">REPAIR</span>?
            </h2>
            <p className="text-muted-foreground text-sm font-light">Get a free quote today — most repairs completed the same week.</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Link
              to={createPageUrl("Contact")}
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground font-mono text-xs tracking-[0.15em] uppercase px-8 py-4 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 shrink-0"
            >
              Get a Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={createPageUrl("Resources")}
              className="font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground border-b border-muted pb-0.5 hover:text-foreground hover:border-foreground transition-colors"
            >
              Shipping & turnaround info
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}