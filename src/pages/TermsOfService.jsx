import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import LegalDocumentShell from "../components/nontronics/LegalDocumentShell";

const LAST_UPDATED = "March 10, 2026";
const EFFECTIVE_DATE = "March 10, 2026";

const TOC = [
  { id: "acceptance", label: "1. Acceptance of Terms" },
  { id: "services", label: "2. Description of Services" },
  { id: "website-use", label: "3. Website Use Rules" },
  { id: "ip", label: "4. Intellectual Property" },
  { id: "outcomes", label: "5. Service Outcomes and Repair Limitations" },
  { id: "diagnostic-fee", label: "6. Diagnostic Fee Clause" },
  { id: "parts-availability", label: "7. Parts Availability Clause" },
  { id: "device-condition", label: "8. Device Condition Clause" },
  { id: "data-loss", label: "9. Data Backup and Data Loss Disclaimer" },
  { id: "shipping", label: "10. Shipping and Transit Risk" },
  { id: "payment", label: "11. Payment Terms and Service Approval" },
  { id: "refusal", label: "12. Right to Refuse Service" },
  { id: "unclaimed", label: "13. Unclaimed Device Policy" },
  { id: "liability", label: "14. Limitation of Liability" },
  { id: "law", label: "15. Governing Law" },
  { id: "contact", label: "16. Contact Information" },
];

