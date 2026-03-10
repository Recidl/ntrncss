import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import SectionHeader from "../components/nontronics/SectionHeader";
import GlassCard from "../components/nontronics/GlassCard";

const LAST_UPDATED = "March 9, 2026";

export default function PrivacyPolicy() {
  return (
    <div>
      <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 px-5 md:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-secondary/30" />
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-primary/8 blur-[120px]" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-8 h-px bg-primary" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-primary">Nontronics LLC</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl tracking-tight text-black dark:text-foreground"
          >
            PRIVACY <span className="text-primary">POLICY</span>
          </motion.h1>
          <p className="mt-6 text-muted-foreground text-sm md:text-base font-light leading-relaxed max-w-3xl">
            This Privacy Policy explains how Nontronics LLC collects, uses, and protects personal information when you use our
            website, contact us, or request services.
          </p>
          <p className="mt-3 text-xs text-muted-foreground font-mono tracking-[0.15em] uppercase">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="px-5 md:px-12 py-16 md:py-24 max-w-5xl mx-auto">
        <SectionHeader
          number="01"
          title="PRIVACY PRACTICES"
          subtitle="How we handle customer and website information."
        />

        <div className="mt-10 space-y-6">
          <GlassCard className="p-6 md:p-8">
            <h2 className="font-display text-2xl tracking-wide text-foreground">1. Information We Collect</h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground font-light leading-relaxed">
              Depending on your interaction with us, we may collect personal and service-related information, including:
            </p>
            <ul className="mt-3 list-disc list-inside space-y-2 text-sm md:text-base text-muted-foreground font-light leading-relaxed">
              <li>Name, email address, phone number, and state or shipping details.</li>
              <li>Service request details, device type, issue descriptions, and uploaded device photos.</li>
              <li>Transaction, shipping, and communication history related to your service request.</li>
              <li>Technical usage data such as browser type, device type, and interactions with our website.</li>
            </ul>
          </GlassCard>

          <GlassCard className="p-6 md:p-8">
            <h2 className="font-display text-2xl tracking-wide text-foreground">2. How We Use Information</h2>
            <ul className="mt-3 list-disc list-inside space-y-2 text-sm md:text-base text-muted-foreground font-light leading-relaxed">
              <li>To review, process, and fulfill service requests for diagnostics, repairs, modifications, and builds.</li>
              <li>To communicate with you about quotes, approvals, status updates, shipping, and support.</li>
              <li>To arrange and manage mail-in and return shipping logistics.</li>
              <li>To detect abuse, reduce fraud risk, and protect the website and business operations.</li>
              <li>To improve website performance, service quality, and customer experience.</li>
            </ul>
          </GlassCard>

          <GlassCard className="p-6 md:p-8">
            <h2 className="font-display text-2xl tracking-wide text-foreground">3. Sharing and Third-Party Processing</h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground font-light leading-relaxed">
              We may share only the information necessary to complete business operations with trusted third parties, such as payment
              processors, shipping providers, and technical service providers. These parties are permitted to process data only as needed
              to perform their services.
            </p>
            <p className="mt-3 text-sm md:text-base text-muted-foreground font-light leading-relaxed">
              Nontronics LLC does not sell personal information.
            </p>
          </GlassCard>

          <GlassCard className="p-6 md:p-8">
            <h2 className="font-display text-2xl tracking-wide text-foreground">4. Cookies and Analytics</h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground font-light leading-relaxed">
              Our website may use cookies and similar technologies to remember preferences, improve functionality, and understand site
              performance. We may also use analytics data in aggregate form to evaluate traffic and improve content and user experience.
            </p>
          </GlassCard>

          <GlassCard className="p-6 md:p-8">
            <h2 className="font-display text-2xl tracking-wide text-foreground">5. Data Security</h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground font-light leading-relaxed">
              We use reasonable technical and organizational safeguards designed to protect personal information from unauthorized access,
              loss, misuse, or disclosure. No system can be guaranteed as fully secure, but we work to maintain appropriate protections
              for the nature of our operations.
            </p>
          </GlassCard>

          <GlassCard className="p-6 md:p-8">
            <h2 className="font-display text-2xl tracking-wide text-foreground">6. Data Retention</h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground font-light leading-relaxed">
              We retain information for as long as reasonably necessary to provide requested services, maintain records, resolve disputes, enforce agreements, and meet legal, tax, or accounting obligations.
            </p>
          </GlassCard>

          <GlassCard className="p-6 md:p-8">
            <h2 className="font-display text-2xl tracking-wide text-foreground">7. Your Privacy Choices and Rights</h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground font-light leading-relaxed">
              Subject to applicable law, you may request access to, correction of, or deletion of personal information we hold about you.
              You may also request updates to your contact details or ask questions about how your data is used.
            </p>
          </GlassCard>

          <GlassCard className="p-6 md:p-8">
            <h2 className="font-display text-2xl tracking-wide text-foreground">8. Children&apos;s Privacy</h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground font-light leading-relaxed">
              This website and our services are not directed to children under 13, and we do not knowingly collect personal information
              from children under 13.
            </p>
          </GlassCard>

          <GlassCard className="p-6 md:p-8">
            <h2 className="font-display text-2xl tracking-wide text-foreground">9. Policy Updates</h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground font-light leading-relaxed">
              We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised "Last updated"
              date.
            </p>
          </GlassCard>

          <GlassCard className="p-6 md:p-8">
            <h2 className="font-display text-2xl tracking-wide text-foreground">10. Contact for Privacy Inquiries</h2>
            <div className="mt-3 space-y-1 text-sm md:text-base text-muted-foreground font-light leading-relaxed">
              <p><span className="text-foreground">Company:</span> Nontronics LLC</p>
              <p><span className="text-foreground">Email:</span> Nontronics@gmail.com</p>
              <p><span className="text-foreground">Phone:</span> (331) 274-5836</p>
              <p><span className="text-foreground">Location:</span> Aurora, Illinois, United States</p>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Privacy questions can also be sent through our <Link className="text-primary hover:underline" to={createPageUrl("Contact")}>Contact page</Link>.
            </p>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
