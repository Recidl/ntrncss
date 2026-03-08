import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/nontronics/Navbar";
import Footer from "./components/nontronics/Footer";
import { ThemeProvider } from "./components/nontronics/ThemeContext";

export default function Layout({ children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <ThemeProvider>
      <div className="min-h-screen text-foreground">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}