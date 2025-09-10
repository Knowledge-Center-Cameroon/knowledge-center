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

const CountdownCard: React.FC<{ label: string; value: number }> = ({ label, value }) => {
  return (
    <motion.div
      className="relative rounded-2xl p-4 sm:p-5 bg-white/10 backdrop-blur-md border border-white/20 text-white min-w-[80px] sm:min-w-[100px]"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="absolute inset-0 rounded-2xl -z-10 opacity-40"
           style={{ background: "linear-gradient(135deg, hsl(var(--kc-blue)), hsl(var(--kc-red)))" }} />
      <div className="text-3xl sm:text-4xl font-bold leading-none text-center">{pad(value)}</div>
      <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-wider text-center opacity-90">{label}</div>
    </motion.div>
  );
};

const Countdown: React.FC = () => {
  const { diff, days, hours, minutes, seconds } = useCountdown(targetDate);
  const over = diff <= 0;

  return (
    <section className="relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/20 bg-gradient-to-br from-white/60 via-white/30 to-white/20 backdrop-blur-xl">
          {/* Decorative orbs */}
          <div className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-gradient-to-br from-kc-blue/35 to-kc-red/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-gradient-to-tr from-kc-red/35 to-kc-blue/25 blur-3xl" />

          <div className="relative px-6 py-8 sm:px-10 sm:py-12">
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
                <div className="mt-6 sm:mt-8 flex items-stretch gap-3 sm:gap-4">
                  <CountdownCard label="Days" value={days} />
                  <CountdownCard label="Hours" value={hours} />
                  <CountdownCard label="Minutes" value={minutes} />
                  <CountdownCard label="Seconds" value={seconds} />
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
