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

export default Stats;import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, Landmark, Handshake, TrendingUp, Award, Target } from "lucide-react";
import { motion, useInView, useSpring, useTransform, animate } from "framer-motion";

// Helper component for physics-based counting
const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  
  const springValue = useSpring(0, {
    stiffness: 40, // Lower = smoother, more "floaty"
    damping: 20,   // Prevents jittery ends
    restDelta: 0.001
  });

  useEffect(() => {
    if (inView) {
      springValue.set(value);
    }
  }, [inView, value, springValue]);

  const displayValue = useTransform(springValue, (latest) => 
    Math.round(latest).toLocaleString()
  );

  return (
    <motion.span ref={ref}>
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </motion.span>
  );
};

const Stats = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });

  const statsData = [
    {
      icon: Users,
      label: "Students Impacted",
      value: 50000,
      suffix: "+",
      color: "from-blue-500 to-kc-blue",
      description: "Young minds inspired"
    },
    {
      icon: GraduationCap,
      label: "Alumni & Scholars",
      value: 7000,
      suffix: "+",
      color: "from-red-500 to-kc-red",
      description: "Success stories created"
    },
    {
      icon: Landmark,
      label: "Centers Nationwide",
      value: 13,
      suffix: "+",
      color: "from-blue-500 to-kc-blue",
      description: "Communities reached"
    },
    {
      icon: Handshake,
      label: "Partners & Collaborators",
      value: 90,
      suffix: "+",
      color: "from-red-500 to-kc-red",
      description: "Strong alliances built"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 20 
      } 
    }
  };

  return (
    <section ref={containerRef} className="py-20 lg:py-32 bg-[#020617] relative overflow-hidden">
      {/* Background Glows for Depth */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-kc-blue/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-kc-red/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 lg:mb-24"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-1 mb-6">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">Our Global Impact</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Impact in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-kc-blue">Numbers</span>
          </h2>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Since 2019, we've focused on one mission: empowering Cameroon's youth through world-class STEM excellence.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {statsData.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full bg-white/[0.03] backdrop-blur-md border-white/[0.08] hover:border-white/20 transition-all duration-500 rounded-[2rem] overflow-hidden group">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>

                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tighter">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </div>

                  <p className="text-blue-100/90 font-semibold text-base mb-2">
                    {stat.label}
                  </p>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievement Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[3rem] p-8 md:p-16 border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Award className="w-32 h-32 text-white" />
          </div>

          <div className="relative z-10 grid lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-4 border border-emerald-500/20">
                <Target className="w-3 h-3" /> MILESTONES
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Proven Track Record of Success</h3>
              <p className="text-gray-400">Our results speak for themselves. We don't just teach; we transform career trajectories.</p>
            </div>

            <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
              {[
                { title: "95% Success Rate", text: "Exceptional results in GCE & competitive STEM assessments." },
                { title: "National Leader", text: "Recognized as the premier STEM hub in the Southwest Region." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Award className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;