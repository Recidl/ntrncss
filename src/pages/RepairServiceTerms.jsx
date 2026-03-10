import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import LegalDocumentShell from "../components/nontronics/LegalDocumentShell";

const LAST_UPDATED = "March 10, 2026";
const EFFECTIVE_DATE = "March 10, 2026";

const TOC = [
  { id: "process", label: "1. Diagnostic and Repair Process" },
  { id: "authorization", label: "2. Authorization for Service" },
  { id: "customer-cooperation", label: "3. Customer Cooperation and Information Accuracy" },
  { id: "diagnostic-access", label: "4. Testing and Account/System Access" },
  { id: "unsuccessful", label: "5. Possible Unsuccessful Repairs" },
  { id: "deposits", label: "6. Payment and Deposit Clause" },
  { id: "warranty", label: "7. Warranty and Post-Service Liability" },
  { id: "data-backup", label: "8. Data Backup and Data Loss" },
  { id: "preexisting", label: "9. Pre-Existing Damage and Repair Risk" },
  { id: "refusal", label: "10. Right to Refuse or Discontinue Service" },
  { id: "mail-in", label: "11. Mail-In and Shipping Terms" },
  { id: "return-shipping", label: "12. Return Shipping and Delivery" },
  { id: "storage", label: "13. Storage Limits and Abandoned Devices" },
  { id: "limits", label: "14. Liability Limitations" },
  { id: "service-contact", label: "15. Contact" },
];

