import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, Landmark, Handshake, TrendingUp, Award, Target } from "lucide-react";
import { motion, useInView } from "framer-motion";

const Stats = () => {
  const [counts, setCounts] = useState({
    students: 0,
    graduates: 0,
    centers: 0,
    partners: 0
  });

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const statsData = [
    {
      icon: Users,
      label: "Students Impacted",
      value: 50000,
      suffix: "+",
      color: "from-kc-blue to-kc-blue",
      bgColor: "bg-kc-blue/20",
      borderColor: "border-kc-blue/30",
      description: "Young minds inspired"
    },
    {
      icon: GraduationCap,
      label: "Alumni & Scholars",
      value: 7000,
      suffix: "+",
      color: "from-kc-red to-kc-red",
      bgColor: "bg-kc-red/20",
      borderColor: "border-kc-red/30",
      description: "Success stories created"
    },
    {
      icon: Landmark,
      label: "Centers Nationwide",
      value: 13,
      suffix: "+",
      color: "from-kc-blue to-kc-blue",
      bgColor: "bg-kc-blue/20",
      borderColor: "border-kc-blue/30",
      description: "Communities reached"
    },
    {
      icon: Handshake,
      label: "Partners & Collaborators",
      value: 90,
      suffix: "+",
      color: "from-kc-red to-kc-red",
      bgColor: "bg-kc-red/20",
      borderColor: "border-kc-red/30",
      description: "Strong alliances built"
    }
  ];

  useEffect(() => {
    if (!isInView) return;

    const animateCounters = () => {
      const duration = 2500; // 2.5 seconds for more dramatic effect
      const steps = 80; // Higher FPS for smoother animation
      const stepDuration = duration / steps;

      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        // Easing function for more natural animation
        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

        setCounts({
          students: Math.round(easeOutExpo * statsData[0].value),
          graduates: Math.round(easeOutExpo * statsData[1].value),
          centers: Math.round(easeOutExpo * statsData[2].value),
          partners: Math.round(easeOutExpo * statsData[3].value)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setCounts({
            students: statsData[0].value,
            graduates: statsData[1].value,
            centers: statsData[2].value,
            partners: statsData[3].value
          });
        }
      }, stepDuration);

      return () => clearInterval(timer);
    };

    const cleanup = animateCounters();
    return cleanup;
  }, [isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <section ref={ref} className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-kc-blue/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-kc-red/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-transparent via-kc-blue/3 to-transparent rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-6xl relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-kc-blue/10 to-kc-red/10 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 mb-6">
            <TrendingUp className="h-4 w-4 text-kc-blue" />
            <span className="text-sm font-medium text-kc-blue">Our Impact</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-kc-blue/20 to-white bg-clip-text text-transparent">
            Impact in Numbers
          </h2>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Since our founding in 2019, we've been transforming STEM education across Cameroon,
            creating opportunities and inspiring the next generation of innovators.
          </p>
        </motion.div>

        {/* Enhanced Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16"
        >
          {statsData.map((stat, index) => (
            <motion.div key={index} variants={cardVariants} className="group">
              <Card className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 text-white shadow-2xl hover:shadow-white/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden rounded-3xl">
                {/* Animated border gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                {/* Subtle animated background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                <CardContent className="relative p-8 text-center">
                  {/* Icon with enhanced styling */}
                  <motion.div
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <stat.icon className="h-10 w-10 text-white" />
                  </motion.div>

                  {/* Animated counter */}
                  <motion.div
                    className={`text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
                  >
                    {counts[Object.keys(counts)[index] as keyof typeof counts].toLocaleString()}{stat.suffix}
                  </motion.div>

                  <div className="text-white/90 font-semibold text-lg mb-2">
                    {stat.label}
                  </div>

                  <div className="text-white/60 text-sm">
                    {stat.description}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Achievement Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 mb-6">
              <Award className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">Excellence Since 2019</span>
            </div>

            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Proven Track Record of Success
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "95% Success Rate",
                description: "Our students consistently achieve excellent results in GCE examinations and competitive assessments."
              },
              {
                icon: Award,
                title: "National Recognition",
                description: "Recognized as Cameroon's leading STEM education provider in the Southwest region."
              },
              {
                icon: TrendingUp,
                title: "Community Impact",
                description: "Transforming communities through education and inspiring the next generation of African scientists."
              }
            ].map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 1 + (index * 0.1) }}
                className="text-center group"
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                >
                  <achievement.icon className="h-8 w-8 text-white group-hover:text-blue-400 transition-colors duration-300" />
                </motion.div>
                <h4 className="font-bold text-white mb-3 text-lg group-hover:text-blue-300 transition-colors duration-300">
                  {achievement.title}
                </h4>
                <p className="text-gray-300 leading-relaxed">
                  {achievement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;