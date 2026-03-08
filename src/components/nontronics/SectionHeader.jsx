import { motion } from "framer-motion";

export default function SectionHeader({ number, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-12 md:mb-16"
    >
      <div className="flex items-center gap-4 mb-4">
        {number && (
          <span className="font-mono text-xs tracking-[0.15em] text-primary">{number}</span>
        )}
        <div className="h-px flex-1 bg-border" />
      </div>
      <h2 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wide text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-muted-foreground font-light text-sm md:text-base max-w-xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}