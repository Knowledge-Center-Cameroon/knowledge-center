import React from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import AboutKC from "@/components/AboutKC";
import Countdown from "@/components/Countdown";
import Stats from "@/components/Stats";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import { useSeo } from "@/hooks/useSeo";
import { BookOpen, Microscope, Rocket, Users, Bell, CalendarDays, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

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
              <div key={item.label} className="flex items-center justify-center gap-2 rounded-2xl border border-kc-blue/10 ring-1 ring-kc-blue/5 bg-white/95 py-3 px-3 shadow-sm">
                <item.icon className="h-4 w-4 text-kc-blue" />
                <span className="text-xs md:text-sm font-semibold text-kc-blue">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* GSP Applications Banner */}
      <motion.section
        {...fadeUp}
        className="container mx-auto px-4 lg:px-8 max-w-6xl py-4"
      >
        <div className="rounded-2xl border border-kc-blue/20 bg-white/95 p-4 shadow-sm ring-1 ring-kc-blue/5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-kc-blue text-white">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">Global Scholars Program applications are open</h2>
                  <Badge className="rounded-full bg-kc-blue text-white hover:bg-kc-blue">Accepting applications</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Students can start or continue their KC Global Scholars Program application from the portal.
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs font-medium text-kc-blue">
                  <CalendarDays className="h-4 w-4" />
                  Current program cycle
                </div>
              </div>
            </div>
            <Button asChild variant="blue" className="rounded-full gap-2">
              <Link to="/gsp/application">
                Apply now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
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
