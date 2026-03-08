import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function ServiceDetailCard({ title, description, image, features, index = 0 }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-2xl border border-border shadow-sm ${
        isEven ? "" : "lg:[direction:rtl]"
      }`}
    >
      {/* Image */}
      <div className="relative h-64 lg:h-auto min-h-[320px] overflow-hidden lg:[direction:ltr]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="glass-panel p-8 md:p-12 flex flex-col justify-center lg:[direction:ltr]">
        <h3 className="font-display text-3xl md:text-4xl tracking-wide text-foreground mb-4">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm font-light leading-relaxed mb-8">
          {description}
        </p>

        {features && (
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center mt-0.5 shrink-0">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-foreground text-sm font-light">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}