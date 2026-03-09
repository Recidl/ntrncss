import { motion } from "framer-motion";

const stats = [
  { value: "500+", label: "Devices Repaired" },
  { value: "98%", label: "Success Rate" },
  { value: "24h", label: "Avg Turnaround" },
  { value: "5★", label: "Customer Rating" },
];

export default function StatsBar() {
  return (
    <div className="glass-panel-strong overflow-hidden accent-glow">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-6 md:p-8 text-center"
          >
            <div className="font-display text-3xl md:text-4xl text-primary mb-1">{stat.value}</div>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}