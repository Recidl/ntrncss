import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import SectionHeader from "../components/nontronics/SectionHeader";
import ServiceDetailCard from "../components/nontronics/ServiceDetailCard";
import GlassCard from "../components/nontronics/GlassCard";
import Marquee from "../components/nontronics/Marquee";

const REPAIR_SERVICES = [
  {
    title: "SCREEN REPLACEMENT",
    description: "Cracked, shattered, or unresponsive screens replaced with precision. We use high-quality OEM and aftermarket displays for phones, tablets, and laptops.",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80",
    features: [
      "iPhone & Android screen repairs",
      "iPad & tablet glass replacement",
      "Laptop display panel replacement",
      "OLED and LCD panel options",
      "Same-day service available",
    ],
  },
  {
    title: "BATTERY SERVICE",
    description: "Restore your device's battery life to like-new condition. We diagnose battery health and replace worn cells with premium components.",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80",
    features: [
      "Battery health diagnostics",
      "Phone & tablet battery replacement",
      "Laptop battery swaps",
      "Extended capacity options",
      "Battery calibration",
    ],
  },
  {
    title: "CHARGING PORT REPAIR",
    description: "Loose or broken charging ports fixed or replaced. No more wiggling cables or intermittent charging.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
    features: [
      "USB-C & Lightning port repair",
      "Micro-USB port replacement",
      "Laptop DC jack repair",
      "Wireless charging coil replacement",
      "Port cleaning & maintenance",
    ],
  },
  {
    title: "WATER DAMAGE RECOVERY",
    description: "Dropped your device in water? Time is critical. Our ultrasonic cleaning and micro-soldering techniques give your device the best chance of recovery.",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
    features: [
      "Ultrasonic board cleaning",
      "Corrosion removal & treatment",
      "Component-level diagnosis",
      "Data recovery attempts",
      "Preventative coating application",
    ],
  },
  {
    title: "DIAGNOSTICS & TROUBLESHOOTING",
    description: "Not sure what's wrong? Our comprehensive diagnostic service identifies the exact issue so you know your options before committing to a repair.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
    features: [
      "Full hardware diagnostics",
      "Software troubleshooting",
      "Performance analysis",
      "Detailed repair estimate",
      "No-fix, no-fee on diagnostics",
    ],
  },
];

export default function Repairs() {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 px-5 md:px-12 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: 0.35 }}
          />
          <div className="absolute inset-0" style={{ background: "var(--bg-overlay)" }} />
        </div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-primary/10 rounded-full blur-[120px]" />
        
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
            className="font-display text-5xl sm:text-7xl md:text-8xl tracking-tight text-foreground"
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
            <ServiceDetailCard key={service.title} {...service} index={i} />
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="relative px-6 md:px-12 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-secondary/40" />
        <div className="relative max-w-7xl mx-auto">
          <SectionHeader number="02" title="THE PROCESS" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { step: "01", title: "INTAKE", desc: "Drop off your device or describe the issue. We'll give you an initial assessment." },
              { step: "02", title: "DIAGNOSE", desc: "Full diagnostic to identify all issues and provide an accurate quote." },
              { step: "03", title: "REPAIR", desc: "Expert technicians perform the repair with quality parts and precision tools." },
              { step: "04", title: "DELIVER", desc: "Quality tested and returned to you, often same-day or next-day." },
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
          className="glass-panel-strong rounded-2xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div>
            <h2 className="font-display text-3xl md:text-4xl tracking-wide text-foreground mb-2">
              NEED A <span className="text-primary">REPAIR</span>?
            </h2>
            <p className="text-muted-foreground text-sm font-light">Get a free quote today — most repairs completed same-day.</p>
          </div>
          <Link
            to={createPageUrl("Contact")}
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground font-mono text-xs tracking-[0.15em] uppercase px-8 py-4 rounded-lg hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 shrink-0"
          >
            Get a Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}