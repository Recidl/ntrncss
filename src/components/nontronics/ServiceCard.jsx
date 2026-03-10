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
      <Link to={createPageUrl(link)} className="group block relative overflow-hidden border border-white/10 shadow-[0_8px_22px_-18px_rgba(0,0,0,0.7)] hover:shadow-[0_16px_34px_-20px_rgba(0,0,0,0.8)] transition-shadow duration-300">
        {/* Background image */}
        <div className="relative h-72 md:h-80 overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Always dark gradient overlay - not affected by theme */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Glass overlay on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(4px)'}} />
        </div>

        {/* Content - Always dark mode styling */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex items-end justify-between">
            <div>
              {/* Always white text for service cards */}
              <h3 className="font-display text-2xl md:text-3xl tracking-[0.02em] text-white mb-2">
                {title}
              </h3>
              {/* Always light gray text */}
              <p className="text-gray-300 text-xs md:text-sm font-light leading-relaxed max-w-xs">
                {description}
              </p>
              {tags && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag) => (
                    <span key={tag} className="font-mono text-[10px] tracking-wider uppercase text-gray-400 border border-white/20 px-2 py-1 bg-black/20">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {/* Always white border and icon */}
            <div className="w-10 h-10 border border-white/30 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
              <ArrowRight className="w-4 h-4 text-white group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}