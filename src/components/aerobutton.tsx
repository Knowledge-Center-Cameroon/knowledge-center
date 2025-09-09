import React, { useState } from "react";
import { Send } from "lucide-react";
import { motion, type MotionStyle } from "framer-motion";
import { cn } from "@/lib/utils";

type AeroButtonProps = {
  text: string;
  width?: number; // percentage of sweep coverage (0-100)
  primaryCol: string; // base color
  gradientCol: string; // sweep color
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
};

/**
 * AeroButton: glossy gradient sweep CTA. Designed for forms (supports type=submit, disabled, loading)
 */
export const AeroButton: React.FC<AeroButtonProps> = ({
  text,
  width = 35,
  primaryCol,
  gradientCol,
  className,
  type = "button",
  disabled,
  loading,
  onClick,
  icon,
}) => {
  const sweepWidth = Math.max(0, Math.min(100, width));
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const style: MotionStyle & { [key: `--${string}`]: string | number } = {
    // allow future CSS var animations if needed
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={(e) => {
        setClicked(true);
        setTimeout(() => setClicked(false), 250);
        onClick?.();
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-3 sm:px-7 sm:py-3.5 font-semibold transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        disabled ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg active:scale-[0.99]",
        className
      )}
      style={{ color: "#fff", ...style }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Base */}
      <span className="absolute inset-0 rounded-full" style={{ background: primaryCol }} aria-hidden />

      {/* Gradient sweep */}
      <span
        className="absolute inset-y-0 left-0 rounded-full translate-x-[-120%] group-hover:translate-x-[0%] transition-transform duration-300 ease-out"
        style={{ width: `${sweepWidth}%`, background: `linear-gradient(90deg, ${gradientCol}, ${primaryCol})` }}
        aria-hidden
      />

      {/* Gloss highlight */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full opacity-30"
        style={{ background: "linear-gradient( to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0.05))" }}
        aria-hidden
      />

      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <span>{text}</span>
            <motion.span
              className="inline-flex overflow-hidden"
              animate={{
                x: hovered ? 0 : 50,
                width: hovered ? 24 : 0,
                y: clicked ? -12 : 0,
              }}
              transition={{ duration: 0.22, type: "spring", damping: 16 }}
            >
              {icon ?? <Send className="h-4 w-4" />}
            </motion.span>
          </>
        )}
      </span>
    </motion.button>
  );
};

export default AeroButton;
