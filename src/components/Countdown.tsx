import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Countdown = () => {
  return (
    <section className="bg-background text-foreground py-20">
      <div className="container mx-auto px-6 max-w-7xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            We have one mission. Making innovation more inclusive.
          </h2>
          <p className="text-lg md:text-xl mb-8 text-muted-foreground">
            If you're a prospective student, educator, or investor, we'd love
            to hear from you!
          </p>
          <Button asChild variant="primary" size="lg">
            <Link to="/contact">Contact us</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Countdown;
