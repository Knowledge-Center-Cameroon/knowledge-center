import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Atom, FlaskConical, Rocket, Brain } from "lucide-react";

const providedFacts = [
  "Fun fact: Bananas are naturally radioactive — proof science hides in everyday life.",
  "Fun fact: Sharks are older than trees — nature shows true resilience.",
  "Fun fact: Octopuses have three hearts — efficiency comes in unexpected forms.",
  "Fun fact: The first computer bug was a moth — small flaws can spark big lessons.",
  "Fun fact: Most internet traffic runs under the sea — solutions are often unseen.",
  "Fun fact: Your phone outpowers the Apollo 11 computer — constraints drive innovation.",
  "Fun fact: The Eiffel Tower grows taller in heat — designs should adapt, not resist.",
  "Fun fact: Velcro came from burrs — nature is the best engineer.",
  "Fun fact: Bridges can wobble with rhythm — harmony and imbalance shape systems.",
  "Fun fact: Zero changed civilization — sometimes nothing is everything.",
  "Fun fact: Prime numbers protect the internet — randomness can be strength.",
  "Fun fact: The golden ratio appears in shells and galaxies — math is nature’s design.",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.random() * (i + 1) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const useRotatingFact = (intervalMs = 2400) => {
  const [order, setOrder] = React.useState<string[]>(() => shuffle(providedFacts));
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => {
        const next = i + 1;
        if (next >= order.length) {
          // Reshuffle for the next cycle with no repetition within a cycle
          setOrder(shuffle(providedFacts));
          return 0;
        }
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, order.length]);
  return order[index];
};

const Dot: React.FC<{ delay: number }> = ({ delay }) => (
  <motion.span
    initial={{ opacity: 0.2, y: 0 }}
    animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay }}
    className="inline-block w-1.5 h-1.5 rounded-full bg-current"
  />
);

const EngagingLoader: React.FC = () => {
  const fact = useRotatingFact();
  const reduceMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <div className="container mx-auto px-4 lg:px-8 py-16">
      <div className="mx-auto max-w-xl text-center">
        {/* Brand Icons orbit */}
        <div className="relative mx-auto mb-6" style={{ width: 120, height: 120 }}>
          <motion.div
            className="absolute inset-0 rounded-full border border-black/10"
            initial={{ rotate: 0 }}
            animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
            transition={{ repeat: Infinity, ease: "linear", duration: 8 }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: [0.9, 1, 0.9] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="w-12 h-12 rounded-full bg-kc-blue text-white flex items-center justify-center shadow-lg"
            >
              <Brain className="w-6 h-6" />
            </motion.div>
          </div>
          <motion.div
            className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white rounded-full p-1 shadow"
            initial={{ rotate: 0 }}
            animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
            transition={{ repeat: Infinity, ease: "linear", duration: 8 }}
            style={{ transformOrigin: "60px 60px" }}
          >
            <Atom className="w-5 h-5 text-kc-blue" />
          </motion.div>
          <motion.div
            className="absolute -bottom-2 right-4 bg-white rounded-full p-1 shadow"
            initial={{ rotate: 180 }}
            animate={reduceMotion ? { rotate: 180 } : { rotate: 540 }}
            transition={{ repeat: Infinity, ease: "linear", duration: 8 }}
            style={{ transformOrigin: "-20px 60px" }}
          >
            <FlaskConical className="w-5 h-5 text-kc-red" />
          </motion.div>
          <motion.div
            className="absolute top-6 -left-2 bg-white rounded-full p-1 shadow"
            initial={{ rotate: -90 }}
            animate={reduceMotion ? { rotate: -90 } : { rotate: 270 }}
            transition={{ repeat: Infinity, ease: "linear", duration: 8 }}
            style={{ transformOrigin: "80px -10px" }}
          >
            <Rocket className="w-5 h-5 text-neutral-700" />
          </motion.div>
        </div>

        {/* Progress shimmer */}
        <div className="mx-auto w-full max-w-md">
          <div className="h-2 w-full rounded-full bg-black/10 overflow-hidden">
            <motion.div
              className="h-full bg-kc-blue/80"
              initial={{ x: "-100%" }}
              animate={reduceMotion ? { x: 0, width: "100%" } : { x: ["-100%", "0%", "100%"], width: ["40%", "60%", "40%"] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Caption */}
        <div className="mt-4 text-sm text-foreground/80">
          <span>Loading</span>{" "}
          <Dot delay={0} /> {" "}
          <Dot delay={0.2} /> {" "}
          <Dot delay={0.4} />
        </div>

        {/* Rotating STEM facts */}
        <div className="mt-3 h-[24px] text-xs text-muted-foreground">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={fact}
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -6, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="px-3"
            >
              {fact}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EngagingLoader;
