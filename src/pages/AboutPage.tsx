import React from "react";
import { motion } from "framer-motion";
import About from "@/components/About";
import { useParallax } from "@/hooks/use-parallax";
import { useSeo } from "@/hooks/useSeo";

/**
 * About Page - Organization story, mission, values, and team
 * 
 * SEO Structure:
 * - H1: "About Knowledge Center"
 * - H2: Section headings (Mission, Team, Values, etc.)
 * - Semantic article/section elements
 * - Proper image alt text with context
 * 
 * Design:
 * - Montserrat body text, Poppins headings
 * - Blue/red accent colors
 * - Consistent spacing and section padding
 * - Smooth fade-in animation
 */
const AboutPage: React.FC = () => {
  const { ref: heroRef, y } = useParallax(40);
  
  useSeo({
    title: "About Knowledge Center | STEM Education in Cameroon",
    description:
      "Discover Knowledge Center's mission to build future-ready STEM leaders through innovative programs, mentorship, and hands-on learning in Buea, Cameroon.",
  });
  
  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen w-full"
    >
      {/* Main content container with consistent padding */}
      <div className="container-wide" ref={heroRef}>
        <About />
      </div>
    </motion.article>
  );
};

export default AboutPage;
