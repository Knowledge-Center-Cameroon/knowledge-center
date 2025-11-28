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
    <section ref={ref as any} className="py-16 lg:py-24 bg-slate-50 relative overflow-hidden">
      <Parallax style={{ y }} className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="lg:text-left">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-10 lg:mb-14 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-5 py-1.5 mb-4">
                <span className="h-2 w-2 rounded-full bg-kc-blue" />
                <span className="text-xs font-semibold tracking-[0.18em] text-slate-600 uppercase">About us</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
                A home for young
                <span className="text-kc-blue"> scientists</span> in Cameroon
              </h2>
              <p className="text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed lg:mx-0 mx-auto">
                Knowledge Center Cameroon (KC) is a dedicated STEM education hub empowering young Cameroonians
                through innovative learning experiences that spark curiosity and foster excellence.
              </p>
            </motion.div>

            {/* Features grid */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6"
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
                    <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 hover:shadow-lg transition-transform duration-300">
                      <div className="w-10 h-10 mb-3 rounded-xl flex items-center justify-center bg-slate-100 text-kc-blue group-hover:bg-kc-blue group-hover:text-white transition-colors duration-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-base md:text-lg mb-2 text-slate-900 group-hover:text-kc-blue transition-colors duration-300 text-left">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed text-left">
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
              transition={{ duration: 0.55, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 lg:mt-12"
            >
              <p className="text-slate-600 mb-5 text-base md:text-lg text-center lg:text-left">
                Join us in shaping the future of STEM education in Cameroon
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to="/programs" className="inline-flex items-center justify-center px-7 py-3 bg-kc-blue text-white rounded-full font-medium hover:bg-kc-blue/90 hover:shadow-md transition-all duration-200">
                  Explore Our Programs <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link to="/about" className="inline-flex items-center justify-center px-7 py-3 bg-white text-slate-800 rounded-full font-medium border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">
                  Learn More About Us
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="aspect-w-4 aspect-h-3 lg:aspect-w-3 lg:aspect-h-4 rounded-3xl overflow-hidden bg-slate-200">
              <img src={aboutImage} alt="About Knowledge Center" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-4 -left-4 h-10 w-28 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-[0.7rem] font-medium text-slate-600">
              Since 2019
            </div>
          </motion.div>
        </div>
      </Parallax>
    </section>
  );
};

export default AboutKC;
