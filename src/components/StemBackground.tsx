import React, { useEffect, useRef } from "react";
import { Atom, FlaskConical, CircuitBoard, Cog } from "lucide-react";

interface StemBackgroundProps {
  density?: number; // number of particles
  speed?: number; // base speed multiplier
  lineDistance?: number; // max distance to connect lines
  opacity?: number; // opacity of the whole background
  color?: string; // particle color
  lineColor?: string; // line color
  showIcons?: boolean; // whether to show floating icons
  className?: string; // extra classes for the wrapper
}

const StemBackground: React.FC<StemBackgroundProps> = ({
  density = 40,
  speed = 0.6,
  lineDistance = 120,
  opacity = 0.6,
  color = "hsla(214, 100%, 60%, 0.9)", // brand-ish blue
  lineColor = "hsla(214, 100%, 60%, 0.2)",
  showIcons = true,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = parentRef.current;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let width = (canvas.width = parent.clientWidth);
    let height = (canvas.height = parent.clientHeight);

    const mediaReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmall = window.matchMedia('(max-width: 640px)').matches;

    // Auto scale density by container area (baseline 1200x800 => multiplier ~1)
    const area = Math.max(1, width * height);
    const baseline = 1200 * 800;
    const scale = Math.min(1.3, Math.max(0.5, Math.sqrt(area / baseline)));
    const effectiveDensity = Math.max(10, Math.round(density * scale * (isSmall ? 0.7 : 1)));
    const effectiveIcons = showIcons && !isSmall;

    let resizeTimer = 0 as unknown as number;
    const onResize = () => {
      // throttle resize to avoid layout thrash
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        width = canvas.width = parent.clientWidth;
        height = canvas.height = parent.clientHeight;
      }, 100);
    };

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
    }> = [];

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    for (let i = 0; i < effectiveDensity; i++) {
      particles.push({
        x: rand(0, width),
        y: rand(0, height),
        vx: rand(-1, 1) * speed,
        vy: rand(-1, 1) * speed,
        r: rand(1, 2.5),
      });
    }

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      // draw connections first (under points)
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < lineDistance) {
            const alpha = 1 - dist / lineDistance;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // draw particles
      ctx.fillStyle = color;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const loop = () => {
      drawFrame();
      rafId = requestAnimationFrame(loop);
    };

    if (mediaReduced) {
      // Respect reduced motion: draw once, no animation
      drawFrame();
    } else {
      rafId = requestAnimationFrame(loop);
    }

    const onVisibility = () => {
      if (mediaReduced) return;
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(loop);
      }
    };
    window.addEventListener("resize", onResize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      cancelAnimationFrame(rafId);
    };
  }, [color, density, lineColor, lineDistance, speed, showIcons]);

  return (
    <div ref={parentRef} className={`pointer-events-none absolute inset-0 ${className}`} style={{ opacity }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/** Hide icons on small screens for performance */}
      {showIcons && (
        <div className="absolute inset-0 hidden sm:block">
          {/* Floating icons with low opacity to suggest STEM theme */}
          <Atom className="absolute top-6 left-6 w-6 h-6 text-white/15 animate-float" />
          <FlaskConical className="absolute bottom-10 left-1/4 w-7 h-7 text-white/15 animate-float" style={{ animationDuration: '3.8s' }} />
          <CircuitBoard className="absolute top-1/3 right-8 w-8 h-8 text-white/15 animate-float" style={{ animationDuration: '4.2s' }} />
          <Cog className="absolute bottom-6 right-10 w-7 h-7 text-white/15 animate-float" style={{ animationDuration: '3.5s' }} />
        </div>
      )}
    </div>
  );
};

export default StemBackground;
