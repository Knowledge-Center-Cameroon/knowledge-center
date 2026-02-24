import React from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  Users,
  ArrowRight,
  Target,
  Globe,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useParallax, Parallax } from "@/hooks/use-parallax";
import aboutImage from "@/assets/prepa1.jpeg";
import { Link } from "react-router-dom";

const AboutKC: React.FC = () => {
  const { ref, y } = useParallax(15);

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

  return (
    <section
      id="about-home"
      ref={ref as any}
      className="bg-white py-12 md:py-16 lg:py-20 rounded-3xl overflow-hidden"
    >
      <Parallax style={{ y }} className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative order-last lg:order-none"
          >
            <div className="relative z-10 overflow-hidden rounded-[2rem] shadow-card">
              <img
                src={aboutImage}
                alt="Knowledge Center students learning"
                className="h-full w-full object-cover aspect-square md:aspect-video lg:aspect-square hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Impact Badge */}
            <div className="absolute -bottom-6 -right-6 z-20 bg-white p-6 rounded-3xl shadow-xl border border-border hidden sm:block">
              <div className="flex items-center gap-4">
                <div className="bg-kc-blue/10 p-3 rounded-2xl">
                  <Users className="h-6 w-6 text-kc-blue" />
                </div>
                <div>
                  <p className="text-h5 font-heading font-bold text-kc-black leading-none">
                    7,000+
                  </p>
                  <p className="text-sm text-kc-black/70 font-medium">
                    Students Impacted
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative Blur */}
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-kc-blue/5 rounded-full blur-3xl -z-0" />
          </motion.div>

          {/* Content Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kc-blue/10 text-kc-blue text-xs font-bold uppercase tracking-wider mb-6">
                <ShieldCheck className="h-4 w-4" />
                About Knowledge Center
              </div>

              <h2 className="home-section-heading">
                What is <span className="text-kc-blue">Knowledge Center?</span>
              </h2>

              <p className="mt-6 text-kc-black/80 text-lg leading-relaxed">
                <strong className="text-kc-blue font-semibold">
                  Knowledge Center (KC)
                </strong>{" "}
                is an education innovation hub re-imagining how African talent is
                discovered, trained, and launched onto the global stage. We
                design high-impact learning programs that go beyond rote
                schooling—combining academic excellence, applied STEM,
                leadership development, and access to global opportunities.
              </p>
            </motion.div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {highlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-kc-blue/10 text-kc-blue group-hover:bg-kc-blue group-hover:text-white transition-colors duration-300">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="text-lg font-bold text-kc-blue mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-kc-black/70 leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 flex flex-wrap gap-4"
            >
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 rounded-full bg-kc-blue px-8 py-4 text-sm font-bold text-white shadow-card hover:bg-kc-blue-dark transition-all duration-300"
              >
                Explore Projects
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center rounded-full border-2 border-kc-blue/30 bg-white px-8 py-4 text-sm font-bold text-kc-blue hover:bg-kc-blue/10 transition-all duration-300"
              >
                Our Full Story
              </Link>
            </motion.div>
          </div>
        </div>
      </Parallax>
    </section>
  );
};

export default AboutKC;

