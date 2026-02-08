/**
 * Stats Component - Impact metrics and key statistics
 * 
 * Features:
 * - Animated counter numbers (Spring animation)
 * - Card-based layout with icon indicators
 * - Responsive grid (1 → 2 → 4 columns)
 * - Semantic card structure
 */
import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  Landmark,
  Handshake,
  TrendingUp,
  Award,
  Target,
} from "lucide-react";
import {
  motion,
  useInView,
  useSpring,
  useTransform,
} from "framer-motion";

/* Counter component - Animated number display */
const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  const spring = useSpring(0, {
    stiffness: 40,
    damping: 20,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, value, spring]);

  const display = useTransform(spring, (v) =>
    Math.round(v).toLocaleString()
  );

  return (
    <span ref={ref}>
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
};

/**
 * Stats Component - Display key metrics and impact numbers
 */
const Stats = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, {
    once: true,
    margin: "-10% 0px",
  });

  const statsData = [
    {
      icon: Users,
      label: "Students Impacted",
      value: 50000,
      suffix: "+",
      color: "from-kc-blue to-kc-blue",
      description: "Young minds inspired",
    },
    {
      icon: GraduationCap,
      label: "Alumni & Scholars",
      value: 7000,
      suffix: "+",
      color: "from-kc-blue to-kc-blue",
      description: "Success stories created",
    },
    {
      icon: Landmark,
      label: "Centers Nationwide",
      value: 13,
      suffix: "+",
      color: "from-kc-blue to-kc-blue",
      description: "Communities reached",
    },
    {
      icon: Handshake,
      label: "Partners & Collaborators",
      value: 90,
      suffix: "+",
      color: "from-kc-blue to-kc-blue",
      description: "Strong alliances built",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 18 },
    },
  };

  return (
    <section
      ref={containerRef}
      className="py-20 lg:py-28 bg-white relative overflow-hidden"
    >
      <div className="container mx-auto px-6 max-w-7xl relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-kc-blue/10 border border-kc-blue/20 rounded-full px-5 py-1.5 mb-4">
            <TrendingUp className="h-4 w-4 text-kc-blue" />
            <span className="text-sm font-medium text-kc-blue">Our Impact</span>
          </div>

          <h2 className="heading-2 mb-4">
            Impact in Numbers
          </h2>

          <p className="text-kc-black/80 max-w-3xl mx-auto">
            Since 2019, Knowledge Center has been transforming STEM education
            across Cameroon.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {statsData.map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="h-full bg-white border border-border rounded-2xl shadow-card hover:shadow-hover transition">
                <CardContent className="p-8 text-center">
                  <div
                    className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-kc-blue/10 flex items-center justify-center"
                  >
                    <stat.icon className="h-8 w-8 text-kc-blue" />
                  </div>

                  <div className="text-4xl font-bold text-kc-blue mb-2">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </div>

                  <p className="text-kc-black font-medium">
                    {stat.label}
                  </p>
                  <p className="text-kc-black/70 text-sm">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievement Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="bg-white border border-border rounded-3xl p-10 shadow-card"
        >
          <div className="text-center mb-10">
            <Award className="h-10 w-10 text-kc-blue mx-auto mb-3" />
            <h3 className="heading-4">
              Proven Track Record of Success
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              "95% Success Rate in National Exams",
              "Recognized STEM Leader Across the Globe",
              "Community-Driven Education Impact",
            ].map((text, i) => (
              <div key={i} className="text-kc-black/70">
                <Target className="h-6 w-6 mx-auto mb-3 text-kc-blue" />
                {text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
