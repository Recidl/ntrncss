import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Footer() {
  return (
    <footer className="glass-panel-strong border-t border-border mt-0">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69acca1bfb112d09d1f7b474/914300974_nontronics1.png"
              alt="Nontronics"
              className="h-8 w-auto mb-5 logo-img"
            />
            <p className="text-muted-foreground text-sm font-light leading-relaxed max-w-sm">
              Precision electronics repair, custom modifications, and bespoke PC builds.
              Crafting technology solutions since day one.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-primary mb-6">Services</h4>
            <ul className="space-y-3">
              {[
                { label: "Repairs", page: "Repairs" },
                { label: "Modifications", page: "Modifications" },
                { label: "Custom Builds", page: "CustomBuilds" },
              ].map((item) => (
                <li key={item.page}>
                  <Link
                    to={createPageUrl(item.page)}
                    className="text-muted-foreground text-sm font-light hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-primary mb-6">Contact</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to={createPageUrl("Contact")}
                  className="text-muted-foreground text-sm font-light hover:text-foreground transition-colors"
                >
                  Get in Touch
                </Link>
              </li>
              <li className="text-muted-foreground text-sm font-light">nontronics.tech</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            © {new Date().getFullYear()} Nontronics. All rights reserved.
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            Built with precision
          </span>
        </div>
      </div>
    </footer>
  );
}