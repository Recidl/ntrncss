import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { useTheme } from "./nontronics/ThemeContext";
import { SITE_NOTIFY_EVENT } from "@/lib/notify";

const VARIANT_STYLES = {
  success: {
    containerDark: "bg-emerald-950/90 backdrop-blur-md border-b border-emerald-900",
    containerLight: "bg-emerald-100/90 backdrop-blur-md border-b border-emerald-200",
    iconDark: "text-emerald-400",
    iconLight: "text-emerald-700",
    titleDark: "text-emerald-300",
    titleLight: "text-emerald-700",
    messageDark: "text-emerald-300/75",
    messageLight: "text-emerald-700/75",
  },
  error: {
    containerDark: "bg-red-950/90 backdrop-blur-md border-b border-red-900",
    containerLight: "bg-red-100/90 backdrop-blur-md border-b border-red-200",
    iconDark: "text-red-400",
    iconLight: "text-red-700",
    titleDark: "text-red-300",
    titleLight: "text-red-700",
    messageDark: "text-red-300/75",
    messageLight: "text-red-700/75",
  },
  warning: {
    containerDark: "bg-amber-950/90 backdrop-blur-md border-b border-amber-900",
    containerLight: "bg-amber-100/90 backdrop-blur-md border-b border-amber-200",
    iconDark: "text-amber-300",
    iconLight: "text-amber-700",
    titleDark: "text-amber-300",
    titleLight: "text-amber-700",
    messageDark: "text-amber-300/75",
    messageLight: "text-amber-700/75",
  },
  info: {
    containerDark: "bg-sky-950/90 backdrop-blur-md border-b border-sky-900",
    containerLight: "bg-sky-100/90 backdrop-blur-md border-b border-sky-200",
    iconDark: "text-sky-300",
    iconLight: "text-sky-700",
    titleDark: "text-sky-300",
    titleLight: "text-sky-700",
    messageDark: "text-sky-300/75",
    messageLight: "text-sky-700/75",
  },
};

const VARIANT_ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

export default function SiteNotificationDropdown() {
  const [queue, setQueue] = useState([]);
  const [active, setActive] = useState(null);
  const hideTimerRef = useRef(null);
  const { dark } = useTheme();

  useEffect(() => {
    const handleNotify = (event) => {
      const payload = event?.detail;
      if (!payload?.title) return;
      setQueue((prev) => [...prev, payload]);
    };

    window.addEventListener(SITE_NOTIFY_EVENT, handleNotify);
    return () => {
      window.removeEventListener(SITE_NOTIFY_EVENT, handleNotify);
    };
  }, []);

  useEffect(() => {
    if (active || queue.length === 0) return;
    const [next, ...rest] = queue;
    setQueue(rest);
    setActive(next);
  }, [active, queue]);

  useEffect(() => {
    if (!active) return;

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    hideTimerRef.current = setTimeout(() => {
      setActive(null);
      hideTimerRef.current = null;
    }, active.duration || 3200);

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [active]);

  return (
    <AnimatePresence>
      {active ? (() => {
        const variant = VARIANT_STYLES[active.variant] ? active.variant : "info";
        const styles = VARIANT_STYLES[variant];
        const Icon = VARIANT_ICONS[variant] || Info;

        return (
          <motion.div
            key={`${active.title}-${active.message}`}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed top-[60px] left-0 right-0 z-40 pointer-events-none"
          >
            <div
              className={`flex items-center justify-center gap-2 px-4 py-1.5 ${
                dark ? styles.containerDark : styles.containerLight
              }`}
            >
              <Icon className={`w-4 h-4 ${dark ? styles.iconDark : styles.iconLight}`} />
              <span
                className={`font-mono text-[11px] tracking-[0.16em] uppercase ${
                  dark ? styles.titleDark : styles.titleLight
                }`}
              >
                {active.title}
              </span>
              {active.message ? (
                <span
                  className={`text-[11px] font-light ${
                    dark ? styles.messageDark : styles.messageLight
                  }`}
                >
                  {active.message}
                </span>
              ) : null}
            </div>
          </motion.div>
        );
      })() : null}
    </AnimatePresence>
  );
}
