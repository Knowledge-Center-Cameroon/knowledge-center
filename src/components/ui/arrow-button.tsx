import React from "react";
import { Button } from "./button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ArrowButtonProps {
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "red" | "blue" | "blackOutline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onClick?: () => void;
  arrowDirection?: "right" | "left";
  showArrow?: boolean;
}

export const ArrowButton: React.FC<ArrowButtonProps> = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  onClick,
  arrowDirection = "right",
  showArrow = true,
}) => {
  return (
    <motion.div
      whileHover={{ x: arrowDirection === "right" ? 4 : -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="inline-block"
    >
      <Button
        variant={variant}
        size={size}
        className={`relative overflow-hidden group ${className}`}
        onClick={onClick}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
          {showArrow && (
            <motion.div
              initial={{ x: 0, opacity: 0.7 }}
              whileHover={{
                x: arrowDirection === "right" ? 4 : -4,
                opacity: 1
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ArrowRight
                className={`h-4 w-4 transition-transform duration-200 ${
                  arrowDirection === "left" ? "rotate-180" : ""
                }`}
              />
            </motion.div>
          )}
        </span>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
      </Button>
    </motion.div>
  );
};
