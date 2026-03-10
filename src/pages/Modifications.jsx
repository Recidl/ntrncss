import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import SectionHeader from "../components/nontronics/SectionHeader";
import ServiceDetailCard from "../components/nontronics/ServiceDetailCard";
import Marquee from "../components/nontronics/Marquee";

const MOD_SERVICES = [
  {
    value: "pc_modifications",
    title: "PC MODIFICATIONS",
    description: "Targeted desktop and laptop upgrades to improve thermals, speed, and reliability. We handle performance tuning, thermal paste replacement, storage upgrades, and hardware optimization.",
    image: "https://images.unsplash.com/photo-1555618254-84e2cf498b01?q=80&w=1171",
    features: [
      "Thermal paste & replacement",
      "RAM/storage upgrades",
      "Cooling/airflow improvements",
      "Power & performance tuning",
      "System cleanup & optimization",
    ],
  },
  {
    value: "controller_modifications",
    title: "CONTROLLER MODIFICATIONS",
    description: "Take your gameplay to the next level with custom controller mods. From rapid-fire triggers to custom button remapping — we build controllers that match your playstyle.",
    image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&q=80",
    features: [
      "Rapid-fire & burst-fire triggers",
      "Custom button remapping",
      "Adjustable trigger stops",
      "Enhanced thumbstick grips",
      "Back paddle/button additions",
    ],
  },
  {
    value: "console_modifications",
    title: "CONSOLE MODIFICATIONS",
    description: "Unlock your console's full potential. Custom firmware, thermal improvements, storage upgrades, and performance tweaks for all major platforms.",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80",
    features: [
      "SSD/storage upgrades",
      "Thermal paste & pad replacement",
      "Fan upgrades for quieter operation",
      "HDMI port replacement",
      "Disc drive repair & replacement",
    ],
  },
  {
    value: "custom_shells_aesthetics",
    title: "CUSTOM SHELLS & AESTHETICS",
    description: "Make your hardware uniquely yours. Custom painted shells, transparent housings, LED integrations, and vinyl wraps that turn heads.",
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80",
    features: [
      "Custom painted controller shells",
      "Transparent/clear housing swaps",
      "Chrome & metallic finishes",
      "Custom vinyl wraps",
      "Laser-engraved designs",
    ],
  },
  {
    value: "led_modifications",
    title: "LED MODIFICATIONS",
    description: "Illuminate your setup with custom LED integrations. Programmable RGB lighting for controllers, consoles, and peripherals.",
    image: "https://images.unsplash.com/photo-1632749042303-7f7a18ed6ff0?q=80&w=1170",
    features: [
      "RGB LED button lighting",
      "Under-glow LED strips",
      "Custom color configurations",
      "Reactive lighting effects",
      "Console LED accent lighting",
    ],
  },
];

const MOD_SHOWCASE = [
  { name: "DualSense Trigger Package", gain: "Adaptive trigger remap + tactile stop tuning" },
  { name: "Xbox Shell + LED Conversion", gain: "Custom shell swap with reactive underglow" },
  { name: "PC Thermal/Flow Upgrade", gain: "Lowered load temps and reduced fan noise" },
];

export default function Modifications() {
  const navigate = useNavigate();

  const handleSelectService = (category) => {
    const params = new URLSearchParams({
      service: "modifications",
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
            src="https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=1920&q=80"
            alt="Gaming controller modification"
            className="w-full h-full object-cover opacity-50 dark:opacity-[0.35]"
            loading="eager"
          />
          <div className="absolute inset-0" style={{ background: "var(--bg-overlay)" }} />
          <div className="absolute inset-0 grid-overlay" />
        </div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary/10 blur-[120px]" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-8 h-px bg-primary" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-primary">Service / Modifications</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl sm:text-7xl md:text-8xl tracking-tight text-black dark:text-foreground"
          >
            CUSTOM <span className="text-primary">MODS</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-muted-foreground text-sm md:text-base font-light leading-relaxed max-w-lg"
          >
            Elevate your gaming hardware with custom modifications, unique aesthetics, and performance upgrades.
          </motion.p>
        </div>
      </section>

      <Marquee />

      {/* Services */}
      <section className="px-6 md:px-12 py-24 md:py-32 max-w-7xl mx-auto">
        <SectionHeader
          number="01"
          title="MODIFICATION SERVICES"
          subtitle="Every mod is crafted with attention to detail and built to last."
        />
        <div className="space-y-6 md:space-y-8">
          {MOD_SERVICES.map((service, i) => (
            <ServiceDetailCard
              key={service.title}
              {...service}
              serviceLabel="Modifications"
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
          title="FEATURED MOD PACKAGES"
          subtitle="High-demand customizations requested most by repeat clients."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {MOD_SHOWCASE.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-panel p-6"
            >
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-primary">{item.name}</p>
              <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed">{item.gain}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery-style showcase */}
      <section className="relative px-6 md:px-12 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-secondary/40" />
        <div className="relative max-w-7xl mx-auto">
          <SectionHeader number="03" title="THE CRAFT" subtitle="A look at what goes into every modification." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { img: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80", label: "PRECISION SOLDERING" },
              { img: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&q=80", label: "CUSTOM AESTHETICS" },
              { img: "https://images.unsplash.com/photo-1632749042303-7f7a18ed6ff0?q=80&w=1170", label: "LED INTEGRATION" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative h-64 md:h-80 overflow-hidden group"
              >
                <img src={item.img} alt={item.label} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary">{item.label}</span>
                </div>
              </motion.div>
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
              READY TO <span className="text-primary">MOD</span>?
            </h2>
            <p className="text-muted-foreground text-sm font-light">Tell us what you're looking for — we'll make it happen.</p>
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