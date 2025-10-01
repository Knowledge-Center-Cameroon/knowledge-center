import React from "react";
import { motion } from "framer-motion";
import { Heart, Lightbulb, Users, BookOpen } from "lucide-react";
import { useParallax, Parallax } from "@/hooks/use-parallax";

const AboutKC = () => {
  const { ref, y } = useParallax(30);

  const highlights = [
    {
      icon: Heart,
      title: "Passion-Driven",
      description: "We nurture scientific curiosity through hands-on learning and real-world application"
    },
    {
      icon: Lightbulb,
      title: "Innovation-Focused",
      description: "Building tomorrow's STEM leaders with creativity and problem-solving skills"
    },
    {
      icon: Users,
      title: "Community-Centered",
      description: "Creating a supportive family where every young mind can thrive and grow"
    },
    {
      icon: BookOpen,
      title: "Knowledge-Rich",
      description: "Comprehensive STEM education from fundamentals to advanced applications"
    }
  ];

  return (
    <section ref={ref as any} className="py-16 lg:py-24 bg-gradient-to-br from-white via-gray-50/50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(239,68,68,0.05),transparent_50%)]"></div>

      <Parallax style={{ y }} className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 lg:mb-16"
          >
            <div className="h-1 w-20 mx-auto mb-4 bg-gradient-to-r from-kc-blue to-kc-red rounded-full"></div>
            <h2 className="heading-2 mb-6">
              <span className="text-kc-blue">About</span>{" "}
              <span className="text-kc-red">Knowledge Center</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Knowledge Center Cameroon (KC) is a dedicated STEM education hub empowering young Cameroonians
              through innovative learning experiences that spark curiosity and foster excellence.
            </p>
          </motion.div>

          {/* Features grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + (index * 0.1),
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="group"
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-sm border border-white/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-kc-blue/10 to-kc-red/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-kc-blue group-hover:text-kc-red transition-colors duration-300" />
                    </div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-900 group-hover:text-kc-blue transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 lg:mt-16"
          >
            <p className="text-muted-foreground mb-6 text-lg">
              Join us in shaping the future of STEM education in Cameroon
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-kc-blue to-kc-blue/90 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300">
                Explore Our Programs
              </button>
              <button className="px-8 py-3 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full font-medium border border-gray-200 hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300">
                Learn More About Us
              </button>
            </div>
          </motion.div>
        </div>
      </Parallax>
    </section>
  );
};

export default AboutKC;
