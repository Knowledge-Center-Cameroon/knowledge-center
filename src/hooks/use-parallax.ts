import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

export type ParallaxReturn = {
  ref: React.RefObject<HTMLElement>;
  y: MotionValue<number>;
};

/**
 * useParallax: simple, performant parallax for a section header or hero.
 * - strength: px travel from top to bottom of viewport (default 40)
 * - offset: motion offset config for finer control
 */
export function useParallax(
  strength: number = 40
): ParallaxReturn {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // as-const tuple satisfies Framer's ScrollOffset type without widening
    offset: ["start end", "end start"] as const,
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, strength]);
  return { ref, y };
}

export const Parallax = motion.div;
