import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  Target,
  Globe,
  Sparkles,
} from "lucide-react";

const highlights = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To deliver world-class education programs that strengthen academic excellence, unlock global opportunities, and develop leaders capable of solving Africa’s most pressing challenges.",
  },
  {
    icon: Globe,
    title: "Our Vision",
    description:
      "Re-imagining education to cultivate critical 21st-century competencies that empower local learners to compete with their global peers and become drivers of Africa’s exponential growth.",
  },
  {
    icon: Lightbulb,
    title: "Why We Exist",
    description:
      "Knowledge Center exists to democratize access to world-class education, restore standards of excellence, and equip young people to compete globally while driving Africa’s growth.",
  },
  {
    icon: Sparkles,
    title: "Our Philosophy",
    description:
      "Every child, regardless of where they are born, deserves the opportunity to discover their limitless potential and become a meaningful contributor to the global economy.",
  },
];

const AboutKC: React.FC = () => {
  return (
    <section className="bg-black text-white py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.15]">
            What is Knowledge Center?
          </h2>
          <p className="mt-6 text-lg leading-relaxed max-w-3xl mx-auto">
            Knowledge Center (KC) is an education innovation hub re-imagining
            how African talent is discovered, trained, and launched onto the
            global stage.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-gray-900 p-6 rounded-lg"
              >
                <div className="mb-4">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Button asChild variant="primary" size="lg">
            <Link to="/about">Our Full Story</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutKC;