export default function TermsOfService() {
  return (
    <LegalDocumentShell
      title="Terms of Service"
      lastUpdated={LAST_UPDATED}
      effectiveDate={EFFECTIVE_DATE}
      toc={TOC}
    >
      <section id="acceptance">
        <h2 className="font-semibold text-foreground">1. Acceptance of Terms</h2>
        <p className="mt-2">By accessing, browsing, or using this website, or by submitting a device or service request to Nontronics LLC, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with these terms, you should not use this website or our services.</p>
      </section>

      <section id="services">
        <h2 className="font-semibold text-foreground">2. Description of Services</h2>
        <p className="mt-2">Nontronics LLC provides electronics diagnostics, repair, hardware modification, and custom or prebuilt PC build services. Services may include work on PCs, laptops, gaming consoles, controllers, and related electronics. We may also offer mail-in service where customers ship devices to us for evaluation and service. Our operations are U.S.-based and primarily domestic; international requests and shipping are almost never accepted unless approved by us in writing in advance.</p>
      </section>

      <section id="website-use">
        <h2 className="font-semibold text-foreground">3. Website Use Rules</h2>
        <ul className="mt-2 list-disc list-inside space-y-1 text-foreground/90">
          <li>Use this website only for lawful purposes.</li>
          <li>Do not attempt to interfere with site security, operation, or availability.</li>
          <li>Do not submit false, fraudulent, or misleading service requests.</li>
          <li>Do not copy or reuse content from this site without written permission.</li>
        </ul>
      </section>

      <section id="ip">
        <h2 className="font-semibold text-foreground">4. Intellectual Property</h2>
        <p className="mt-2">All website content, including branding, logos, text, graphics, and media, is owned by or licensed to Nontronics LLC and protected by applicable intellectual property laws. No rights are granted except as expressly stated in these terms.</p>
      </section>

      <section id="outcomes">
        <h2 className="font-semibold text-foreground">5. Service Outcomes and Repair Limitations</h2>
        <ul className="mt-2 list-disc list-inside space-y-1 text-foreground/90">
          <li>No guarantee is made that any diagnostic, repair, or modification will be successful.</li>
          <li>Some devices may be non-repairable due to prior damage, part availability, or manufacturer restrictions.</li>
          <li>Pre-existing wear, corrosion, liquid damage, or previous repair attempts may affect outcomes.</li>
          <li>In certain cases, additional issues may be discovered during service that require further approval.</li>
        </ul>
      </section>

      <section id="diagnostic-fee">
        <h2 className="font-semibold text-foreground">6. Diagnostic Fee Clause</h2>
        <p className="mt-2">Diagnostic services may include inspection, testing, disassembly, reassembly, software evaluation, and troubleshooting procedures necessary to determine device condition and service options.</p>
        <p className="mt-2">Diagnostic fees may apply even if a device is not repaired, if no viable repair path is available, or if the customer declines recommended follow-up service after diagnostics are completed.</p>
      </section>

      <section id="parts-availability">
        <h2 className="font-semibold text-foreground">7. Parts Availability Clause</h2>
        <p className="mt-2">Repair timelines, pricing, and repair success can depend on third-party parts availability. Some components may be backordered, delayed, region-limited, or discontinued by manufacturers or suppliers.</p>
        <p className="mt-2">Nontronics LLC is not responsible for supplier, distributor, or manufacturer delays, allocation limits, discontinued parts, or related logistics issues outside our direct control.</p>
      </section>

      <section id="device-condition">
        <h2 className="font-semibold text-foreground">8. Device Condition Clause</h2>
        <p className="mt-2">Certain devices may be structurally or electrically fragile due to age, wear, corrosion, liquid exposure, prior third-party repair, impact history, or manufacturer design limitations.</p>
        <p className="mt-2">In these cases, diagnostic or repair attempts may reveal or trigger additional failure despite reasonable care. Nontronics LLC is not responsible for damage resulting from underlying device condition, latent defects, or pre-existing instability.</p>
      </section>

      <section id="data-loss">
        <h2 className="font-semibold text-foreground">9. Data Backup and Data Loss Disclaimer</h2>
        <p className="mt-2">You are solely responsible for backing up all data before submitting any device for service. Nontronics LLC is not liable for data loss, corruption, or inaccessibility resulting from diagnostics, repair attempts, parts replacement, software procedures, or device failure.</p>
      </section>

      <section id="shipping">
        <h2 className="font-semibold text-foreground">10. Shipping and Transit Risk</h2>
        <ul className="mt-2 list-disc list-inside space-y-1 text-foreground/90">
          <li>Mail-in customers are responsible for secure packaging and shipment of incoming devices.</li>
          <li>Risk of loss or damage in transit remains with the shipping carrier and party arranging shipment.</li>
          <li>We may use carriers such as USPS or FedEx for return shipping, depending on service type and package needs.</li>
          <li>Risk for return shipments transfers to the carrier once the package is released for shipment.</li>
          <li>Tracking information is generally provided for return shipments when available.</li>
          <li>Service and shipping are intended for U.S. domestic requests; international shipping is almost never accepted unless pre-approved in writing.</li>
        </ul>
      </section>

      <section id="payment">
        <h2 className="font-semibold text-foreground">11. Payment Terms and Service Approval</h2>
        <ul className="mt-2 list-disc list-inside space-y-1 text-foreground/90">
          <li>Quotes are provided before paid work proceeds when possible.</li>
          <li>Repair and modification services are typically due at device release unless otherwise agreed in writing.</li>
          <li>Custom build orders may require a deposit before parts are ordered.</li>
          <li>Customer approval is required for paid repair work beyond agreed diagnostic scope.</li>
        </ul>
      </section>

      <section id="refusal">
        <h2 className="font-semibold text-foreground">12. Right to Refuse Service</h2>
        <p className="mt-2">Nontronics LLC reserves the right to refuse or discontinue service at our discretion, including cases involving unsafe devices, suspected fraud, abusive behavior, unsupported requests, legal concerns, or non-payment.</p>
      </section>

      <section id="unclaimed">
        <h2 className="font-semibold text-foreground">13. Unclaimed Device Policy</h2>
        <p className="mt-2">Devices not claimed within 45 days after notice of completion, cancellation, or pickup readiness may be treated as abandoned. Nontronics LLC may charge reasonable storage fees and, where permitted by law, recycle, dispose of, or otherwise process abandoned property to recover costs. We may attempt to contact the customer using the contact information provided before processing an abandoned device.</p>
      </section>

      <section id="liability">
        <h2 className="font-semibold text-foreground">14. Limitation of Liability</h2>
        <p className="mt-2">To the maximum extent allowed by law, Nontronics LLC is not liable for indirect, incidental, special, consequential, or punitive damages, including lost profits, lost data, downtime, shipping delays, or business interruption. Our total liability for any claim related to services or website use will not exceed the amount paid by you for the specific service giving rise to the claim.</p>
      </section>

      <section id="law">
        <h2 className="font-semibold text-foreground">15. Governing Law</h2>
        <p className="mt-2">These Terms are governed by the laws of the State of Illinois and applicable United States federal law, without regard to conflict-of-law principles.</p>
      </section>

      <section id="contact">
        <h2 className="font-semibold text-foreground">16. Contact Information</h2>
        <p className="mt-2">Company: Nontronics LLC<br />Email: Nontronics@gmail.com<br />Phone: (331) 274-5836<br />Location: Aurora, Illinois, United States</p>
        <p className="mt-2 text-muted-foreground">Questions about these terms can also be submitted through our <Link className="text-primary hover:underline" to={createPageUrl("Contact")}>Contact page</Link>.</p>
      </section>
    </LegalDocumentShell>
  );
}
