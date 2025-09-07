import React from "react";
import { motion } from "framer-motion";
import { ArrowButton } from "@/components/arrowbtn";

const StemRegistrationPage: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="container mx-auto px-4 lg:px-8 py-12"
    >
      <div className="max-w-3xl">
        <h1 className="text-4xl font-heading font-bold mb-4">STEM Education Program</h1>
        <p className="text-muted-foreground mb-8">
          Register your interest in our STEM program. We will contact you with dates, curriculum, and next steps.
        </p>
        <div className="flex flex-wrap gap-3">
          <ArrowButton
            text="Start Registration"
            bgPrimaryColor="#FFFFFF"
            bgSecondaryColor="#3498db"
            textPrimaryColor="#3498db"
            textSecondaryColor="#FFFFFF"
            className="rounded-full"
            onClick={() => {/* hook up form dialog or navigation here */}}
          />
          <ArrowButton
            text="Download Brochure"
            bgPrimaryColor="rgba(17,24,39,0.08)"
            bgSecondaryColor="#111827"
            textPrimaryColor="#111827"
            textSecondaryColor="#FFFFFF"
            className="rounded-full"
            onClick={() => {/* wire to brochure link */}}
          />
        </div>
      </div>
    </motion.section>
  );
};

export default StemRegistrationPage;
