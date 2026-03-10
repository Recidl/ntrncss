import { motion } from "framer-motion";

export default function GlassCard({ children, className = "", hover = true, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={`glass-panel p-6 md:p-8 ${hover ? "transition-all duration-300 hover:-translate-y-[1px] hover:border-primary/20 hover:shadow-[0_10px_24px_-16px_hsl(var(--foreground)/0.35)]" : ""} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}