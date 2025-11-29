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

    const duration = 2200;
    const start = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCounts({
        students: Math.round(easeOutExpo * statsData[0].value),
        graduates: Math.round(easeOutExpo * statsData[1].value),
        centers: Math.round(easeOutExpo * statsData[2].value),
        partners: Math.round(easeOutExpo * statsData[3].value)
      });

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
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
    <section ref={ref} className="py-14 md:py-20 lg:py-24 bg-slate-950 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl relative z-10">

        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 lg:mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-white/5 rounded-full px-5 py-1.5 mb-4">
            <TrendingUp className="h-4 w-4 text-kc-blue" />
            <span className="text-sm font-medium text-kc-blue">Our Impact</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-[2.6rem] font-semibold text-white mb-4">
            Impact in Numbers
          </h2>

          <p className="text-base md:text-lg text-gray-300/90 max-w-3xl mx-auto leading-relaxed">
            Since our founding in 2019, we've been transforming STEM education across Cameroon,
            creating opportunities and inspiring the next generation of innovators.
          </p>

        </motion.div>

        {/* Enhanced Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mb-12"
        >

          {statsData.map((stat, index) => (
            <motion.div key={index} variants={cardVariants} className="group">
              <Card className="relative bg-slate-900/80 backdrop-blur-xl border border-white/5 hover:border-white/15 text-white shadow-xl hover:shadow-2xl transition-all duration-400 hover:-translate-y-1.5 overflow-hidden rounded-2xl">
                <CardContent className="relative px-6 py-6 text-center">
                  {/* Icon */}
                  <motion.div
                    className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md transition-all duration-300`}
                    whileHover={{ scale: 1.06 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  >
                    <stat.icon className="h-7 w-7 text-white" />
                  </motion.div>

                  {/* Animated counter */}
                  <motion.div
                    className={`text-3xl md:text-4xl font-semibold mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
                  >
                    {counts[Object.keys(counts)[index] as keyof typeof counts].toLocaleString()}{stat.suffix}
                  </motion.div>

                  <div className="text-white/90 font-medium text-base md:text-lg mb-1.5">
                    {stat.label}
                  </div>

                  <div className="text-white/60 text-xs md:text-sm">
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
          className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-7 md:p-10 border border-white/10"

        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-slate-950/80 backdrop-blur-sm border border-white/5 rounded-full px-5 py-1.5 mb-4">

              <Award className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">Excellence Since 2019</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-3">

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