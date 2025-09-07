import React from "react";
import { motion } from "framer-motion";
import Contact from "@/components/Contact";
import StemBackground from "@/components/StemBackground";

const ContactPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-[60vh] relative"
    >
      {/* Stem background overlay */}
      <div className="absolute inset-0 -z-10">
        <StemBackground opacity={0.1} density={40} lineDistance={120} speed={0.4} showIcons={true} />
      </div>
      <Contact />
    </motion.div>
  );
};

export default ContactPage;
