import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Mail, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import GlassCard from "../components/nontronics/GlassCard";
import SectionHeader from "../components/nontronics/SectionHeader";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactInfo = [
    { icon: Mail, label: "EMAIL", value: "hello@nontronics.tech" },
    { icon: MapPin, label: "LOCATION", value: "Available for local & mail-in" },
    { icon: Clock, label: "HOURS", value: "Mon — Sat, 10am — 7pm" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 px-5 md:px-12 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: 0.30 }}
          />
          <div className="absolute inset-0" style={{ background: "var(--bg-overlay)" }} />
        </div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-primary/8 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-8 h-px bg-primary" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-primary">Get in Touch</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl sm:text-7xl md:text-8xl tracking-tight text-foreground"
          >
            CONTACT <span className="text-primary">US</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-muted-foreground text-sm md:text-base font-light leading-relaxed max-w-lg"
          >
            Have a project in mind? Need a quote? Drop us a message and we'll get back to you.
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="px-6 md:px-12 py-16 md:py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-panel-strong rounded-lg p-8 md:p-12"
            >
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Your name"
                        className="bg-background/50 border-border h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Email</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your@email.com"
                        className="bg-background/50 border-border h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Service</Label>
                    <Select value={formData.service} onValueChange={(v) => setFormData({...formData, service: v})}>
                      <SelectTrigger className="bg-background/50 border-border h-12">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="screen_repair">Screen Repair</SelectItem>
                        <SelectItem value="battery_replacement">Battery Replacement</SelectItem>
                        <SelectItem value="charging_port">Charging Port Repair</SelectItem>
                        <SelectItem value="water_damage">Water Damage Recovery</SelectItem>
                        <SelectItem value="controller_mod">Controller Modification</SelectItem>
                        <SelectItem value="console_mod">Console Modification</SelectItem>
                        <SelectItem value="led_mod">LED Modification</SelectItem>
                        <SelectItem value="custom_pc">Custom PC Build</SelectItem>
                        <SelectItem value="workstation">Workstation Build</SelectItem>
                        <SelectItem value="other">Other / General Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Message</Label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Tell us about your project or issue..."
                      className="bg-background/50 border-border min-h-[140px]"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-primary text-primary-foreground font-mono text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Send className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-3xl tracking-wide text-foreground mb-3">MESSAGE SENT</h3>
                  <p className="text-muted-foreground text-sm font-light max-w-sm mx-auto">
                    Thanks for reaching out! We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", service: "", message: "" });
                    }}
                    className="mt-8 font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground border-b border-border pb-1 hover:text-foreground hover:border-foreground transition-colors"
                  >
                    Send Another
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Info Cards */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((info, i) => (
              <GlassCard key={info.label} hover={false}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <info.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{info.label}</span>
                    <p className="text-foreground text-sm font-light mt-1">{info.value}</p>
                  </div>
                </div>
              </GlassCard>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-panel rounded-lg p-8 mt-4"
            >
              <h3 className="font-display text-xl tracking-wide text-foreground mb-3">MAIL-IN SERVICE</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">
                Can't come in person? We accept mail-in devices for repairs and modifications. Ship your device to us and we'll handle the rest — return shipping included.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}