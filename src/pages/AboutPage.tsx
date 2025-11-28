import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import About from "@/components/About";
import { useParallax } from "@/hooks/use-parallax";
import { useSeo } from "@/hooks/useSeo";

const AboutPage: React.FC = () => {
  const { scrollY } = useScroll();
  const { ref: heroRef, y } = useParallax(40);
  useSeo({
    title: "About Knowledge Center Cameroon",
    description:
      "Learn about Knowledge Center Cameroon, our mission to build future-ready STEM leaders, and the team behind our programs in Buea.",
  });
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen relative"
    >

      
      <div className="container mx-auto px-4 lg:px-8">
        <About />
      </div>
    </motion.div>
  );
};

export default AboutPage;
