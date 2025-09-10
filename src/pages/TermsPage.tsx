import React from "react";
import { motion } from "framer-motion";

const TermsPage: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="container mx-auto px-4 lg:px-8 py-12"
    >
      <div className="max-w-3xl space-y-4">
        <h1 className="text-4xl font-heading font-bold">Terms of Service</h1>
        <p className="text-muted-foreground">
          This is a placeholder for the Terms of Service. Currently in development.
        </p>
      </div>
    </motion.section>
  );
};

export default TermsPage;
