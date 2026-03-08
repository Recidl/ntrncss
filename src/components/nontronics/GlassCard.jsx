import { motion } from "framer-motion";

export default function GlassCard({ children, className = "", hover = true, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={`glass-panel rounded-xl p-6 md:p-8 ${hover ? "hover:bg-white/80 transition-all duration-300 hover:shadow-md" : ""} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}