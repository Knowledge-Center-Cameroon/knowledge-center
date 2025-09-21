import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type ArrowButtonProps = {
  text: string;
  bgPrimaryColor: string; // initial background
  bgSecondaryColor: string; // hover/active background sweep
  textPrimaryColor: string; // initial text color
  textSecondaryColor: string; // text color on hover
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

/**
 * Animated CTA button with a color sweep and moving arrow.
 * - Accepts hex/rgb colors via props for easy theme control.
 * - If `href` is provided, renders a Link; otherwise renders a button.
 */
export const ArrowButton: React.FC<ArrowButtonProps> = ({
  text,
  bgPrimaryColor,
  bgSecondaryColor,
  textPrimaryColor,
  textSecondaryColor,
  className,
  href,
  onClick,
  type = "button",
  disabled = false,
}) => {
  const base = (
    <span
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-3 sm:px-7 sm:py-3.5 font-semibold transition-[transform,box-shadow] duration-300",
        "shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.45)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        disabled ? "opacity-70 cursor-not-allowed" : "",
        className
      )}
      style={{ color: textPrimaryColor }}
      aria-disabled={disabled}
    >
      {/* Base background */}
      <span
        className="absolute inset-0 rounded-full transition-opacity duration-300"
        style={{ backgroundColor: bgPrimaryColor, opacity: disabled ? 0.6 : 1 }}
        aria-hidden
      />
      {/* Sweep overlay */}
      <span
        className={cn(
          "absolute inset-0 origin-left scale-x-0 rounded-full transition-transform duration-300 ease-out group-hover:scale-x-100 group-active:scale-x-100",
          disabled ? "pointer-events-none" : ""
        )}
        style={{ backgroundColor: bgSecondaryColor }}
        aria-hidden
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        <span className="transition-colors duration-300 group-hover:text-[color:var(--arrowbtn-text-hover)]">
          {text}
        </span>
        <ArrowRight
          className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
          style={{ color: textPrimaryColor }}
        />
      </span>

      {/* Text color swap on hover via CSS variable */}
      <style>
        {`.group:hover { --arrowbtn-text-hover: ${textSecondaryColor}; }
          .group:hover svg { color: ${textSecondaryColor}; }
        `}
      </style>
    </span>
  );

  if (href) {
    return (
      <Link
        to={href}
        onClick={onClick}
        className="inline-block focus-visible:outline-none"
        style={{ textDecoration: "none" }}
      >
        {base}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className="focus-visible:outline-none">
      {base}
    </button>
  );
};

export default ArrowButton;
