import React from "react";
import { motion } from "framer-motion";
import { Heart, Lightbulb, Users, BookOpen, ArrowRight } from "lucide-react";
import { useParallax, Parallax } from "@/hooks/use-parallax";
import aboutImage from "@/assets/about.jpeg";
import { Link } from "react-router-dom";

const AboutKC: React.FC = () => {
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
    <section ref={ref as any} className="py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(239,68,68,0.05),transparent_50%)]"></div>

      <Parallax style={{ y }} className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="lg:text-left">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-12 lg:mb-16 text-center lg:text-left"
            >
              <div className="h-1 w-20 mb-4 bg-gradient-to-r from-kc-blue to-kc-red rounded-full lg:mx-0 mx-auto"></div>
              <h2 className="heading-2 mb-6">
                <span className="text-kc-blue">About</span>{" "}
                <span className="text-kc-red">Knowledge Center</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed lg:mx-0 mx-auto">
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
                    <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:border-kc-blue/30">
                      <div className="w-12 h-12 mb-4 bg-gradient-to-br from-kc-blue/10 to-kc-red/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6 text-kc-blue group-hover:text-kc-red transition-colors duration-300" />
                      </div>
                      <h3 className="font-semibold text-lg mb-3 text-gray-900 group-hover:text-kc-blue transition-colors duration-300 text-left">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-left">
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
              <p className="text-muted-foreground mb-6 text-lg text-center lg:text-left">
                Join us in shaping the future of STEM education in Cameroon
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/programs" className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-kc-blue to-kc-blue/90 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Explore Our Programs <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link to="/about" className="inline-flex items-center justify-center px-8 py-3 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full font-medium border border-gray-200 hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Learn More About Us
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="aspect-w-4 aspect-h-3 lg:aspect-w-3 lg:aspect-h-4">
              <img src={aboutImage} alt="About Knowledge Center" className="rounded-3xl object-cover shadow-2xl" />
            </div>
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-kc-blue/10 rounded-full -z-10 blur-2xl"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-kc-red/10 rounded-full -z-10 blur-2xl"></div>
          </motion.div>
        </div>
      </Parallax>
    </section>
  );
};

export default AboutKC;
