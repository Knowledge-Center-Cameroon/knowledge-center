import React from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import Stats from "@/components/Stats";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

const Home: React.FC = () => {
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);
  return (
    <div className="space-y-16 lg:space-y-24">
      <motion.section {...fadeUp}>
        <Hero />
      </motion.section>
      <motion.section {...fadeUp}>
        <Stats />
      </motion.section>
      <motion.section {...fadeUp}>
        <Projects />
      </motion.section>
      <motion.section {...fadeUp}>
        <Testimonials />
      </motion.section>
      <motion.section {...fadeUp}>
        <Countdown />
      </motion.section>
    </div>
  );
};

export default Home;
