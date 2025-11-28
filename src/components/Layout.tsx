import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import StemBackground from "@/components/StemBackground";

const pageVariants = {
  initial: { opacity: 0, y: 12, filter: "blur(2px)" },
  in: { opacity: 1, y: 0, filter: "blur(0px)" },
  out: { opacity: 0, y: -12, filter: "blur(2px)" },
};

const pageTransition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] };

const Layout: React.FC = () => {
  const location = useLocation();
  React.useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Global STEM background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <StemBackground opacity={0.07} density={60} lineDistance={120} speed={0.4} showIcons={false} />
      </div>
      <Navigation />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={pageTransition}
          role="main"
          className={`flex-1 ${location.pathname === '/' ? 'pt-0' : 'pt-24 lg:pt-28'}`}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default Layout;
