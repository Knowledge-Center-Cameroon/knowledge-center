import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, Dot } from "lucide-react";

export type TimelineItem = {
  id?: string | number;
  title: string;
  date?: string; // human-readable
  subtitle?: string;
  description?: string;
  href?: string;
};

const Item: React.FC<{ item: TimelineItem; index: number }> = ({ item, index }) => {
  return (
    <motion.li
      className="relative pl-5 sm:pl-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* line */}
      <span className="absolute left-[10px] top-0 bottom-0 w-px bg-gradient-to-b from-kc-blue/50 via-white/20 to-kc-red/50" aria-hidden />
      {/* dot */}
      <span className="absolute left-0 top-1.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white shadow">
        <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-kc-blue to-kc-red" />
      </span>

      <div className="mb-1 text-[11px] sm:text-xs uppercase tracking-wider text-foreground/60 flex items-center gap-1">
        <CalendarDays className="h-3.5 w-3.5" />
        {item.date || ""}
      </div>
      <div className="font-semibold text-foreground leading-snug sm:leading-tight text-sm sm:text-base">{item.title}</div>
      {item.subtitle && (
        <div className="text-[13px] sm:text-sm text-foreground/80 leading-snug">{item.subtitle}</div>
      )}
      {item.description && (
        <p className="mt-1 text-[13px] sm:text-sm text-foreground/70 leading-relaxed">{item.description}</p>
      )}
      {item.href && (
        <a
          href={item.href}
          className="mt-2 inline-block text-sm font-semibold text-kc-blue hover:text-kc-red transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kc-blue rounded"
        >
          Learn more →
        </a>
      )}
    </motion.li>
  );
};

const Timeline: React.FC<{ items: TimelineItem[]; title?: string; className?: string }> = ({ items, title, className }) => {
  return (
    <div className={className}>
      {title && (
        <h3 className="text-base sm:text-lg font-heading font-bold mb-3"><span className="text-kc-blue">{title}</span></h3>
      )}
      <ul className="relative space-y-4 sm:space-y-5">
        {items.map((it, i) => (
          <Item key={it.id ?? i} item={it} index={i} />
        ))}
      </ul>
    </div>
  );
};

export default Timeline;
