import React from "react";
import { motion } from "framer-motion";
import { Heart, Lightbulb, Users, BookOpen, ArrowRight } from "lucide-react";
import { useParallax, Parallax } from "@/hooks/use-parallax";
import aboutImage from "@/assets/about.jpeg";
import { Link } from "react-router-dom";

const AboutKC: React.FC = () => {
  const { ref, y } = useParallax(20);

  const highlights = [
    {
      icon: Heart,
      title: "Passion-Driven Learning",
      description:
        "Hands-on STEM education that builds curiosity, discipline, and real problem-solving skills."
    },
    {
      icon: Lightbulb,
      title: "Innovation First",
      description:
        "We train young minds to think critically, experiment boldly, and create meaningful solutions."
    },
    {
      icon: Users,
      title: "Strong Community",
      description:
        "A safe, focused environment where students grow together through mentorship and teamwork."
    },
    {
      icon: BookOpen,
      title: "Solid Foundations",
      description:
        "From fundamentals to advanced concepts, we emphasize clarity and depth over shortcuts."
    }
  ];

  return (
    <section
      id="about-home"
      ref={ref as any}
      className="bg-[#f8f9fa] py-20 overflow-hidden"
    >
      <Parallax style={{ y }} className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left content */}
          <div>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-10"
            >
              <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                About Knowledge Center
              </span>

              <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-slate-900 leading-tight">
                Building the next generation of
                <span className="text-kc-blue"> scientists and engineers</span>
              </h2>

              <p className="mt-4 max-w-xl text-slate-600 text-base md:text-lg">
                Knowledge Center Cameroon (KC) equips young Cameroonians with
                practical STEM skills through structured learning, mentorship,
                and real-world projects.
              </p>
            </motion.div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.08 }}
                    className="bg-white border border-slate-200 rounded-lg p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-kc-blue">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 rounded-md bg-kc-blue px-6 py-3 text-sm font-medium text-white hover:bg-kc-blue/90 transition"
              >
                View Programs <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center rounded-md border border-slate-300 px-6 py-3 text-sm font-medium text-slate-800 hover:bg-slate-100 transition"
              >
                Learn More
              </Link>
            </motion.div>
          </div>

          {/* Right image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <img
                src={aboutImage}
                alt="Knowledge Center Cameroon"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute top-4 left-4 rounded-md bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm border border-slate-200">
              Established 2019
            </div>
          </motion.div>
        </div>
      </Parallax>
    </section>
  );
};

export default AboutKC;
