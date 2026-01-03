import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center text-center text-white bg-black">
      <div className="absolute inset-0 bg-black opacity-50" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="relative z-10 max-w-4xl mx-auto px-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          The future is here. We power the innovators building it.
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Our mission is to incubate the next generation of entrepreneurs,
          researchers, and civic leaders for the AI age.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild variant="primary" size="lg">
            <Link to="/about">Discover Our Story</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link to="/projects">Our Impact</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;