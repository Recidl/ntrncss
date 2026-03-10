import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import LegalDocumentShell from "../components/nontronics/LegalDocumentShell";

const LAST_UPDATED = "March 10, 2026";
const EFFECTIVE_DATE = "March 10, 2026";

const TOC = [
  { id: "collect", label: "1. Information We Collect" },
  { id: "use", label: "2. How We Use Information" },
  { id: "sharing", label: "3. Sharing and Third-Party Processing" },
  { id: "payment-processing", label: "4. Payment Processing Clause" },
  { id: "device-data-exposure", label: "5. Device Data Exposure Clause" },
  { id: "external-links", label: "6. External Links Clause" },
  { id: "cookies", label: "7. Cookies and Analytics" },
  { id: "security", label: "8. Data Security" },
  { id: "retention", label: "9. Data Retention" },
  { id: "rights", label: "10. Your Privacy Choices and Rights" },
  { id: "staff-follow-up", label: "11. Staff Follow-Up and Additional Information" },
  { id: "children", label: "12. Children's Privacy (COPPA)" },
  { id: "updates", label: "13. Policy Updates" },
  { id: "privacy-contact", label: "14. Contact for Privacy Inquiries" },
];

export default function DataPolicy() {
  return (
    <LegalDocumentShell
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
      effectiveDate={EFFECTIVE_DATE}
      toc={TOC}
    >
      <section id="collect">
        <h2 className="font-semibold text-foreground">1. Information We Collect</h2>
        <p className="mt-2">Depending on your interaction with us, we may collect personal and service-related information, including:</p>
        <ul className="mt-2 list-disc list-inside space-y-1 text-foreground/90">
          <li>Name, email address, phone number, and state or shipping details.</li>
          <li>Service request details, device type, issue descriptions, and uploaded device photos.</li>
          <li>Transaction, shipping, and communication history related to your service request.</li>
          <li>Technical usage data such as browser type, device type, and interactions with our website.</li>
        </ul>
      </section>

      <section id="use">
        <h2 className="font-semibold text-foreground">2. How We Use Information</h2>
        <ul className="mt-2 list-disc list-inside space-y-1 text-foreground/90">
          <li>To review, process, and fulfill service requests for diagnostics, repairs, modifications, and builds.</li>
          <li>To communicate with you about quotes, approvals, status updates, shipping, and support.</li>
          <li>To arrange and manage mail-in and return shipping logistics.</li>
          <li>To detect abuse, reduce fraud risk, and protect the website and business operations.</li>
          <li>To improve website performance, service quality, and customer experience.</li>
        </ul>
      </section>

      <section id="sharing">
        <h2 className="font-semibold text-foreground">3. Sharing and Third-Party Processing</h2>
        <p className="mt-2">We may share only the information necessary to complete business operations with trusted third parties, such as payment processors, shipping providers, and technical service providers. These parties are permitted to process data only as needed to perform their services.</p>
        <p className="mt-2">Nontronics LLC does not sell personal information.</p>
      </section>

      <section id="payment-processing">
        <h2 className="font-semibold text-foreground">4. Payment Processing Clause</h2>
        <p className="mt-2">Payment transactions may be processed by third-party payment providers and related financial service partners. Nontronics LLC does not store full payment card numbers on its servers.</p>
        <p className="mt-2">Payment providers may process transaction and anti-fraud data according to their own terms and privacy practices, and customers should review those provider policies where applicable.</p>
      </section>

      <section id="device-data-exposure">
        <h2 className="font-semibold text-foreground">5. Device Data Exposure Clause</h2>
        <p className="mt-2">During diagnostics or repair, technicians may incidentally access operating systems, file structures, application states, or stored content on submitted devices when required to verify issues, test functionality, or complete service procedures.</p>
        <p className="mt-2">Nontronics LLC does not intentionally access personal files beyond what is reasonably necessary for diagnostics, repair, testing, quality control, or service completion. Customers remain responsible for backing up and removing sensitive data before service whenever possible.</p>
      </section>

      <section id="external-links">
        <h2 className="font-semibold text-foreground">6. External Links Clause</h2>
        <p className="mt-2">Our website may contain links to third-party websites, services, or platforms. Nontronics LLC is not responsible for the privacy practices, security controls, terms, or content of external sites.</p>
        <p className="mt-2">Users should review third-party privacy policies and terms before submitting information to those websites.</p>
      </section>

      <section id="cookies">
        <h2 className="font-semibold text-foreground">7. Cookies and Analytics</h2>
        <p className="mt-2">Our website may use cookies and similar technologies to remember preferences, improve functionality, and understand site performance. We may also use analytics data in aggregate form to evaluate traffic and improve content and user experience. Some cookies or analytics tools may be provided by third-party services to measure website traffic and performance.</p>
      </section>

      <section id="security">
        <h2 className="font-semibold text-foreground">8. Data Security</h2>
        <p className="mt-2">We use reasonable technical and organizational safeguards designed to protect personal information from unauthorized access, loss, misuse, or disclosure. No system can be guaranteed as fully secure, but we work to maintain appropriate protections for the nature of our operations.</p>
      </section>

      <section id="retention">
        <h2 className="font-semibold text-foreground">9. Data Retention</h2>
        <p className="mt-2">We retain information for as long as reasonably necessary to provide requested services, maintain records, resolve disputes, enforce agreements, and meet legal or accounting obligations.</p>
      </section>

      <section id="rights">
        <h2 className="font-semibold text-foreground">10. Your Privacy Choices and Rights</h2>
        <p className="mt-2">Subject to applicable law, you may request access to, correction of, or deletion of personal information we hold about you. You may also request updates to your contact details or ask questions about how your data is used. Requests regarding personal information may be submitted through our Contact page or by emailing us using the information listed below.</p>
      </section>

      <section id="staff-follow-up">
        <h2 className="font-semibold text-foreground">11. Staff Follow-Up and Additional Information</h2>
        <p className="mt-2">Our staff may request additional information necessary to prepare quotes, confirm service details, finalize repairs, verify shipping information, or resolve service-related questions.</p>
        <p className="mt-2">These follow-up requests may be made via email, phone, or other contact methods you provide to us. We use this information solely for legitimate service administration, support, and fulfillment purposes.</p>
      </section>

      <section id="children">
        <h2 className="font-semibold text-foreground">12. Children&apos;s Privacy (COPPA)</h2>
        <p className="mt-2">This website and our services are not directed to children under 13, and we do not knowingly collect personal information from children under 13.</p>
      </section>

      <section id="updates">
        <h2 className="font-semibold text-foreground">13. Policy Updates</h2>
        <p className="mt-2">We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised "Last updated" date.</p>
      </section>

      <section id="privacy-contact">
        <h2 className="font-semibold text-foreground">14. Contact for Privacy Inquiries</h2>
        <p className="mt-2">Company: Nontronics LLC<br />Email: Nontronics@gmail.com<br />Phone: (331) 274-5836<br />Location: Aurora, Illinois, United States</p>
        <p className="mt-2 text-muted-foreground">Privacy questions can also be sent through our <Link className="text-primary hover:underline" to={createPageUrl("Contact")}>Contact page</Link>.</p>
      </section>
    </LegalDocumentShell>
  );
}
