import React from "react";
import { motion } from "framer-motion";

interface AnimatedLogoProps {
  size?: number; // px
  className?: string;
}

/**
 * AnimatedLogo: SVG stroke-draw rings with a logo image fade-in.
 * Includes a white circular container and a gentle pulsing halo.
 */
const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ size = 140, className }) => {
  const radiusOuter = 64;
  const radiusInner = 46;
  const center = 80; // viewBox center

  return (
    <motion.div
      className={className}
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.03 }}
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 160 160"
        width={size}
        height={size}
        role="img"
        aria-label="Knowledge Center Logo Animation"
      >
        {/* White container circle */}
        <circle cx={center} cy={center} r={72} fill="#ffffff" stroke="rgba(17,24,39,0.06)" strokeWidth={1} />

        {/* Faint background glow + brand gradients */}
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="kcSweep" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--kc-red))" />
            <stop offset="100%" stopColor="hsl(var(--kc-blue))" />
          </linearGradient>
        </defs>
        <circle cx={center} cy={center} r={70} fill="url(#glow)" opacity="0" />

        {/* Pulsing halo */}
        <motion.circle
          cx={center}
          cy={center}
          r={radiusOuter + 6}
          fill="none"
          style={{ stroke: 'hsl(var(--kc-blue))' }}
          strokeOpacity={0.22}
          strokeWidth={6}
          initial={{ scale: 1, opacity: 0.16 }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.16, 0.28, 0.16] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
        />

        {/* Outer ring draw */}
        {/* kept disabled for a cleaner look */}

        {/* Inner ring draw, delayed */}
        <motion.circle
          cx={center}
          cy={center}
          r={radiusInner}
          fill="none"
          style={{ stroke: 'hsl(var(--kc-red))' }}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={Math.PI * 2 * radiusInner}
          strokeDashoffset={Math.PI * 2 * radiusInner}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0], strokeDashoffset: [Math.PI * 2 * radiusInner, 0, Math.PI * 2 * radiusInner] }}
          transition={{ duration: 4.2, delay: 0.4, ease: [0.22, 1, 0.36, 1], repeat: Infinity }}
        />

        {/* Rotating accent ring with dashes */}
        <motion.circle
          cx={center}
          cy={center}
          r={radiusOuter - 10}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={0.9}
          strokeWidth={1.5}
          strokeDasharray="3 8"
          style={{ originX: center, originY: center }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 16, ease: "linear", delay: 1 }}
        />

        {/* Orbiting dots */}
        <motion.g
          style={{ originX: center, originY: center }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear", delay: 0.8 }}
        >
          <circle cx={center + radiusInner} cy={center} r={2.8} fill="hsl(var(--kc-blue))" />
          <circle cx={center - radiusInner} cy={center} r={2.4} fill="hsl(var(--kc-red))" />
        </motion.g>

        {/* Rotating sweep arc in brand gradient */}
        <motion.g
          style={{ originX: center, originY: center }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 18, ease: 'linear', delay: 0.6 }}
        >
          <circle
            cx={center}
            cy={center}
            r={radiusOuter - 4}
            fill="none"
            stroke="url(#kcSweep)"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeDasharray="70 320"
          />
        </motion.g>

        {/* Reveal exact vector logo.svg with an animated mask so it looks hand-drawn */}
        <defs>
          <mask id="logo-reveal-mask">
            <motion.rect
              x={center - 40}
              y={center - 40}
              width={80}
              height={80}
              fill="white"
              initial={{ width: 0 }}
              animate={{ width: [0, 80, 0] }}
              transition={{ duration: 4.2, ease: [0.22, 1, 0.36, 1], delay: 0.6, repeat: Infinity }}
            />
          </mask>
        </defs>
        <g mask="url(#logo-reveal-mask)">
          <image
            href="/logo.svg"
            x={center - 36}
            y={center - 36}
            width={72}
            height={72}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </svg>
    </motion.div>
  );
};

export default AnimatedLogo;
