import { useCallback, useEffect } from "react";
import { Printer } from "lucide-react";

export default function LegalDocumentShell({
  title,
  lastUpdated,
  effectiveDate,
  toc = [],
  children,
}) {
  const focusSection = useCallback((id) => {
    if (typeof document === "undefined") return;

    const target = document.getElementById(id);
    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });

    // Re-trigger the flash animation if the same section is selected again.
    target.classList.remove("legal-section-flash");
    void target.offsetWidth;
    target.classList.add("legal-section-flash");

    window.setTimeout(() => {
      target.classList.remove("legal-section-flash");
    }, 2600);
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const applyFromHash = () => {
      const rawHash = window.location.hash;
      if (!rawHash || rawHash.length < 2) return;
      const id = decodeURIComponent(rawHash.slice(1));
      focusSection(id);
    };

    // Support direct links and browser back/forward hash navigation.
    applyFromHash();
    window.addEventListener("hashchange", applyFromHash);
    return () => {
      window.removeEventListener("hashchange", applyFromHash);
    };
  }, [focusSection]);

  return (
    <section className="px-4 md:px-10 py-14 md:py-20" id="top">
      <style>{`
        .legal-section-flash {
          position: relative;
          border-radius: 0.25rem;
          animation: legalSectionFlash 2.4s ease-out;
          box-shadow: 0 0 0 2px hsl(var(--primary) / 0.55);
          background: hsl(var(--primary) / 0.10);
        }

        @keyframes legalSectionFlash {
          0% {
            box-shadow: 0 0 0 3px hsl(var(--primary) / 0.75);
            background: hsl(var(--primary) / 0.20);
          }
          70% {
            box-shadow: 0 0 0 2px hsl(var(--primary) / 0.20);
            background: hsl(var(--primary) / 0.05);
          }
          100% {
            box-shadow: 0 0 0 0 hsl(var(--primary) / 0);
            background: transparent;
          }
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        <article className="relative border border-border bg-background shadow-sm overflow-hidden">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <img
              src="/assets/nontronicsbwplog.png"
              alt=""
              aria-hidden="true"
              className="logo-img w-[72%] max-w-3xl opacity-[0.05] dark:opacity-[0.07]"
            />
          </div>

          <div className="relative p-6 md:p-12">
            <header className="border-b border-border pb-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground">Nontronics LLC</p>
                  <h1 className="mt-3 font-display text-3xl md:text-4xl tracking-tight text-foreground">{title}</h1>
                  <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
                  <p className="text-sm text-muted-foreground">Effective date: {effectiveDate}</p>
                </div>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs font-mono tracking-[0.08em] uppercase text-foreground hover:bg-secondary transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  Print / Save PDF
                </button>
              </div>
            </header>

            {toc.length > 0 && (
              <nav className="mt-6 border border-border bg-secondary/30 p-4" aria-label="Document sections">
                <h2 className="font-semibold text-foreground">Contents</h2>
                <ul className="mt-2 grid gap-1 md:grid-cols-2 text-sm text-foreground/90">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(event) => {
                          event.preventDefault();
                          if (typeof window !== "undefined") {
                            const nextHash = `#${item.id}`;
                            if (window.location.hash !== nextHash) {
                              window.history.pushState(null, "", nextHash);
                            }
                          }
                          focusSection(item.id);
                        }}
                        className="hover:text-primary transition-colors"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            <div className="mt-8 space-y-8 text-sm md:text-base leading-relaxed text-foreground/95">{children}</div>

            <footer className="mt-10 border-t border-border pt-5 text-xs text-muted-foreground flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-2">
                <p>This document is provided by Nontronics LLC for transparency and legal clarity.</p>
                <p>Nontronics LLC may update this {title} from time to time. The updated version will be posted and announced on the website and page with a revised effective date.</p>
                <p className="flex flex-wrap gap-x-3 gap-y-1">
                  <a href="/TermsOfService" className="hover:text-primary transition-colors">Terms of Service</a>
                  <span>|</span>
                  <a href="/PrivacyPolicy" className="hover:text-primary transition-colors">Privacy Policy</a>
                  <span>|</span>
                  <a href="/RepairServiceTerms" className="hover:text-primary transition-colors">Repair / Service Terms</a>
                  <span>|</span>
                  <a href="/ShippingPolicy" className="hover:text-primary transition-colors">Shipping Policy</a>
                </p>
              </div>
              <a href="#top" className="hover:text-primary transition-colors">Back to top</a>
            </footer>
          </div>
        </article>
      </div>
    </section>
  );
}
