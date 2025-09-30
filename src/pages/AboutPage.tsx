import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import About from "@/components/About";
import { useParallax } from "@/hooks/use-parallax";

const AboutPage: React.FC = () => {
  const { scrollY } = useScroll();
  const { ref: heroRef, y } = useParallax(40);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen relative"
    >
      {/* Hero Section with Parallax */}
      <motion.div 
        ref={heroRef as any}
        className="relative h-[50vh] overflow-hidden flex items-center justify-center bg-gradient-to-br from-kc-blue/20 via-transparent to-kc-red/20 mb-16"
      >
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y }}
        >
          <div className="absolute inset-0 bg-grid-white/10" />
        </motion.div>
        
        <motion.div 
          className="relative z-10 text-center"
          style={{ y: useTransform(scrollY, [0, 300], [0, 50]) }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our Story
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            A journey of empowering young minds through scientific discovery and innovation
          </motion.p>
        </motion.div>
      </motion.div>
      
      <div className="container mx-auto px-4 lg:px-8">
        <About />
      </div>
    </motion.div>
  );
};

export default AboutPage;
