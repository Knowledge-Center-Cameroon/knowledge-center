import React from "react";
import { motion } from "framer-motion";

const statsData = [
  { label: "Alumni", value: "200+" },
  { label: "Countries Represented", value: "60+" },
  { label: "Alumni-LED Ventures", value: "11" },
  { label: "Research and Venture Fellows", value: "28" },
  { label: "Awarded in Scholarships", value: "$2M" },
];

const Stats = () => {
  return (
    <section className="bg-background text-foreground py-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            How we make a difference
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <p className="text-4xl font-bold text-primary">{stat.value}</p>
              <p className="text-lg text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
