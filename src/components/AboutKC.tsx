import React from "react";
import { motion } from "framer-motion";
import { Heart, Lightbulb, Users, BookOpen, ArrowRight, Target, ShieldCheck } from "lucide-react";
import { useParallax, Parallax } from "@/hooks/use-parallax";
import aboutImage from "@/assets/about.jpeg";
import { Link } from "react-router-dom";

const AboutKC: React.FC = () => {
  const { ref, y } = useParallax(15);

  const highlights = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To bridge the gap between theoretical education and practical industry demands for young Cameroonians."
    },
    {
      icon: Lightbulb,
      title: "Why KC Exists",
      description:
        "We exist to foster a culture of innovation, ensuring that STEM isn't just learned, but applied to solve local problems."
    },
    {
      icon: ShieldCheck,
      title: "Core Values",
      description:
        "Discipline, Excellence, and Community. We provide a safe space for bold experimentation and deep learning."
    },
    {
      icon: Users,
      title: "Mentorship",
      description:
        "Connecting students with industry experts to guide their journey from curiosity to professional mastery."
    }
  ];

  return (
    <section
      id="about-home"
      ref={ref as any}
      className="bg-[#FAFBFF] py-24 overflow-hidden"
    >
      <Parallax style={{ y }} className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Right image - Placed first on mobile for better flow */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative order-last lg:order-none"
          >
            <div className="relative z-10 overflow-hidden rounded-[2.5rem] shadow-2xl shadow-blue-100/50">
              <img
                src={aboutImage}
                alt="Knowledge Center Cameroon Students"
                className="h-full w-full object-cover aspect-square md:aspect-video lg:aspect-square hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Google-style Floating Badge */}
            <div className="absolute -bottom-6 -right-6 z-20 bg-white p-6 rounded-3xl shadow-xl border border-slate-50 hidden sm:block">
              <div className="flex items-center gap-4">
                <div className="bg-kc-blue/10 p-3 rounded-2xl">
                  <Users className="h-6 w-6 text-kc-blue" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 leading-none">500+</p>
                  <p className="text-sm text-slate-500 font-medium">Students Trained</p>
                </div>
              </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-kc-blue/5 rounded-full blur-3xl -z-0" />
          </motion.div>

          {/* Left content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kc-blue/10 text-kc-blue text-xs font-bold uppercase tracking-wider mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-kc-blue opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-kc-blue"></span>
                </span>
                The KC Story
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-[1.15]">
                What is <span className="text-kc-blue">Knowledge Center?</span>
              </h2>

              <p className="mt-6 text-slate-600 text-lg leading-relaxed">
                <strong className="text-slate-900 font-semibold">Knowledge Center (KC)</strong> is a premier STEM hub in Cameroon dedicated to empowering the next generation. We don't just teach code or robotics; we cultivate the mindset of a creator. KC was founded to provide the resources and mentorship that bridge the gap between classroom theory and real-world innovation.
              </p>
            </motion.div>

            {/* Feature cards - Google Material 3 inspired */}
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
                    className="group bg-white hover:bg-kc-blue-[2px] p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-kc-blue group-hover:bg-kc-blue group-hover:text-white transition-colors duration-300">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 flex flex-wrap gap-4"
            >
              <Link
                to="/programs"
                className="group inline-flex items-center gap-2 rounded-full bg-kc-blue px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-slate-900 hover:shadow-none transition-all duration-300"
              >
                Explore Programs 
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center rounded-full border-2 border-slate-100 bg-white px-8 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-all duration-300"
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