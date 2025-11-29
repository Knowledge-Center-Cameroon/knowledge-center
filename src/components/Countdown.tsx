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

const Digit: React.FC<{ d: string }> = ({ d }) => (
  <motion.span
    key={d}
    initial={{ y: -6, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 6, opacity: 0 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    className="inline-block"
  >
    {d}
  </motion.span>
);

const CountdownCard: React.FC<{ label: string; value: number; variant: "blue" | "red" }> = ({ label, value, variant }) => {
  const base = variant === "blue" ? "bg-kc-blue" : "bg-kc-red";
  const val = pad(value);
  const tens = val[0];
  const ones = val[1];
  return (
    <div
      className={`relative rounded-xl sm:rounded-2xl ${base} text-white min-w-[70px] sm:min-w-[96px] h-24 sm:h-28 shadow-lg overflow-hidden`}
    >
      {/* Top darker half (50%) */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-black/25" />
      {/* Number, animate digits independently */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl sm:text-4xl font-bold leading-none tabular-nums select-none tracking-tight">
          <Digit d={tens} />
          <Digit d={ones} />
        </span>
      </div>
      {/* Label */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs uppercase tracking-wider opacity-95 select-none">
        {label}
      </div>
    </div>
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

          <div className="relative px-4 py-7 sm:px-8 sm:py-11">
            <div className="flex flex-col items-center text-center text-neutral-900 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white text-kc-black rounded-full px-3 py-1 text-xs font-semibold mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                National STEM Competition
              </div>
              <h2 className="text-xl sm:text-3xl font-heading font-bold leading-tight">
                Countdown to <span className="text-kc-blue">December 29</span>, <span className="text-kc-red">2025</span>
              </h2>
              <p className="mt-2 text-sm sm:text-base text-foreground/80 max-w-2xl">
                Join us for a national celebration of ideas, teamwork, and invention. Get your teams ready!
              </p>

              {/* Countdown Row */}
              {!over ? (
                <>
                  <div className="mt-6 sm:mt-8 flex flex-wrap items-stretch justify-center gap-2 sm:gap-3.5" role="timer" aria-live="polite">
                    <CountdownCard label="Days" value={days} variant="blue" />
                    <CountdownCard label="Hours" value={hours} variant="red" />
                    <CountdownCard label="Minutes" value={minutes} variant="blue" />
                    <CountdownCard label="Seconds" value={seconds} variant="red" />
                  </div>
                  {/* Seconds progress */}
                  <div className="mt-4 w-full max-w-md">
                    <div className="h-1.5 w-full rounded bg-black/10 overflow-hidden">
                      <div
                        className="h-full bg-kc-blue transition-[width] duration-500 ease-out"
                        style={{ width: `${(seconds / 60) * 100}%` }}
                      />
                    </div>
                    <div className="mt-1 text-[11px] text-foreground/70">Next minute in {pad(60 - seconds)}s</div>
                  </div>
                </>
              ) : (
                <div className="mt-6 sm:mt-8 text-lg font-semibold text-kc-blue">
                  The competition is live today!
                </div>
              )}

              {/* CTA */}
              <div className="mt-7 sm:mt-9 w-full flex justify-center">
                <a
                  href="/projects/stem"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full px-5 py-2.5 bg-kc-blue text-white font-semibold shadow hover:bg-kc-red transition-colors text-sm sm:text-base"
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
