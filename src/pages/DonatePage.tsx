import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const DonatePage: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="container mx-auto px-4 lg:px-8 py-12"
    >
      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl font-heading font-bold">Support Our Mission</h1>
        <p className="text-muted-foreground">
          Your donation helps us expand access to quality STEM education, provide materials, and fund
          community initiatives. Thank you for empowering the next generation of innovators in Cameroon.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Button size="lg" variant="blue" className="font-semibold">Donate Online</Button>
          <Button size="lg" variant="blackOutline">View Bank Details</Button>
        </div>
      </div>
    </motion.section>
  );
};

export default DonatePage;
