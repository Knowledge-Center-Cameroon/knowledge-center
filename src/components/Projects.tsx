import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FlaskConical, 
  GraduationCap, 
  Calendar, 
  Trophy,
  Users,
  Clock,
  Award,
  Target,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import Stem from "@/assets/stem.jpg";
import weekend from "@/assets/weekend.jpeg";
import summer2 from "@/assets/summer2.jpeg"
import { motion } from "framer-motion";
import StemBackground from "@/components/StemBackground";
import { Link } from "react-router-dom";

const Projects = () => {
  const [activeTab, setActiveTab] = useState("stem");

  const projects = {
    stem: {
      title: "National STEM Competition",
      icon: FlaskConical,
      description: "Our flagship program focusing on Science, Technology, Engineering, and Mathematics education for young Cameroonians.",
      image: Stem,
      features: [
        "National exam, across the country",
        "Problem solving, innovation and creativity skills",
        "Mentorship and academic guidance", 
        "Preparation for GCE examinations and beyond",
        "Project-based learning with real-world applications",
        "Global opportunities"
      ],
      details: [
        "Audience: Form 4–Upper Sixth (O/L & A/L)",
        "Schedule: Annually, every december",
        "Support: Mentorship + exam-prep clinics",
        "Outcomes: Improved GCE performance and deeper STEM literacy"
      ],
      stats: [
        { number: "500+", label: "Students Enrolled" },
        { number: "95%", label: "Success Rate" },
        { number: "50+", label: "Projects Completed" }
      ]
    },
    summer: {
      title: "Summer Education Program",
      icon: GraduationCap,
      description: "Intensive summer sessions designed to accelerate learning and provide enrichment opportunities and useful skill aqcuisition during school breaks.",
      image: summer2,
      features: [
        "2-month intensive learning program",
        "Interactive audio-visual lectures",
        "Beyond classroom knowledge",
        "Mentorship and orientation",
        "Leadership masterclass",
        "Tech Boot Camp",
        "Club Activities",
        "Sports and recreation",
        "Global scholar program"
      ],
      details: [
        "Duration: 2 months (July–August)",
        "Format: SMordern classrooms with audio-visual lectures",
        "Extras: Industry talks and campus tours",
        "Outcome: Portfolio-ready projects"
      ],
      stats: [
        { number: "200+", label: "Summer Participants" },
        { number: "6", label: "Weeks Duration" },
        { number: "20+", label: "Expert Instructors" }
      ]
    },
    weekend: {
      title: "Weekend School",
      icon: Calendar,
      description: "Flexible weekend classes for students who need additional support or want to advance their knowledge while attending regular school.",
      image: weekend,
      features: [
        "Saturday and Sunday class options",
        "Flexible scheduling to accommodate regular school",
        "Academically distinguished students",
        "Audio-visual lectures from passionate tutors",
        "Supplementary materials and practice exercises",
        "Peer tutoring and collaborative learning",
        "Progress tracking and regular assessments"
      ],
      details: [
        "When: Sat–Sun blocks",
        "Focus: Reinforcement + revision + mock tests",
        "Support: 1:1 feedback and study plans",
        "Outcome: Consistent weekly progress"
      ],
      stats: [
        { number: "300+", label: "Weekend Learners" },
        { number: "12", label: "Subjects Offered" },
        { number: "8", label: "Hours per Weekend" }
      ]
    }
  };

  const currentProject = projects[activeTab as keyof typeof projects];
  const Icon = currentProject.icon;

  // Refs for auto-centering active tab on mobile
  const tabRefs: Record<"stem" | "summer" | "weekend", React.RefObject<HTMLButtonElement>> = {
    stem: useRef<HTMLButtonElement>(null),
    summer: useRef<HTMLButtonElement>(null),
    weekend: useRef<HTMLButtonElement>(null),
  };

  useEffect(() => {
    const ref = tabRefs[activeTab as "stem" | "summer" | "weekend"]; // narrow type
    ref?.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeTab]);

  return (
    <section id="projects" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Header with STEM canvas */}
        <div className="relative overflow-hidden rounded-2xl mb-16">
          <StemBackground opacity={0.12} density={34} lineDistance={120} speed={0.45} showIcons={true} />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="relative z-10 text-center py-8"
          >
            <h2 className="heading-2 text-center mb-4 md:mb-6">
              <span className="text-kc-blue">Our</span> <span className="text-kc-red">Projects</span>
            </h2>
            <p className="subheading max-w-3xl mx-auto leading-relaxed">
              Comprehensive educational programs designed to meet diverse learning needs 
              and empower students at every stage of their academic journey.
            </p>
          </motion.div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="relative w-full mb-12 p-2 rounded-2xl bg-white/20 backdrop-blur-md border border-white/25 shadow-elegant overflow-x-auto md:overflow-visible flex md:grid md:grid-cols-3 gap-2 scroll-px-2 snap-x snap-mandatory">
            {/* Animated indicator */}
            <div
              className="hidden md:block absolute bottom-2 left-2 h-1 rounded-full bg-white/40 transition-transform duration-300 ease-out"
              style={{
                width: 'calc((100% - 1rem) / 3)',
                transform: `translateX(${(activeTab === 'stem' ? 0 : activeTab === 'summer' ? 1 : 2) * 100}%)`
              }}
            />
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
              <TabsTrigger 
                value="stem" 
                ref={tabRefs.stem}
                className="flex items-center whitespace-nowrap space-x-2 py-4 px-6 font-semibold rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 data-[state=active]:bg-black/70 data-[state=active]:text-white data-[state=inactive]:text-foreground/80 data-[state=inactive]:hover:bg-white/20 border border-white/0 data-[state=active]:border-white/20 shadow-sm snap-start"
              >
                <FlaskConical className="h-5 w-5" />
                <span>STEM Program</span>
              </TabsTrigger>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
              <TabsTrigger 
                value="summer" 
                ref={tabRefs.summer}
                className="flex items-center whitespace-nowrap space-x-2 py-4 px-6 font-semibold rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 data-[state=active]:bg-black/70 data-[state=active]:text-white data-[state=inactive]:text-foreground/80 data-[state=inactive]:hover:bg-white/20 border border-white/0 data-[state=active]:border-white/20 shadow-sm snap-start"
              >
                <GraduationCap className="h-5 w-5" />
                <span>Summer Education</span>
              </TabsTrigger>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
              <TabsTrigger 
                value="weekend" 
                ref={tabRefs.weekend}
                className="flex items-center whitespace-nowrap space-x-2 py-4 px-6 font-semibold rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 data-[state=active]:bg-black/70 data-[state=active]:text-white data-[state=inactive]:text-foreground/80 data-[state=inactive]:hover:bg-white/20 border border-white/0 data-[state=active]:border-white/20 shadow-sm snap-start"
              >
                <Calendar className="h-5 w-5" />
                <span>Weekend School</span>
              </TabsTrigger>
            </motion.div>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value={activeTab} className="mt-0">
            <motion.div whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
              <Card className="shadow-elegant overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid lg:grid-cols-2 min-h-[420px] md:min-h-[520px] lg:min-h-[600px]">
                    {/* Image Section */}
                    <div className="relative">
                      <motion.img 
                        src={currentProject.image} 
                        alt={currentProject.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 120, damping: 16 }}
                      />
                      <div className="absolute inset-0 bg-black/30" />
                      
                      {/* Stats Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-4 md:p-6">
                        <div className="grid grid-cols-3 gap-3 md:gap-4 text-white text-center text-xs md:text-sm">
                          {currentProject.stats.map((stat, index) => (
                            <motion.div key={index} whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
                              <div className="text-2xl font-heading font-bold">{stat.number}</div>
                              <div className="text-sm opacity-90">{stat.label}</div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 md:p-8 lg:p-12 flex flex-col justify-center">
                      <div className="w-16 h-16 bg-kc-blue rounded-full flex items-center justify-center mb-6">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <h3 className="text-3xl font-heading font-bold mb-4">
                        {currentProject.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed mb-6 md:mb-7">
                        {currentProject.description}
                      </p>

                      {/* Features List */}
                      <div className="space-y-3 md:space-y-4 mb-6 md:mb-7">
                        {currentProject.features.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -8 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ delay: index * 0.03, duration: 0.25 }}
                            className="flex items-start space-x-3"
                          >
                            <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Additional Details */}
                      {currentProject.details && (
                        <div className="mb-6 md:mb-8">
                          <h4 className="font-semibold mb-3">Additional Details</h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-foreground/90">
                            {currentProject.details.map((d, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-kc-blue" />
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                          <Button 
                            variant="blue"
                            size="lg"
                            className="group font-semibold w-full sm:w-auto"
                          >
                            Enroll Now
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                          <Button 
                            variant="blackOutline"
                            size="lg"
                            className="w-full sm:w-auto"
                          >
                            Learn More
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* STEM Competition Section */}
        <div className="mt-20">
          <Card className="bg-kc-black text-white overflow-hidden">
            <CardContent className="p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-kc-red rounded-full flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold">STEM Competition</h3>
                  </div>
                  
                  <p className="text-white/90 leading-relaxed mb-6">
                    The KC STEM (Science, Technology, Engineering, and Mathematics) Competition, 
                    whose first edition took place in December of 2021, is an annual national 
                    (Cameroon) scientific contest organized by Knowledge Center (KC) in an effort 
                    to foster scientific thinking in students.
                  </p>
                  
                  <p className="text-white/90 leading-relaxed mb-8">
                    We challenge participants with thought-provoking questions which force them 
                    to think beyond the ordinary student's mental reach, and, perhaps for the 
                    first time, unlock the floodgates of creativity and critical thinking.
                  </p>

                  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="red" size="lg" className="font-semibold" asChild>
                      <Link to="/stem-registration">
                        Join Competition
                        <Trophy className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm" whileHover={{ y: -2 }}>
                      <Target className="h-8 w-8 text-white mx-auto mb-2" />
                      <div className="text-2xl font-heading font-bold">Annual</div>
                      <div className="text-sm text-white/80">Competition</div>
                    </motion.div>
                    <motion.div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm" whileHover={{ y: -2 }}>
                      <Award className="h-8 w-8 text-white mx-auto mb-2" />
                      <div className="text-2xl font-heading font-bold">National</div>
                      <div className="text-sm text-white/80">Recognition</div>
                    </motion.div>
                  </div>
                  
                  <motion.div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm" whileHover={{ y: -2 }}>
                    <h4 className="font-semibold mb-2">Next Competition</h4>
                    <p className="text-white/80 text-sm mb-3">
                      December 2024 - Registration opens in September
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-white/80">
                      <Clock className="h-4 w-4" />
                      <span>3 months to prepare</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Projects;