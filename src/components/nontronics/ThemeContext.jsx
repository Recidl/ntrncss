import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("nontronics-theme");
    if (saved) {
      return saved === "dark";
    }
    // Auto-detect system preference
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true; // default to dark
  });

  useEffect(() => {
    localStorage.setItem("nontronics-theme", dark ? "dark" : "light");
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  // Apply on mount - ensure theme is set immediately
  useEffect(() => {
    const saved = localStorage.getItem("nontronics-theme");
    let isDark;
    if (saved) {
      isDark = saved === "dark";
    } else if (typeof window !== "undefined" && window.matchMedia) {
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    } else {
      isDark = true;
    }
    
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}