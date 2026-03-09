import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function ServiceDetailCard({ title, description, image, features, index = 0 }) {
  const featurePreview = Array.isArray(features) ? features.slice(0, 3).join(" • ") : "";
  const featureTickerText = featurePreview ? `${featurePreview}   •   ` : "";
  const featureViewportRef = useRef(null);
  const featureTextRef = useRef(null);
  const [isFeatureOverflowing, setIsFeatureOverflowing] = useState(false);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="grid grid-cols-[96px_1fr] md:grid-cols-[132px_1fr] items-stretch overflow-hidden border border-border shadow-sm"
    >
      {/* Image */}
      <div className="relative h-full min-h-[88px] md:min-h-[96px] overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 to-transparent" />
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
      </div>
    </motion.div>
  );
}