import React from "react";
import { motion } from "framer-motion";
import About from "@/components/About";

const AboutPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-[60vh] pt-20 md:pt-24 lg:pt-28"
    >
      <About />
    </motion.div>
  );
};

export default AboutPage;
