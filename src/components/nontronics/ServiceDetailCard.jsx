import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MousePointerClick } from "lucide-react";
import { createPortal } from "react-dom";

export default function ServiceDetailCard({
  title,
  description,
  image,
  features,
  serviceLabel,
  categoryLabel,
  index = 0,
  onSelect,
}) {
  const featurePreview = Array.isArray(features) ? features.slice(0, 3).join(" • ") : "";
  const featureTickerText = featurePreview ? `${featurePreview}   •   ` : "";
  const featureViewportRef = useRef(null);
  const featureTextRef = useRef(null);
  const activationTimerRef = useRef(null);
  const [isFeatureOverflowing, setIsFeatureOverflowing] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const isInteractive = typeof onSelect === "function";
  const resolvedCategoryLabel = (categoryLabel || title || "Selected Category").trim();
  const resolvedServiceLabel = (serviceLabel || "Selected Service").trim();

  useEffect(() => {
    if (!featurePreview) {
      setIsFeatureOverflowing(false);
      return;
    }

    const textElement = featureTextRef.current;
    const viewportElement = featureViewportRef.current;
    if (!textElement || !viewportElement) {
      return;
    }

    const checkOverflow = () => {
      const textWidth = textElement.getBoundingClientRect().width;
      const viewportWidth = viewportElement.getBoundingClientRect().width;
      setIsFeatureOverflowing(textWidth > viewportWidth + 2);
    };

    checkOverflow();
    requestAnimationFrame(checkOverflow);
    setTimeout(checkOverflow, 250);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(checkOverflow);
    }

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(checkOverflow)
      : null;

    if (resizeObserver) {
      resizeObserver.observe(textElement);
      resizeObserver.observe(viewportElement);
    }

    window.addEventListener("resize", checkOverflow);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("resize", checkOverflow);
    };
  }, [featurePreview]);

  useEffect(() => {
    return () => {
      if (activationTimerRef.current) {
        clearTimeout(activationTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!showConfirmModal) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowConfirmModal(false);
        setIsActivating(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showConfirmModal]);

  const handleActivate = () => {
    if (!isInteractive || isActivating) return;

    setIsActivating(true);
    setShowConfirmModal(true);
  };

  const handleConfirmNavigation = () => {
    if (!isInteractive) return;
    setShowConfirmModal(false);
    onSelect();
    setIsActivating(false);
  };

  const handleRejectNavigation = () => {
    setShowConfirmModal(false);
    setIsActivating(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={isInteractive ? { y: -4, scale: 1.01 } : undefined}
        whileTap={isInteractive ? { scale: 0.995 } : undefined}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onClick={isInteractive ? handleActivate : undefined}
        onKeyDown={isInteractive ? (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleActivate();
          }
        } : undefined}
        className={`group grid grid-cols-[96px_1fr] md:grid-cols-[132px_1fr] items-stretch overflow-hidden border shadow-sm transition-all duration-300 ${
          isInteractive
            ? `cursor-pointer border-border/80 hover:border-primary/70 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.35),0_14px_40px_-18px_hsl(var(--primary)/0.65)] focus-visible:outline-none focus-visible:border-primary/80 focus-visible:shadow-[0_0_0_2px_hsl(var(--primary)/0.45)] ${isActivating ? "border-primary/90 shadow-[0_0_0_2px_hsl(var(--primary)/0.5),0_18px_45px_-20px_hsl(var(--primary)/0.85)]" : ""}`
            : "border-border"
        }`}
        data-selected={isActivating ? "true" : "false"}
        aria-label={isInteractive ? `Select ${title}` : undefined}
      >
      {/* Image */}
      <div className="relative h-full min-h-[88px] md:min-h-[96px] overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
            isInteractive ? "group-hover:scale-105" : ""
          }`}
        />
        <div className={`absolute inset-0 bg-gradient-to-r transition-colors duration-300 ${
          isInteractive
            ? isActivating
              ? "from-primary/55 via-primary/25 to-transparent"
              : "from-black/35 via-black/10 to-transparent group-hover:from-primary/40"
            : "from-black/25 to-transparent"
        }`} />
        {isInteractive ? (
          <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm border border-primary/40 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-primary">
            Pick Service
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="glass-panel min-w-0 px-3 md:px-4 py-2 flex flex-col justify-center">
        <h3 className="font-display text-lg md:text-xl tracking-wide text-foreground leading-none">
          {title}
        </h3>
        <p className="text-muted-foreground text-xs md:text-sm font-light leading-snug mt-1">
          {description}
        </p>
        {featurePreview ? (
          <div
            ref={featureViewportRef}
            className={`mt-2 min-w-0 overflow-hidden ${isFeatureOverflowing ? "feature-ticker-mask" : ""}`}
          >
            <div
              className={`feature-ticker-track text-[10px] md:text-xs uppercase tracking-[0.08em] text-primary/90 ${
                isFeatureOverflowing ? "is-overflowing" : ""
              }`}
            >
              <span ref={featureTextRef} className="feature-ticker-item">{featureTickerText}</span>
              {isFeatureOverflowing ? (
                <span className="feature-ticker-item" aria-hidden="true">{featureTickerText}</span>
              ) : null}
            </div>
          </div>
        ) : null}
        {isInteractive ? (
          <div className="mt-2 inline-flex items-center gap-2 text-[10px] md:text-[11px] font-mono uppercase tracking-[0.18em] text-primary/85 group-hover:text-primary transition-colors">
            <MousePointerClick className="w-3.5 h-3.5" />
            {isActivating ? "Opening contact" : "Select and request"}
          </div>
        ) : null}
      </div>
      </motion.div>

      {typeof document !== "undefined"
        ? createPortal(
          <AnimatePresence>
            {showConfirmModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[120] bg-background/70 dark:bg-black/70 backdrop-blur-md grid place-items-center p-4"
                onClick={handleRejectNavigation}
              >
                <motion.div
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.98, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-2xl glass-panel-strong border border-border p-6 md:p-8"
                  onClick={(event) => event.stopPropagation()}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Service selection confirmation"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Confirm Selection</p>
                  <h3 className="mt-3 font-display text-2xl md:text-3xl tracking-wide text-foreground">
                    We will now take you to fill out a form of {" "}
                    <span className="inline-block align-middle px-2 py-1 border border-primary/45 bg-primary/15 text-foreground text-[0.58em] md:text-[0.5em] font-mono uppercase tracking-[0.14em]">
                      {resolvedCategoryLabel}
                    </span>{" "}
                    for {" "}
                    <span className="inline-block align-middle px-2 py-1 border border-primary/45 bg-primary/15 text-foreground text-[0.58em] md:text-[0.5em] font-mono uppercase tracking-[0.14em]">
                      {resolvedServiceLabel}
                    </span>
                    .
                  </h3>
                  <p className="mt-4 text-sm text-muted-foreground font-light">
                    Continue to the contact form to submit your details, or cancel to stay on this page.
                  </p>

                  <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleRejectNavigation}
                      className="h-11 bg-background text-foreground border border-border hover:bg-secondary text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmNavigation}
                      className="h-11 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4" />
                      Take me there!
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )
        : null}
    </>
  );
}