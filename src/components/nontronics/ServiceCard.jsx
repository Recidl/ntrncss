import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ServiceCard({ title, description, image, tags, link, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={createPageUrl(link)} className="group block relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300">
        {/* Background image */}
        <div className="relative h-72 md:h-80 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Glass overlay on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(4px)'}} />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="font-display text-2xl md:text-3xl tracking-wide text-foreground mb-2">
                {title}
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm font-light leading-relaxed max-w-xs">
                {description}
              </p>
              {tags && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag) => (
                    <span key={tag} className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground border border-border px-2 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}