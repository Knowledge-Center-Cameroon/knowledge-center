import React from "react";
import { motion } from "framer-motion";
import Contact from "@/components/Contact";
import StemBackground from "@/components/StemBackground";
import { useParallax, Parallax } from "@/hooks/use-parallax";
import { useSeo } from "@/hooks/useSeo";

/**
 * Contact Page - Inquiry form and contact information
 * 
 * SEO Structure:
 * - H1: "Contact Us"
 * - Form with proper labels and ARIA attributes
 * - Contact information with structured data (address, phone, email)
 * - Semantic form elements
 * 
 * Design:
 * - STEM background visual element
 * - Contact form with consistent styling
 * - Responsive layout for mobile/desktop
 */
const ContactPage: React.FC = () => {
  const { ref, y } = useParallax(30);
  
  useSeo({
    title: "Contact Us | Knowledge Center Cameroon",
    description:
      "Reach out to Knowledge Center for questions about STEM programs, collaborations, donations, and partnership opportunities in Buea.",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-[60vh] relative py-12 md:py-16 lg:py-20"
    >
      {/* Decorative STEM background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <StemBackground opacity={0.08} density={40} lineDistance={120} speed={0.4} showIcons={true} />
      </div>

      {/* Content with parallax effect */}
      <Parallax ref={ref as any} style={{ y }}>
        <Contact />
      </Parallax>
    </motion.article>
  );
};

export default ContactPage;
