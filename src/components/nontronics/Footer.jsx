import { Link } from "react-router-dom";
import { Instagram, Youtube, Facebook } from "lucide-react";
import { createPageUrl } from "@/utils";

const SOCIAL_LINKS = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram", hoverClass: "footer-social-instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube", hoverClass: "footer-social-youtube" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook", hoverClass: "footer-social-facebook" },
];

export default function Footer() {
  return (
    <footer className="glass-panel-strong border-t border-border mt-0">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <img
              src="/assets/nontronicslog.png"
              alt="Nontronics"
              className="h-8 w-auto mb-5 logo-img"
            />
            <p className="text-muted-foreground text-sm font-light leading-relaxed max-w-sm">
              Precise electronics repair, custom modifications, and quality PC builds.
              Giving an answer since day one.
            </p>
            <p className="text-muted-foreground text-xs font-light mt-3">
              Nontronics LLC, {new Date().getFullYear()}
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
                { label: "Resources", page: "Resources" },
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
              <li className="text-muted-foreground text-sm font-light">
                <a href="https://nontronics.com" className="hover:text-foreground transition-colors">nontronics.com</a>
                <span className="mx-1">|</span>
                <a href="https://nontronics.tech" className="hover:text-foreground transition-colors">nontronics.tech</a>
              </li>
              <li className="flex items-center gap-3 pt-2">
                {SOCIAL_LINKS.map(({ icon: Icon, href, label, hoverClass }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-muted-foreground transition-all duration-300 ${hoverClass}`}
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </a>
                ))}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            © {new Date().getFullYear()} Nontronics LLC. All rights reserved.
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            Built with precision
          </span>
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground/90">
          Nontronics LLC. is an independent repair, modification, and manufacturing service; We are not affiliated with any listed brands.
        </p>
      </div>
    </footer>
  );
}