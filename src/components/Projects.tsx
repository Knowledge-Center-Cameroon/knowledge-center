import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "Programs",
    description:
      "Online and in-person institutes that empower the next generation of global technology leaders.",
    link: "/programs",
  },
  {
    title: "Ventures",
    description:
      "A venture studio for alumni talent focused on solving problems for the global majority.",
    link: "/ventures",
  },
  {
    title: "Ideas",
    description:
      "Research and ideas that cut through the noise and focuses on global implications of technological development.",
    link: "/ideas",
  },
];

const Projects = () => {
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
          <h2 className="text-4xl md:text-5xl font-bold">Explore our Work</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card p-8 rounded-lg border"
            >
              <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
              <p className="mb-6 text-muted-foreground">{project.description}</p>
              <Button asChild variant="primary">
                <Link to={project.link}>Explore</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;