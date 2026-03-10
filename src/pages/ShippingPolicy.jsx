import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import LegalDocumentShell from "../components/nontronics/LegalDocumentShell";

const LAST_UPDATED = "March 10, 2026";
const EFFECTIVE_DATE = "March 10, 2026";

const TOC = [
  { id: "scope", label: "1. Scope and Applicability" },
  { id: "inbound", label: "2. Inbound Shipping (Customer to Nontronics)" },
  { id: "packaging", label: "3. Packaging and Shipment Preparation" },
  { id: "return-shipping", label: "4. Return Shipping Methods and Timing" },
  { id: "risk-title", label: "5. Risk of Loss and Title Transfer" },
  { id: "address", label: "6. Address Accuracy and Delivery Attempts" },
  { id: "delays", label: "7. Delays, Exceptions, and Force Majeure" },
  { id: "claims", label: "8. Claims for Loss, Damage, or Misdelivery" },
  { id: "restricted", label: "9. Restricted Items and Safety Compliance" },
  { id: "international", label: "10. Domestic and International Service Area" },
  { id: "contact", label: "11. Shipping Contact and Support" },
];

export default function ShippingPolicy() {
  return (
    <LegalDocumentShell
      title="Shipping Policy"
      lastUpdated={LAST_UPDATED}
      effectiveDate={EFFECTIVE_DATE}
      toc={TOC}
    >
      <section id="scope">
        <h2 className="font-semibold text-foreground">1. Scope and Applicability</h2>
        <p className="mt-2">
          This Shipping Policy applies to mail-in diagnostics, repairs, modifications, custom builds,
          and any return shipments arranged by Nontronics LLC. This policy supplements our
          <Link className="text-primary hover:underline" to={createPageUrl("TermsOfService")}> Terms of Service</Link>
          {" "}and
          <Link className="text-primary hover:underline" to={createPageUrl("RepairServiceTerms")}> Repair / Service Terms</Link>.
          If a conflict exists, those legal documents control unless otherwise stated in writing.
        </p>
        <p className="mt-2">
          Nontronics LLC is a U.S.-based business operating from Illinois, and shipping/service support is intended for
          U.S. domestic customers. International requests, international shipping, and similar cross-border requests are
          almost never accepted unless explicitly confirmed by Nontronics in writing before shipment.
        </p>
      </section>

      <section id="inbound">
        <h2 className="font-semibold text-foreground">2. Inbound Shipping (Customer to Nontronics)</h2>
        <ul className="mt-2 list-disc list-inside space-y-1 text-foreground/90">
          <li>Customers are responsible for all inbound shipping costs unless we confirm otherwise in writing.</li>
          <li>Customers are responsible for selecting carrier service level and insurance for inbound packages.</li>
          <li>Customers must provide tracking information to Nontronics before inbound packages will be processed.</li>
          <li>Customers are strongly encouraged to purchase insurance for high-value items to help protect against transit loss or damage.</li>
          <li>Inbound transit risk remains with the sender and carrier until the shipment is delivered and received.</li>
        </ul>
      </section>

      <section id="packaging">
        <h2 className="font-semibold text-foreground">3. Packaging and Shipment Preparation</h2>
        <p className="mt-2">Customers must package shipments to withstand normal carrier handling and sorting conditions.</p>
        <ul className="mt-2 list-disc list-inside space-y-1 text-foreground/90">
          <li>Use rigid outer cartons with sufficient internal cushioning for device type and weight.</li>
          <li>Remove unnecessary accessories unless specifically requested for diagnosis or compatibility testing.</li>
          <li>Secure loose parts and protect screens, ports, and controls against impact and static damage.</li>
          <li>For lithium battery devices, comply with applicable carrier and hazmat handling requirements.</li>
          <li>Improper packaging may limit recovery options in a carrier claim and may delay intake processing.</li>
        </ul>
      </section>

      <section id="return-shipping">
        <h2 className="font-semibold text-foreground">4. Return Shipping Methods and Timing</h2>
        <ul className="mt-2 list-disc list-inside space-y-1 text-foreground/90">
          <li>Return shipping method is selected by Nontronics unless a specific carrier/service is agreed in writing.</li>
          <li>Signature confirmation may be added for high-value items or at our discretion for security reasons.</li>
          <li>Processing time and carrier transit time are separate; carrier estimates are not guaranteed delivery dates.</li>
          <li>Processing time is generally 1-3 business days from confirmed device receipt, excluding weekends and holidays.</li>
          <li>Tracking details are provided when available after a shipment is tendered to the carrier.</li>
          <li>If weather, network congestion, or operational disruption occurs, transit may be delayed without breach.</li>
        </ul>
      </section>

      <section id="risk-title">
        <h2 className="font-semibold text-foreground">5. Risk of Loss and Title Transfer</h2>
        <p className="mt-2">
          For outbound shipments arranged by Nontronics, risk of loss generally transfers to the carrier
          at the time the package is accepted and scanned by the carrier, except where non-waivable law
          requires a different allocation. Carrier records and delivery scans are primary shipment evidence.
        </p>
        <p className="mt-2">
          For inbound shipments, risk of loss remains with the sender and carrier until physical receipt
          by Nontronics at the designated intake location.
        </p>
      </section>

      <section id="address">
        <h2 className="font-semibold text-foreground">6. Address Accuracy and Delivery Attempts</h2>
        <ul className="mt-2 list-disc list-inside space-y-1 text-foreground/90">
          <li>Customers are responsible for providing complete and accurate shipping address information.</li>
          <li>Address correction fees, reroute fees, re-delivery costs, or return-to-sender charges may apply.</li>
          <li>Nontronics is not responsible for delays or misdelivery caused by incorrect customer-provided address data.</li>
          <li>Unclaimed or refused deliveries may be treated as customer-cancelled return attempts and re-shipping fees may apply.</li>
          <li>Packages not claimed, corrected, or otherwise resolved within 45 days after notice may be returned, recycled, or disposed of at the customer&apos;s expense as permitted by applicable law.</li>
        </ul>
      </section>

      <section id="delays">
        <h2 className="font-semibold text-foreground">7. Delays, Exceptions, and Force Majeure</h2>
        <p className="mt-2">
          Nontronics is not liable for shipping delays caused by carrier service interruptions, weather,
          natural events, labor disputes, customs holds, public utility failure, internet outages, government action,
          or other events beyond reasonable operational control.
        </p>
      </section>

      <section id="claims">
        <h2 className="font-semibold text-foreground">8. Claims for Loss, Damage, or Misdelivery</h2>
        <ul className="mt-2 list-disc list-inside space-y-1 text-foreground/90">
          <li>Visible package damage should be documented immediately with photos of box, label, and contents.</li>
          <li>Shipping issues should be reported to Nontronics promptly, ideally within 48 hours of delivery status update.</li>
          <li>Carrier investigations may require customer cooperation, evidence submission, and response to carrier requests.</li>
          <li>Claim outcomes are governed by carrier rules, declared value, and proof of packaging and condition.</li>
          <li>Nontronics cannot guarantee carrier claim approval and is not responsible for carrier denial decisions.</li>
        </ul>
      </section>

      <section id="restricted">
        <h2 className="font-semibold text-foreground">9. Restricted Items and Safety Compliance</h2>
        <p className="mt-2">Customers must not include prohibited, hazardous, unlawful, or undeclared restricted materials in shipments.</p>
        <ul className="mt-2 list-disc list-inside space-y-1 text-foreground/90">
          <li>Shipments that violate carrier or legal restrictions may be refused, quarantined, or returned.</li>
          <li>Customer is responsible for fines, penalties, or losses resulting from restricted-item violations.</li>
          <li>Nontronics may refuse service where shipment contents create unreasonable safety or legal risk.</li>
        </ul>
      </section>

      <section id="international">
        <h2 className="font-semibold text-foreground">10. Domestic and International Service Area</h2>
        <p className="mt-2">
          Shipping support is primarily structured for U.S. domestic service. International requests are almost
          never accepted and require prior written approval by Nontronics before any shipment is sent.
          International shipments may involve additional transit risk,
          customs processing, duties/taxes, and delays outside our control. Customers are responsible for
          import/export compliance and related fees unless explicitly agreed otherwise.
        </p>
      </section>

      <section id="contact">
        <h2 className="font-semibold text-foreground">11. Shipping Contact and Support</h2>
        <p className="mt-2">
          Company: Nontronics LLC<br />
          Email: Nontronics@gmail.com<br />
          Phone: (331) 274-5836<br />
          Location: Aurora, Illinois, United States
        </p>
        <p className="mt-2 text-muted-foreground">
          Shipping questions can be submitted through our
          <Link className="text-primary hover:underline" to={createPageUrl("Contact")}> Contact page</Link>.
        </p>
      </section>
    </LegalDocumentShell>
  );
}
