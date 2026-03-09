import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Wrench, Settings, Cpu, Package, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import SectionHeader from "../components/nontronics/SectionHeader";
import GlassCard from "../components/nontronics/GlassCard";
import Marquee from "../components/nontronics/Marquee";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = [
  {
    id: "repairs",
    label: "Repairs",
    icon: Wrench,
  },
  {
    id: "modding",
    label: "Modding",
    icon: Settings,
  },
  {
    id: "builds",
    label: "Builds",
    icon: Cpu,
  },
];

export default function Resources() {
  const [activeTab, setActiveTab] = useState("repairs");

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 px-5 md:px-12 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80"
            alt="Shipping and logistics"
            className="w-full h-full object-cover opacity-50 dark:opacity-[0.35]"
            loading="eager"
          />
          <div className="absolute inset-0" style={{ background: "var(--bg-overlay)" }} />
        </div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-primary/10 blur-[120px]" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-8 h-px bg-primary" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-primary">Resources</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl sm:text-7xl md:text-8xl tracking-tight text-foreground"
          >
            SHIPPING & <span className="text-primary">HANDLING</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-muted-foreground text-sm md:text-base font-light leading-relaxed max-w-lg"
          >
            How we handle repairs, mods, and builds — payment, turnaround times, and shipping.
          </motion.p>
        </div>
      </section>

      <Marquee />

      {/* Main tabs section */}
      <section className="px-6 md:px-12 py-24 md:py-32 max-w-7xl mx-auto">
        <SectionHeader
          number="01"
          title="SERVICE POLICIES"
          subtitle="What to expect for each type of service we offer."
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-12">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-16 h-14 p-1.5 bg-muted/30 border border-border">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="font-mono text-xs sm:text-sm tracking-[0.15em] uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all py-3 px-4"
              >
                <tab.icon className="w-4 h-4 mr-2 shrink-0" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="repairs" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <GlassCard className="p-8 md:p-12 md:min-w-0">
                <div className="flex flex-col sm:flex-row items-start gap-6 md:gap-8">
                  <div className="w-14 h-14 bg-primary/10 flex items-center justify-center shrink-0">
                    <Wrench className="w-6 h-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-xl md:text-2xl lg:text-3xl tracking-wide text-foreground mb-5 md:mb-6">
                      REPAIRS — PAYMENT & TIMELINE
                    </h3>
                    <div className="space-y-4 text-muted-foreground text-sm md:text-base font-light leading-relaxed">
                      <p>
                        <span className="text-foreground font-medium">No payment is required upon arrival.</span> Payment is due at device release upon completion of the repair.
                      </p>
                      <p>
                        Pricing is discussed when you contact us — we provide a quote before any work begins.
                      </p>
                      <p>
                        <span className="text-foreground font-medium">Turnaround time</span> typically ranges from <span className="text-primary">a week or less</span> to more, depending on:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Repair intensity and complexity</li>
                        <li>Your location (local vs. mail-in)</li>
                        <li>Part availability</li>
                      </ul>
                      <p>
                        In rare cases, we can offer a <span className="text-primary font-medium">24–48 hour turnaround</span> for simple issues. Ask us when you reach out.
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="relative h-48 md:h-52 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&q=80"
                    alt="Device diagnostics"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.2em] uppercase text-white">
                    Diagnostics
                  </span>
                </div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://valkyrie.cdn.ifixit.com/media/2024/09/26144123/iPhone16layout_3x2.jpg"
                    alt="Repair workspace"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.2em] uppercase text-white">
                    Precision Repair
                  </span>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="modding" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <GlassCard className="p-8 md:p-12 md:min-w-0">
                <div className="flex flex-col sm:flex-row items-start gap-6 md:gap-8">
                  <div className="w-14 h-14 bg-primary/10 flex items-center justify-center shrink-0">
                    <Settings className="w-6 h-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-xl md:text-2xl lg:text-3xl tracking-wide text-foreground mb-5 md:mb-6">
                      MODDING — PAYMENT & TIMELINE
                    </h3>
                    <div className="space-y-4 text-muted-foreground text-sm md:text-base font-light leading-relaxed">
                      <p>
                        <span className="text-foreground font-medium">No payment is required upon arrival.</span> Payment is due at device release when your modification is complete.
                      </p>
                      <p>
                        <span className="text-foreground font-medium">Turnaround time</span> is typically <span className="text-primary">around a week or less to more</span>, depending on:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Part availability</li>
                        <li>Custom or special-order components</li>
                        <li>Complexity of requested modifications</li>
                      </ul>
                      <p>
                        Custom requests may extend the timeline — we'll give you an estimate when you contact us.
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="relative h-48 md:h-52 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&q=80"
                    alt="Controller modification"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.2em] uppercase text-white">
                    Custom Shells
                  </span>
                </div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1632749042303-7f7a18ed6ff0?q=80&w=1170"
                    alt="LED modding"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.2em] uppercase text-white">
                    LED Integration
                  </span>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="builds" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <GlassCard className="p-8 md:p-12 md:min-w-0">
                <div className="flex flex-col sm:flex-row items-start gap-6 md:gap-8">
                  <div className="w-14 h-14 bg-primary/10 flex items-center justify-center shrink-0">
                    <Cpu className="w-6 h-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-xl md:text-2xl lg:text-3xl tracking-wide text-foreground mb-5 md:mb-6">
                      BUILDS — PAYMENT & TIMELINE
                    </h3>
                    <div className="space-y-4 text-muted-foreground text-sm md:text-base font-light leading-relaxed">
                      <p>
                        <span className="text-foreground font-medium">A 70% deposit</span> is required before we order parts for your build.
                      </p>
                      <p>
                        <span className="text-foreground font-medium">Turnaround time</span> is typically <span className="text-primary">around a week or less to more</span>, depending on part availability and build complexity.
                      </p>
                      <p>
                        <span className="text-foreground font-medium">Full payment is completed before handoff.</span> The remaining balance is due when your build is ready for pickup or shipping.
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="relative h-48 md:h-52 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80"
                    alt="Custom PC build"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.2em] uppercase text-white">
                    Gaming Builds
                  </span>
                </div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1567619363836-e5fd63f69b20?q=80&w=1176"
                    alt="Workstation"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.2em] uppercase text-white">
                    Workstations
                  </span>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Shipping providers section */}
      <section className="relative px-6 md:px-12 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-secondary/40" />
        <div className="relative max-w-7xl mx-auto">
          <SectionHeader
            number="02"
            title="SHIPPING PROVIDERS"
            subtitle="Shipped directly from Aurora, IL. All products and repairs are boxed and shipped with care. In most cases, shipping costs are covered."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <GlassCard className="p-8 md:p-12 flex flex-col items-start gap-4">
              <span className="font-mono text-lg md:text-2xl tracking-[0.22em] uppercase text-primary">USPS</span>
              <p className="text-muted-foreground text-sm md:text-base font-light leading-relaxed">
                United States Postal Service - reliable mail-in and return shipping for repairs and mods.
              </p>
            </GlassCard>
            <GlassCard className="p-8 md:p-12 flex flex-col items-start gap-4">
              <span className="font-mono text-lg md:text-2xl tracking-[0.22em] uppercase text-primary">FEDEX</span>
              <p className="text-muted-foreground text-sm md:text-base font-light leading-relaxed">
                FedEx - expedited options for larger items and custom builds.
              </p>
            </GlassCard>
          </div>
          <div className="mt-12 text-center">
            <p className="text-muted-foreground text-sm font-light">
              A tracking code or link will be provided so you can follow your order every step of the way.
            </p>
            <Package className="w-10 h-10 text-primary/60 mx-auto mt-4" />
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="px-6 md:px-12 py-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel-strong p-10 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-primary/5 blur-[80px]" />
          <div className="relative">
            <Mail className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl tracking-wide text-foreground mb-4">
              HAVE <span className="text-primary">QUESTIONS</span>?
            </h2>
            <p className="text-muted-foreground text-sm md:text-base font-light mb-10 max-w-md mx-auto">
              Contact us for quotes, turnaround estimates, or any questions about shipping and handling.
            </p>
            <Link
              to={createPageUrl("Contact")}
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground font-mono text-xs tracking-[0.15em] uppercase px-8 py-4 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200"
            >
              Get in Touch
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
