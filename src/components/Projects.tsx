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
import { ChevronDown } from "lucide-react";
import Stem from "@/assets/stem.jpg";
import weekend from "@/assets/weekend.jpeg";
import summer2 from "@/assets/summer2.jpeg"
import { motion } from "framer-motion";
import StemBackground from "@/components/StemBackground";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        { number: "2000+", label: "Students Enrolled" },
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
    <section id="projects" className="py-16 lg:py-24 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8 lg:mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-5 py-1.5 mb-4">
            <span className="h-2 w-2 rounded-full bg-kc-blue" />
            <span className="text-xs font-semibold tracking-[0.18em] text-slate-600 uppercase">Programs</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3">
            Signature learning experiences
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore the core programs that shape how Knowledge Center supports young scientists across Cameroon.
          </p>
        </motion.div>

        {/* Mobile Menu (Navbar-style) */}
        <div className="md:hidden mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="blackOutline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  {activeTab === 'stem' && <FlaskConical className="h-4 w-4" />}
                  {activeTab === 'summer' && <GraduationCap className="h-4 w-4" />}
                  {activeTab === 'weekend' && <Calendar className="h-4 w-4" />}
                  {projects[activeTab as 'stem'|'summer'|'weekend'].title}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
              <DropdownMenuItem onSelect={() => setActiveTab('stem')} className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4" /> STEM Program
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setActiveTab('summer')} className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" /> Summer Education
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setActiveTab('weekend')} className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Weekend School
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="relative w-full mb-6 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-x-auto md:overflow-visible hidden md:grid md:grid-cols-3 gap-1.5">
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
              <TabsTrigger 
                value="stem" 
                ref={tabRefs.stem}
                className="flex items-center whitespace-nowrap space-x-2 py-3 px-5 font-semibold rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kc-blue/30 data-[state=active]:bg-kc-blue data-[state=active]:text-white data-[state=inactive]:text-slate-700 data-[state=inactive]:hover:bg-slate-50 border border-transparent data-[state=active]:border-kc-blue/70 shadow-sm snap-start"
              >
                <FlaskConical className="h-5 w-5" />
                <span>STEM Program</span>
              </TabsTrigger>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
              <TabsTrigger 
                value="summer" 
                ref={tabRefs.summer}
                className="flex items-center whitespace-nowrap space-x-2 py-3 px-5 font-semibold rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kc-blue/30 data-[state=active]:bg-kc-blue data-[state=active]:text-white data-[state=inactive]:text-slate-700 data-[state=inactive]:hover:bg-slate-50 border border-transparent data-[state=active]:border-kc-blue/70 shadow-sm snap-start"
              >
                <GraduationCap className="h-5 w-5" />
                <span>Summer Education</span>
              </TabsTrigger>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
              <TabsTrigger 
                value="weekend" 
                ref={tabRefs.weekend}
                className="flex items-center whitespace-nowrap space-x-2 py-3 px-5 font-semibold rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kc-blue/30 data-[state=active]:bg-kc-blue data-[state=active]:text-white data-[state=inactive]:text-slate-700 data-[state=inactive]:hover:bg-slate-50 border border-transparent data-[state=active]:border-kc-blue/70 shadow-sm snap-start"
              >
                <Calendar className="h-5 w-5" />
                <span>Weekend School</span>
              </TabsTrigger>
            </motion.div>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value={activeTab} className="mt-0">
            <motion.div whileHover={{ scale: 1.003 }} transition={{ duration: 0.2 }}>
              <Card className="shadow-md overflow-hidden bg-white border border-slate-200 rounded-3xl">
                <CardContent className="p-0">
                  <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] min-h-[320px]">
                    {/* Image Section */}
                    <div className="relative h-52 sm:h-64 lg:h-full">
                      <motion.img 
                        src={currentProject.image} 
                        alt={currentProject.title}
                        className="w-full h-full object-cover lg:rounded-l-3xl"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 140, damping: 18 }}
                      />
                    </div>

                    {/* Content Section */}
                    <div className="p-5 sm:p-7 lg:p-8 flex flex-col justify-center bg-white">
                      <div className="inline-flex items-center gap-3 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-kc-blue text-white flex items-center justify-center">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-500">
                          Core Program
                        </div>
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl font-heading font-bold mb-3 text-slate-900">
                        {currentProject.title}
                      </h3>
                      
                      <p className="text-slate-600 leading-relaxed mb-5 md:mb-6">
                        {currentProject.description}
                      </p>

                      {/* Features List */}
                      <div className="space-y-2.5 md:space-y-3.5 mb-5 md:mb-6">
                        {currentProject.features.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -8 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ delay: index * 0.03, duration: 0.3 }}
                            className="flex items-start space-x-3"
                          >
                            <CheckCircle className="h-5 w-5 text-kc-blue mt-1 flex-shrink-0" />
                            <span className="text-slate-700">{feature}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Additional Details */}
                      {currentProject.details && (
                        <div className="mb-6 md:mb-8">
                          <h4 className="font-semibold mb-3 text-slate-900">Additional Details</h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                            {currentProject.details.map((d, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-kc-blue" />
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Stats row */}
                      <div className="mt-2 md:mt-3 flex flex-wrap gap-2.5">
                        {currentProject.stats.map((stat, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ y: -1 }}
                            transition={{ duration: 0.18 }}
                            className="px-3 py-2 rounded-full bg-slate-100 text-slate-800 text-xs sm:text-sm flex items-center gap-2"
                          >
                            <span className="font-semibold text-slate-900">{stat.number}</span>
                            <span className="text-slate-600">{stat.label}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* CTA Buttons */}
                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        {(() => {
                          const enrollHref = activeTab === 'stem'
                            ? '/stem'
                            : activeTab === 'summer'
                              ? '/projects/summer-education'
                            : '/projects/weekend-school';
                          const learnHref = activeTab === 'stem'
                            ? '/projects/stem'
                            : activeTab === 'summer'
                              ? '/projects/summer-education'
                              : '/projects/weekend-school';
                          return (
                            <>
                              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                                <Button 
                                  variant="blue"
                                  size="lg"
                                  className="group font-semibold w-full sm:w-auto"
                                  asChild
                                >
                                  <Link to={enrollHref}>
                                    Enroll Now
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                  </Link>
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                                <Button 
                                  variant="blackOutline"
                                  size="lg"
                                  className="w-full sm:w-auto"
                                  asChild
                                >
                                  <Link to={learnHref}>Learn More</Link>
                                </Button>
                              </motion.div>
                              
                            </>
                          );
                        })()}
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
                    <h3 className="text-2xl font-heading font-bold">National STEM Competition</h3>
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
                      <Link to="/stem">
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
                      December 2025 - Registration opens in September
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