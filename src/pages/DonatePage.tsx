import React from "react";
import { motion } from "framer-motion";
import { useParallax, Parallax } from "@/hooks/use-parallax";
import { Button } from "@/components/ui/button";
import { Heart, Users, BookOpen } from "lucide-react";

const DonatePage: React.FC = () => {
  const { ref, y } = useParallax(40);
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="container mx-auto px-4 lg:px-8 py-12 lg:py-20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <Parallax ref={ref as any} style={{ y }} className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-kc-red/10 rounded-full mb-6">
            <Heart className="w-8 h-8 text-kc-red" />
          </div>
          <h1 className="heading-1 mb-6">
            Support Our <span className="text-kc-blue">Mission</span>
          </h1>
          <p className="subheading max-w-3xl mx-auto leading-relaxed">
            Your donation today will shape the minds of tomorrow. By supporting our educational initiative, you're not just contributing to a cause—you are investing in the limitless potential of young learners, empowering them to explore their creativity and build a brighter future.
          </p>
        </Parallax>

        {/* Impact Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-gradient-card p-8 rounded-2xl shadow-elegant text-center shadow-elegant transition-all hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-kc-blue/10 rounded-full mb-4">
              <Users className="w-6 h-6 text-kc-blue" />
            </div>
            <h3 className="heading-3 mb-3">Empower Students</h3>
            <p className="text-muted-foreground">
              Help us provide quality education and resources to students across the nation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-gradient-card p-8 rounded-2xl shadow-elegant text-center shadow-elegant transition-all hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-kc-red/10 rounded-full mb-4">
              <BookOpen className="w-6 h-6 text-kc-red" />
            </div>
            <h3 className="heading-3 mb-3">Enhance Learning</h3>
            <p className="text-muted-foreground">
              Support innovative teaching methods and cutting-edge learning technologies.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-gradient-card p-8 rounded-2xl shadow-elegant text-center shadow-elegant transition-all hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-kc-blue/10 rounded-full mb-4">
              <Heart className="w-6 h-6 text-kc-blue" />
            </div>
            <h3 className="heading-3 mb-3">Build Future</h3>
            <p className="text-muted-foreground">
              Every contribution makes a difference in creating a brighter tomorrow.
            </p>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-gradient-subtle p-8 rounded-2xl shadow-elegant max-w-2xl mx-auto">
            <h2 className="heading-2 mb-4">Ready to Make a Difference?</h2>
            <p className="subheading mb-8">
              Join us in transforming education and empowering the next generation of leaders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="red" className="font-semibold px-8">
                Donate Now
              </Button>
              <Button size="lg" variant="blackOutline" className="px-8">
                View Bank Details
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default DonatePage;
