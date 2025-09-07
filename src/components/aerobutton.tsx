import React from "react";
import { Send } from "lucide-react";
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
}) => {
  const sweepWidth = Math.max(0, Math.min(100, width));

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-3 sm:px-7 sm:py-3.5 font-semibold transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        disabled ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg active:scale-[0.99]",
        className
      )}
      style={{ color: "#fff" }}
    >
      {/* Base */}
      <span
        className="absolute inset-0 rounded-full"
        style={{ background: primaryCol }}
        aria-hidden
      />
      {/* Gradient sweep */}
      <span
        className="absolute inset-y-0 left-0 rounded-full translate-x-[-120%] group-hover:translate-x-[0%] transition-transform duration-300 ease-out"
        style={{
          width: `${sweepWidth}%`,
          background: `linear-gradient(90deg, ${gradientCol}, ${primaryCol})`,
        }}
        aria-hidden
      />
      {/* Gloss highlight */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full opacity-30"
        style={{
          background:
            "linear-gradient( to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0.05))",
        }}
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
            <Send className="h-4 w-4" />
            <span>{text}</span>
          </>
        )}
      </span>
    </button>
  );
};

export default AeroButton;
