import React from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import AboutKC from "@/components/AboutKC";
import Countdown from "@/components/Countdown";
import Stats from "@/components/Stats";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import { useSeo } from "@/hooks/useSeo";
import { BookOpen, Microscope, Rocket, Users } from "lucide-react";

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

      <motion.section {...fadeUp} className="py-6 md:py-8 bg-white border-y border-border/60">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { icon: Microscope, label: "STEM Learning" },
              { icon: Users, label: "Mentorship" },
              { icon: BookOpen, label: "Programs" },
              { icon: Rocket, label: "Innovation" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-white py-3 px-3">
                <item.icon className="h-4 w-4 text-kc-blue" />
                <span className="text-xs md:text-sm font-semibold text-kc-blue">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About KC Section: Brand story and mission */}
      <motion.section {...fadeUp} className="bg-white">
        <AboutKC />
      </motion.section>

      {/* Stats Section: Impact metrics */}
      <motion.section {...fadeUp}>
        <Stats />
      </motion.section>

      {/* Projects Section: Showcase of work */}
      <motion.section {...fadeUp} className="bg-white">
        <Projects />
      </motion.section>

      {/* Testimonials Section: Social proof */}
      <motion.section {...fadeUp}>
        <Testimonials />
      </motion.section>

      {/* Countdown Section: Upcoming event */}
      <motion.section {...fadeUp} className="pt-10 md:pt-14">
        <Countdown />
      </motion.section>
    </div>
  );
};

export default Home;
