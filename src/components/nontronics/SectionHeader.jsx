import { motion } from "framer-motion";

export default function SectionHeader({ number, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-10 md:mb-14"
    >
      <div className="flex items-center gap-4 mb-3">
        {number && (
          <span className="font-mono text-[11px] tracking-[0.14em] text-primary">{number}</span>
        )}
        <div className="h-px flex-1 bg-border" />
      </div>
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-[0.02em] text-foreground leading-[0.96]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-muted-foreground font-light text-sm md:text-base max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}