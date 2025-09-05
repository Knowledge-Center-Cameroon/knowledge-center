import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const BlogPage: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="container mx-auto px-4 lg:px-8 py-12"
    >
      <div className="max-w-3xl">
        <h1 className="text-4xl font-heading font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground mb-8">
          Stories, updates, and insights from Knowledge Center. Posts coming soon.
        </p>
        <Button variant="blue" asChild>
          <a href="#" onClick={(e) => e.preventDefault()}>Subscribe for updates</a>
        </Button>
      </div>
    </motion.section>
  );
};

export default BlogPage;
