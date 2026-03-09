import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/nontronics/Navbar";
import Footer from "./components/nontronics/Footer";

const PAGE_TITLES = {
  home: "Nontronics LLC | Built with Precision.",
  repairs: "Nontronics LLC | Repairs",
  modifications: "Nontronics LLC | Modifications",
  custombuilds: "Nontronics LLC | Custom Builds",
  contact: "Nontronics LLC | Contact",
  resources: "Nontronics LLC | Resources",
};

export default function Layout({ children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    const routeKey = location.pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
    document.title = PAGE_TITLES[routeKey || "home"] || "Nontronics LLC | Built with Precision.";
  }, [location.pathname]);

  return (
    <div className="min-h-screen text-foreground bg-background">
      <Navbar />
      <main className="bg-background">{children}</main>
      <Footer />
    </div>
  );
}