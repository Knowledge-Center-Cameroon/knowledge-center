import React from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import AboutKC from "@/components/AboutKC";
import Countdown from "@/components/Countdown";
import Stats from "@/components/Stats";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import { useSeo } from "@/hooks/useSeo";

/**
 * Home Page - Landing page with hero, about, stats, projects, testimonials
 * 
 * SEO Structure:
 * - H1: Primary page heading (Hero section)
 * - H2: Section headings (About, Stats, Projects, etc.)
 * - Proper section hierarchy for screen readers
 * - Structured data for rich snippets
 * 
 * Design:
 * - Montserrat font for body text
 * - Poppins font for headings
 * - Blue, red, black color palette
 * - Consistent spacing and whitespace
 * - Smooth fade-up animations
 */

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

const Home: React.FC = () => {
  useSeo({
    title: "Knowledge Center | STEM Education in Cameroon",
    description:
      "Knowledge Center Cameroon is a premier non-profit STEM hub in Buea empowering young Cameroonians through tutoring, competitions, hands-on programs, and mentorship.",
  });

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className="space-y-0">
      {/* Hero Section: Primary visual introduction */}
      <motion.section {...fadeUp}>
        <Hero />
      </motion.section>

      {/* About KC Section: Brand story and mission */}
      <motion.section
        {...fadeUp}
        className="bg-gradient-subtle py-16 md:py-20 lg:py-24"
      >
        <AboutKC />
      </motion.section>

      {/* Stats Section: Impact metrics */}
      <motion.section {...fadeUp} className="section-padding">
        <Stats />
      </motion.section>

      {/* Projects Section: Showcase of work */}
      <motion.section
        {...fadeUp}
        className="bg-gradient-subtle section-padding"
      >
        <Projects />
      </motion.section>

      {/* Testimonials Section: Social proof */}
      <motion.section {...fadeUp} className="section-padding">
        <Testimonials />
      </motion.section>

      {/* Countdown Section: Upcoming event */}
      <motion.section {...fadeUp} className="section-padding-lg">
        <Countdown />
      </motion.section>
    </div>
  );
};

export default Home;