export default function RepairServiceTerms() {
  return (
    <LegalDocumentShell
      title="Repair / Service Terms"
      lastUpdated={LAST_UPDATED}
      effectiveDate={EFFECTIVE_DATE}
      toc={TOC}
    >
      <section id="process">
        <h2 className="font-semibold text-foreground">1. Diagnostic and Repair Process</h2>
        <p className="mt-2">Service generally begins with intake and diagnostic evaluation. Diagnostic work may include inspection, testing, disassembly, reassembly, and troubleshooting needed to determine the device condition and repair path. Based on findings, we provide a quote or recommended scope of work when possible.</p>
        <p className="mt-2">Diagnostic fees may apply even if the device is not repaired or if the customer declines recommended follow-up service after diagnostics are completed.</p>
      </section>

      <section id="authorization">
        <h2 className="font-semibold text-foreground">2. Authorization for Service</h2>
        <p className="mt-2">By submitting a device, you authorize Nontronics LLC to perform diagnostics and agreed service work. Additional paid work outside the approved scope requires customer authorization before completion when feasible.</p>
      </section>

      <section id="customer-cooperation">
        <h2 className="font-semibold text-foreground">3. Customer Cooperation and Information Accuracy</h2>
        <p className="mt-2">Customers must provide accurate and complete information relevant to service intake and fulfillment, including device condition, model details, serial numbers, account credentials (when necessary), and shipping/contact information.</p>
        <p className="mt-2">Failure to provide accurate or timely information may result in delayed timelines, failed diagnostics/repair attempts, additional service communication, or refusal/discontinuation of service.</p>
      </section>

      <section id="diagnostic-access">
        <h2 className="font-semibold text-foreground">4. Testing and Account/System Access</h2>
        <p className="mt-2">Technicians may need to access operating systems, firmware, software functions, accounts, and stored content to perform diagnostics, confirm reported faults, validate repair outcomes, and complete service quality checks.</p>
        <p className="mt-2">Nontronics LLC does not intentionally view, use, or copy personal data beyond what is reasonably required to perform requested service procedures.</p>
        <p className="mt-2">Staff follow-up and access may involve device-related data as described in our <Link className="text-primary hover:underline" to={createPageUrl("PrivacyPolicy")}>Privacy Policy</Link>.</p>
      </section>

      <section id="unsuccessful">
        <h2 className="font-semibold text-foreground">5. Possible Unsuccessful Repairs</h2>
        <p className="mt-2">Some failures cannot be resolved due to board-level damage, unavailable parts, prior improper repair attempts, hidden defects, or manufacturer restrictions. No guarantee is made that every repair or modification attempt will restore full function.</p>
        <p className="mt-2">Repair timelines and outcomes may depend on third-party supplier/manufacturer part availability. Some parts may be delayed, constrained, or discontinued, and Nontronics LLC is not responsible for delays caused by suppliers or manufacturers.</p>
      </section>

      <section id="deposits">
        <h2 className="font-semibold text-foreground">6. Payment and Deposit Clause</h2>
        <p className="mt-2">Custom orders, special-order components, or parts procurement may require a deposit before work begins.</p>
        <p className="mt-2">Deposits are non-refundable once parts are ordered, reserved, allocated, or once service work has started.</p>
      </section>

      <section id="warranty">
        <h2 className="font-semibold text-foreground">7. Warranty and Post-Service Liability</h2>
        <p className="mt-2">No warranty is provided unless explicitly stated in writing for a specific service or product. Any written warranty applies only to the exact service scope and period identified in that written statement.</p>
        <p className="mt-2">Upon completion and return of a device, Nontronics LLC is not responsible for issues arising from subsequent use, additional damage, environmental factors, software changes, third-party handling, or carrier mishandling in transit.</p>
        <p className="mt-2">Any post-service claim must be submitted within 14 days of confirmed device receipt and must directly relate to the completed service scope.</p>
      </section>

      <section id="data-backup">
        <h2 className="font-semibold text-foreground">8. Data Backup and Data Loss</h2>
        <p className="mt-2">Customers must back up all data before sending or dropping off devices. Nontronics LLC is not responsible for data loss, corruption, or software issues that occur before, during, or after diagnostic or repair procedures.</p>
        <p className="mt-2">Data handling during service and related staff follow-up is addressed in our <Link className="text-primary hover:underline" to={createPageUrl("PrivacyPolicy")}>Privacy Policy</Link>.</p>
      </section>

      <section id="preexisting">
        <h2 className="font-semibold text-foreground">9. Pre-Existing Damage and Repair Risk</h2>
        <p className="mt-2">Devices with prior damage, liquid exposure, corrosion, impact damage, missing parts, previous third-party repair, age-related wear, or manufacturer design limitations can be fragile. While handled with care, additional failure may occur during disassembly, testing, soldering, or reassembly due to pre-existing conditions.</p>
        <p className="mt-2">Where underlying instability exists, Nontronics LLC is not responsible for damage resulting from latent defects, weakened materials, or other pre-existing device condition factors discovered during service.</p>
      </section>

      <section id="refusal">
        <h2 className="font-semibold text-foreground">10. Right to Refuse or Discontinue Service</h2>
        <p className="mt-2">Nontronics LLC reserves the right to refuse or discontinue service at its discretion, including requests involving unsafe devices, suspected fraudulent activity, illegal content, non-cooperation, or abusive behavior.</p>
      </section>

      <section id="mail-in">
        <h2 className="font-semibold text-foreground">11. Mail-In and Shipping Terms</h2>
        <ul className="mt-2 list-disc list-inside space-y-1 text-foreground/90">
          <li>Customers are responsible for safe packaging and shipment of inbound devices.</li>
          <li>Customers are strongly encouraged to use insured and trackable shipping methods to help protect against loss or damage during transit.</li>
          <li>Transit damage, delay, or loss is the responsibility of the carrier and shipping party.</li>
          <li>Return shipment is sent to the address provided by the customer; signature options may be used when appropriate.</li>
          <li>Nontronics is U.S.-based and primarily accepts U.S. domestic mail-in service; international requests are almost never accepted unless approved in writing before intake.</li>
        </ul>
      </section>

      <section id="return-shipping">
        <h2 className="font-semibold text-foreground">12. Return Shipping and Delivery</h2>
        <p className="mt-2">Return shipping timelines depend on carrier schedules and destination. Once a return package is transferred to a carrier, delivery timing and transit handling are controlled by that carrier. Customers must provide accurate shipping details. Return shipments are generally limited to U.S. domestic addresses, and international returns are almost never offered unless expressly approved in writing.</p>
      </section>

      <section id="storage">
        <h2 className="font-semibold text-foreground">13. Storage Limits and Abandoned Devices</h2>
        <p className="mt-2">Completed or declined-service devices must be claimed promptly. Devices left unclaimed for more than 45 days after notice may be considered abandoned. Storage fees may apply, and abandoned items may be recycled, disposed of, or otherwise processed in accordance with applicable law.</p>
        <p className="mt-2">Before designating a device as abandoned, Nontronics LLC may attempt to contact the customer using the provided phone number, email address, or other submitted contact details.</p>
      </section>

      <section id="limits">
        <h2 className="font-semibold text-foreground">14. Liability Limitations</h2>
        <p className="mt-2">To the fullest extent permitted by law, Nontronics LLC is not liable for indirect or consequential damages, including lost data, lost use, lost revenue, or shipping-related losses. Liability for direct damages, if any, is limited to the amount paid for the specific service at issue.</p>
      </section>

      <section id="service-contact">
        <h2 className="font-semibold text-foreground">15. Contact</h2>
        <p className="mt-2">Company: Nontronics LLC<br />Email: Nontronics@gmail.com<br />Phone: (331) 274-5836<br />Location: Aurora, Illinois, United States</p>
        <p className="mt-2 text-muted-foreground">For service-related questions, use our <Link className="text-primary hover:underline" to={createPageUrl("Contact")}>Contact page</Link>.</p>
      </section>
    </LegalDocumentShell>
  );
}
