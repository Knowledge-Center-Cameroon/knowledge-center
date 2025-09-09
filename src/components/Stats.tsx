import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, School, Hand, Library, Link, Landmark, Handshake } from "lucide-react";

const Stats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    students: 0,
    graduates: 0,
    awards: 0,
    programs: 0
  });
  
  const sectionRef = useRef<HTMLDivElement>(null);

  const statsData = [
    {
      icon: Users,
      label: "Students Impacted",
      value: 50000,
      suffix: "+",
      color: "text-blue-600"
    },
    {
      icon: GraduationCap,
      label: "Alumni and Scholars",
      value: 7000,
      suffix: "+",
      color: "text-green-600"
    },
    {
      icon: Landmark,
      label: "Centers Nationwide",
      value: 13,
      suffix: "+",
      color: "text-yellow-600"
    },
    {
      icon: Handshake,
      label: "Institutional Partners",
      value: 90,
      suffix: "+",
      color: "text-purple-600"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const animateCounters = () => {
      const duration = 2000; // 2 seconds
      const steps = 60; // 60 FPS
      const stepDuration = duration / steps;

      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        setCounts({
          students: Math.round(easeOutQuart * statsData[0].value),
          graduates: Math.round(easeOutQuart * statsData[1].value),
          awards: Math.round(easeOutQuart * statsData[2].value),
          programs: Math.round(easeOutQuart * statsData[3].value)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setCounts({
            students: statsData[0].value,
            graduates: statsData[1].value,
            awards: statsData[2].value,
            programs: statsData[3].value
          });
        }
      }, stepDuration);

      return () => clearInterval(timer);
    };

    const cleanup = animateCounters();
    return cleanup;
  }, [isVisible]);

  const getCurrentValue = (index: number) => {
    const keys = ['students', 'graduates', 'awards', 'programs'] as const;
    return counts[keys[index]];
  };

  return (
    <section ref={sectionRef} className="py-14 md:py-20 lg:py-28 bg-black">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-3 md:mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-base md:text-lg text-white/85 max-w-3xl mx-auto leading-relaxed">
            Since our founding in 2019, we've been making a significant impact in STEM education across Cameroon.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {statsData.map((stat, index) => (
            <div key={index} className="neon-rotate-wrapper">
              <div className="neon-rotate neon-snake"></div>
              <Card 
                className="relative z-10 bg-white/[0.03] backdrop-blur-sm border border-white/10 text-white shadow-lg transition-bounce hover:scale-[1.02] rounded-2xl"
              >
                <CardContent className="p-6 md:p-7 lg:p-8 text-center">
                  <div className={(index % 2 === 0 ? 'bg-kc-blue' : 'bg-kc-red') + " w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-5 md:mb-6"}>
                    <stat.icon className="h-7 w-7 md:h-8 md:w-8 text-white" />
                  </div>
                  
                  <div className={(index % 2 === 0 ? 'text-kc-blue' : 'text-kc-red') + " text-3xl md:text-4xl lg:text-5xl font-playfair font-extrabold mb-1 md:mb-2"}>
                    {getCurrentValue(index).toLocaleString()}{stat.suffix}
                  </div>
                  
                  <div className="text-white/90 font-medium text-sm md:text-base">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Achievement Highlights */}
        <div className="mt-10 md:mt-12 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 lg:p-10 border border-white/10">
            <h3 className="text-2xl font-playfair font-bold text-white mb-6">
              Excellence in Education Since 2019
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-white/90">
              <div>
                <h4 className="font-semibold text-white mb-2">95% Success Rate</h4>
                <p className="text-sm">
                  Our students consistently achieve excellent results in GCE examinations and beyond.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">National Recognition</h4>
                <p className="text-sm">
                  KC is recognized as a leading STEM education provider in Southwest Cameroon.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Community Impact</h4>
                <p className="text-sm">
                  Transforming communities through education and inspiring the next generation of scientists.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;