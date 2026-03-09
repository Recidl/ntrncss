import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff } from "lucide-react";
import { useTheme } from "./nontronics/ThemeContext";

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [bannerState, setBannerState] = useState(
    typeof navigator !== "undefined" && !navigator.onLine ? "offline" : null
  );
  const hideTimerRef = useRef(null);
  const { dark } = useTheme();

  useEffect(() => {
    const clearHideTimer = () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };

    const handleOnline = () => {
      setIsOnline(true);
      setBannerState("online");
      clearHideTimer();
      hideTimerRef.current = setTimeout(() => {
        setBannerState(null);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      clearHideTimer();
      setBannerState("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearHideTimer();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {bannerState && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="fixed top-[60px] left-0 right-0 z-40 pointer-events-none"
        >
          <div className={`flex items-center justify-center gap-2 px-4 py-1.5 ${
            bannerState === "offline"
              ? dark
                ? "bg-red-950/90 backdrop-blur-md border-b border-red-900"
                : "bg-red-100/90 backdrop-blur-md border-b border-red-200"
              : dark
                ? "bg-emerald-950/90 backdrop-blur-md border-b border-emerald-900"
                : "bg-emerald-100/90 backdrop-blur-md border-b border-emerald-200"
          }`}>
            {bannerState === "offline" ? (
              <WifiOff className={`w-4 h-4 ${dark ? "text-red-400" : "text-red-600"}`} />
            ) : (
              <Wifi className={`w-4 h-4 ${dark ? "text-emerald-400" : "text-emerald-700"}`} />
            )}
            <span className={`font-mono text-[11px] tracking-[0.16em] uppercase ${
              bannerState === "offline"
                ? dark
                  ? "text-red-300"
                  : "text-red-700"
                : dark
                  ? "text-emerald-300"
                  : "text-emerald-700"
            }`}>
              {bannerState === "offline" ? "You're Offline" : "You're Back Online!"}
            </span>
            {bannerState === "offline" && (
              <span className={`text-[11px] font-light ${
                dark ? "text-red-300/70" : "text-red-600/70"
              }`}>
                Things may not work properly
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
