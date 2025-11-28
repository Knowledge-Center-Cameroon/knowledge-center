import React from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import AboutKC from "@/components/AboutKC";
import Countdown from "@/components/Countdown";
import Stats from "@/components/Stats";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import { useSeo } from "@/hooks/useSeo";
 

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

const Home: React.FC = () => {
  useSeo({
    title: "Empowering Young Scientists Through STEM Education",
    description:
      "Knowledge Center Cameroon is a non-profit STEM hub in Buea helping young Cameroonians fall in love with science through tutoring, competitions, and hands-on programs.",
  });
  return (
    <div className="space-y-10 lg:space-y-16">
      <motion.section {...fadeUp}>
        <Hero />
      </motion.section>
      <motion.section {...fadeUp} className="bg-gray-100 p-8 rounded-lg shadow-md">
        <AboutKC />
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
