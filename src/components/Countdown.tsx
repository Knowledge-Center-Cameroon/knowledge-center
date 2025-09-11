import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Sparkles } from "lucide-react";

const pad = (n: number) => n.toString().padStart(2, "0");

const targetDate = new Date("2025-12-29T00:00:00");

const useCountdown = (to: Date) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return useMemo(() => {
    const diff = Math.max(0, to.getTime() - now.getTime());
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { diff, days, hours, minutes, seconds };
  }, [now, to]);
};

const CountdownCard: React.FC<{ label: string; value: number; variant: "blue" | "red" }> = ({ label, value, variant }) => {
  const bg = variant === "blue" ? "bg-kc-blue" : "bg-kc-red";
  return (
    <motion.div
      className={`relative rounded-xl sm:rounded-2xl p-3 sm:p-5 ${bg} text-white min-w-[72px] sm:min-w-[96px] shadow-lg`}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="text-2xl sm:text-4xl font-bold leading-none text-center tabular-nums">{pad(value)}</div>
      <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-wider text-center/90 opacity-95">{label}</div>
    </motion.div>
  );
};

const Countdown: React.FC = () => {
  const { diff, days, hours, minutes, seconds } = useCountdown(targetDate);
  const over = diff <= 0;

  return (
    <section className="relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/20 bg-white/60 backdrop-blur-xl">
          {/* Decorative accents */}
          <div className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-kc-blue/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-kc-red/15 blur-3xl" />

          <div className="relative px-5 py-7 sm:px-10 sm:py-12">
            <div className="flex flex-col items-center text-center text-neutral-900">
              <div className="inline-flex items-center gap-2 bg-white text-kc-black rounded-full px-3 py-1 text-xs font-semibold mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                National STEM Competition
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold">
                Countdown to <span className="text-kc-blue">December 29</span>, <span className="text-kc-red">2025</span>
              </h2>
              <p className="mt-2 text-sm sm:text-base text-foreground/80 max-w-2xl">
                Join us for a national celebration of ideas, teamwork, and invention. Get your teams ready!
              </p>

              {/* Countdown Row */}
              {!over ? (
                <div className="mt-6 sm:mt-8 flex flex-wrap items-stretch justify-center gap-2.5 sm:gap-4" role="timer" aria-live="polite">
                  <CountdownCard label="Days" value={days} variant="blue" />
                  <CountdownCard label="Hours" value={hours} variant="red" />
                  <CountdownCard label="Minutes" value={minutes} variant="blue" />
                  <CountdownCard label="Seconds" value={seconds} variant="red" />
                </div>
              ) : (
                <div className="mt-6 sm:mt-8 text-lg font-semibold text-kc-blue">
                  The competition is live today!
                </div>
              )}

              {/* CTA */}
              <div className="mt-7 sm:mt-9">
                <a
                  href="/projects/stem-education"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-kc-blue text-white font-semibold shadow hover:bg-kc-red transition-colors"
                >
                  <CalendarDays className="h-4 w-4" />
                  Event details
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Countdown;
