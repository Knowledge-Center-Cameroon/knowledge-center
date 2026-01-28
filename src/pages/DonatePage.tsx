import React from "react";
import { motion } from "framer-motion";
import { useParallax, Parallax } from "@/hooks/use-parallax";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowButton } from "@/components/ui/arrow-button";
import { Heart, Users, BookOpen, Star, Zap, Coins, ArrowRight, Phone } from "lucide-react";
import StemBackground from "@/components/StemBackground";
import donate from "@/assets/hero1.jpeg"
import AnimatedLogo from "@/components/AnimatedLogo";
import { useSeo } from "@/hooks/useSeo";

const impactCards = [
  {
    icon: Users,
    color: "blue",
    title: "Empower Students",
    description: "Help us provide quality education and resources to students across the nation.",
  },
  {
    icon: BookOpen,
    color: "red",
    title: "Enhance Learning",
    description: "Support innovative teaching methods and cutting-edge learning technologies.",
  },
  {
    icon: Star,
    color: "blue",
    title: "Build Future",
    description: "Every contribution makes a difference in creating a brighter tomorrow.",
  }
];

/**
 * Donate Page - Donation landing with impact messaging
 * 
 * SEO Structure:
 * - H1: Primary donation headline
 * - H2: Impact card headings
 * - CTA buttons with clear action text
 * - Structured data for donation organizations
 * 
 * Design:
 * - Hero section with mission statement
 * - Impact cards showing donation effects
 * - Multiple CTA options
 * - Responsive for mobile giving
 */
const DonatePage: React.FC = () => {
  const { ref, y } = useParallax(40);
  
  useSeo({
    title: "Donate to Knowledge Center | Support STEM Education",
    description:
      "Support Knowledge Center's mission to empower young Cameroonians through quality STEM education. Your donation helps us reach more students.",
  });
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="container mx-auto px-4 lg:px-8 py-12 lg:py-20"
    >
      <div className="max-w-6xl relative mx-auto">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <StemBackground opacity={0.1} density={40} lineDistance={130} speed={0.4} showIcons={true} />
        </div>

        {/* Hero Section */}
        <Parallax ref={ref as any} style={{ y }} className="text-center mb-20 relative">
          <motion.div 
            className="inline-flex items-center justify-center w-24 h-24 bg-kc-red/5 rounded-full mb-8 relative"
            whileHover={{ scale: 1.05, rotate: 4 }}
            transition={{ type: "spring", stiffness: 320, damping: 16 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-kc-red/15 to-kc-blue/15 rounded-full blur-xl" />
            <div className="relative z-10">
              <AnimatedLogo size={72} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Hero Content */}
              <div className="text-center lg:text-left">
                <h1 className="text-h1 md:text-h1 lg:text-h1 font-heading font-bold mb-6">
                  Support Our <span className="text-gradient bg-gradient-to-r from-kc-blue to-kc-red bg-clip-text text-transparent">Mission</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                  Your donation today will shape the minds of tomorrow. By supporting our educational initiative, you're not just contributing to a cause—you are investing in the limitless potential of young learners, empowering them to explore their creativity and build a brighter future.
                </p>
              </div>

              {/* Hero Image Space */}
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-kc-blue/20 to-kc-red/20 rounded-2xl border border-white/10 overflow-hidden">
                  <img
                    src={donate}
                    alt="Students at Knowledge Center Cameroon during a STEM activity"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="mt-8 flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {["Education", "Innovation", "Future", "Impact", "Growth"].map((tag, i) => (
              <Badge 
                key={tag}
                variant="secondary" 
                className="px-4 py-2 text-base bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
              >
                {tag}
              </Badge>
            ))}
          </motion.div>
        </Parallax>

        {/* Impact Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {impactCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group bg-white/5 backdrop-blur-sm p-8 rounded-2xl shadow-elegant border border-white/10 transition-all duration-500 hover:shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-kc-blue/5 to-kc-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <motion.div 
                  className={`inline-flex items-center justify-center w-14 h-14 bg-kc-${card.color}/10 rounded-full mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <card.icon className={`w-7 h-7 text-kc-${card.color}`} />
                </motion.div>
                
                <h3 className="text-h5 md:text-h4 font-heading font-bold mb-3 group-hover:text-kc-blue transition-colors">
                  {card.title}
                </h3>
                
                <p className="text-muted-foreground text-base leading-relaxed mb-6">
                  {card.description}
                </p>
                
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-c-ble rounded-3xl blur-2xl" />
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-10 lg:p-12 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_50%)]" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
              <div className="text-center md:text-left">
                <h2 className="text-h2 md:text-h2 font-heading font-bold mb-4">
                  Ready to Make a <span className="text-gradient bg-gradient-to-r from-kc-blue to-kc-red bg-clip-text text-transparent">Difference</span>?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Join us in transforming education and empowering the next generation of leaders.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <ArrowButton 
                  size="lg" 
                  variant="red" 
                  className="rounded-full px-8 text-base"
                  onClick={() => {
                    // Add your donation logic here
                    alert('Redirecting to donation form...');
                  }}
                >
                  Donate Now
                </ArrowButton>
                <ArrowButton 
                  size="lg" 
                  variant="blackOutline" 
                  className="rounded-full px-8 text-base"
                  onClick={() => {
                    // Add your contact logic here
                    alert('Opening contact information...');
                  }}
                >
                  <Phone className="h-4 w-4" />
                  Contact Us
                </ArrowButton>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default DonatePage;
