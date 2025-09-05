import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
          <Button variant="blue" asChild>
            <a href="#" onClick={(e) => e.preventDefault()}>Start Registration</a>
          </Button>
          <Button variant="blackOutline" asChild>
            <a href="#" onClick={(e) => e.preventDefault()}>Download Brochure</a>
          </Button>
        </div>
      </div>
    </motion.section>
  );
};

export default StemRegistrationPage;
