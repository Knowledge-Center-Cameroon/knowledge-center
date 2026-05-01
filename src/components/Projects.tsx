/**
 * Projects Component - Showcase of Knowledge Center programs
 * 
 * Features:
 * - Tabbed interface for multiple programs
 * - Card-based project display
 * - Responsive grid layout
 * - Hover effects and animations
 * - Feature lists for each project
 * 
 * Semantic Structure:
 * - H2 project titles
 * - Proper card hierarchy
 * - Feature lists (ul/li)
 * - CTA buttons with clear labels
 */
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
  CheckCircle,
  Globe
} from "lucide-react";
import { ChevronDown } from "lucide-react";
import Stem from "@/assets/stem.jpg";
import weekend from "@/assets/weekend.jpeg";
import summer2 from "@/assets/summer2.jpeg"
import global from "@/assets/global.png"
import { motion } from "framer-motion";
import StemBackground from "@/components/StemBackground";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Projects Component - Display KC's flagship programs and projects
 */
const Projects = () => {
  const [activeTab, setActiveTab] = useState("gsp");

  const projects = {
    gsp: {
      title: "Global Scholars Program",
      icon: Globe,
      description: "We prepare scholars for opportunities beyond borders—competitive scholarships, exchange programs, and global leadership.",
      image: global,
      features: [
        "Mentorship from seasoned staff and alumni",
        "Application strategy for global opportunities",
        "Career orientation and leadership projects",
        "Training on essays, statements, and interviews",
        "SAT/ACT/TOEFL prep and timelines",
        "Progress tracking across milestones"
      ],
      details: [
        "When: Year‑round with intensive programs",
        "Focus: Essays, testing, recommendations, portfolios",
        "Support: 1:1 mentorship and peer reviews",
        "Outcomes: Competitive applications and global placement"
      ],
      stats: [
        { number: "100+", label: "Scholars Placed" },
        { number: "100%", label: "Mentorship" },
        { number: "15+", label: "Partner Universities" }
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
        "Format: Mordern classrooms with audio-visual lectures",
        "Extras: Free T-Shirts and Swag",
        "Outcome: Extracurricular skills"
      ],
      stats: [
        { number: "500+", label: "Summer Participants" },
        { number: "8", label: "Weeks Duration" },
        { number: "20+", label: "Expert Instructors" }
      ]
    },
    stem: {
      title: "National STEM Project",
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
    }
  };

  const currentProject = projects[activeTab as keyof typeof projects];
  const Icon = currentProject.icon;

  // Refs for auto-centering active tab on mobile
  const tabRefs: Record<"gsp" | "summer" | "stem", React.RefObject<HTMLButtonElement>> = {
    gsp: useRef<HTMLButtonElement>(null),
    summer: useRef<HTMLButtonElement>(null),
    stem: useRef<HTMLButtonElement>(null),
  };

  useEffect(() => {
    const ref = tabRefs[activeTab as "gsp" | "summer" | "stem"]; // narrow type
    ref?.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeTab]);

  return (
    <section id="projects" className="py-12 md:py-14 lg:py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8 lg:mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-border rounded-full px-5 py-1.5 mb-4">
            <span className="h-2 w-2 rounded-full bg-kc-blue" />
            <span className="text-xs font-semibold tracking-[0.18em] text-kc-black/70 uppercase">Programs</span>
          </div>
          <h2 className="home-section-heading mb-3">
            Signature learning experiences
          </h2>
          <p className="text-sm md:text-base text-kc-black/70 max-w-3xl mx-auto leading-relaxed">
            Explore the core programs that shape how Knowledge Center supports young scientists across Cameroon.
          </p>
        </motion.div>

        {/* Mobile Menu (Navbar-style) */}
        <div className="md:hidden mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="blackOutline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  {activeTab === 'gsp' && <Globe className="h-4 w-4" />}
                  {activeTab === 'summer' && <GraduationCap className="h-4 w-4" />}
                  {activeTab === 'stem' && <FlaskConical className="h-4 w-4" />}
                  {projects[activeTab as 'gsp'|'summer'|'stem'].title}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
              <DropdownMenuItem onSelect={() => setActiveTab('gsp')} className="flex items-center gap-2">
                <Globe className="h-4 w-4" /> Global Scholars
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setActiveTab('summer')} className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" /> Summer Education
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setActiveTab('stem')} className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4" /> STEM Program
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="hidden md:flex justify-center w-full mb-8">
            <TabsList className="relative p-1.5 rounded-full bg-white border border-border shadow-sm inline-flex gap-1 h-auto">
              <TabsTrigger 
                value="gsp" 
                ref={tabRefs.gsp}
                className="flex items-center space-x-2 py-2 px-5 text-sm font-semibold rounded-full transition-all focus-visible:outline-none data-[state=active]:bg-kc-blue data-[state=active]:text-white data-[state=inactive]:text-kc-black/70 data-[state=inactive]:hover:bg-kc-blue/5 data-[state=inactive]:hover:text-kc-black shadow-none data-[state=active]:shadow-sm"
              >
                <Globe className="h-4 w-4" />
                <span>Global Scholars</span>
              </TabsTrigger>
              <TabsTrigger 
                value="summer" 
                ref={tabRefs.summer}
                className="flex items-center space-x-2 py-2 px-5 text-sm font-semibold rounded-full transition-all focus-visible:outline-none data-[state=active]:bg-kc-blue data-[state=active]:text-white data-[state=inactive]:text-kc-black/70 data-[state=inactive]:hover:bg-kc-blue/5 data-[state=inactive]:hover:text-kc-black shadow-none data-[state=active]:shadow-sm"
              >
                <GraduationCap className="h-4 w-4" />
                <span>Summer Education</span>
              </TabsTrigger>
              <TabsTrigger 
                value="stem" 
                ref={tabRefs.stem}
                className="flex items-center space-x-2 py-2 px-5 text-sm font-semibold rounded-full transition-all focus-visible:outline-none data-[state=active]:bg-kc-blue data-[state=active]:text-white data-[state=inactive]:text-kc-black/70 data-[state=inactive]:hover:bg-kc-blue/5 data-[state=inactive]:hover:text-kc-black shadow-none data-[state=active]:shadow-sm"
              >
                <FlaskConical className="h-4 w-4" />
                <span>STEM Program</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <TabsContent value={activeTab} className="mt-0">
            <motion.div whileHover={{ scale: 1.003 }} transition={{ duration: 0.2 }}>
              <Card className="shadow-md overflow-hidden bg-white/95 border border-kc-blue/10 ring-1 ring-kc-blue/5 rounded-3xl">
                <CardContent className="p-0">
                  <div className="grid lg:grid-cols-[4fr_5fr] min-h-[320px]">
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
                    <div className="p-5 sm:p-6 lg:p-8 lg:py-7 flex flex-col justify-center bg-white">
                      <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-kc-blue/10 text-kc-blue ring-1 ring-kc-blue/20 flex items-center justify-center">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-kc-black/60">
                          Core Program
                        </div>
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl font-heading font-bold mb-2 text-kc-blue">
                        {currentProject.title}
                      </h3>
                      
                      <p className="text-kc-black/70 text-sm leading-relaxed mb-5">
                        {currentProject.description}
                      </p>

                      {/* Features List */}
                      <div className="space-y-2 mb-5">
                        {currentProject.features.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -8 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ delay: index * 0.03, duration: 0.3 }}
                            className="flex items-start space-x-2.5 text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-kc-blue mt-0.5 flex-shrink-0" />
                            <span className="text-kc-black/80">{feature}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Additional Details */}
                      {currentProject.details && (
                        <div className="mb-5">
                          <h4 className="font-semibold text-sm mb-2 text-kc-blue">Additional Details</h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 text-[13px] text-kc-black/80">
                            {currentProject.details.map((d, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="mt-1.5 h-1 w-1 rounded-full bg-kc-blue flex-shrink-0" />
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Stats row */}
                      <div className="mt-1 flex flex-wrap gap-2">
                        {currentProject.stats.map((stat, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ y: -1 }}
                            transition={{ duration: 0.18 }}
                            className="px-2.5 py-1.5 rounded-full bg-kc-blue/5 text-kc-black/80 text-xs flex items-center gap-1.5"
                          >
                            <span className="font-semibold text-kc-blue">{stat.number}</span>
                            <span className="text-kc-black/70">{stat.label}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* CTA Buttons */}
                      <div className="mt-5 flex flex-col sm:flex-row gap-3">
                        {(() => {
                          const enrollHref = activeTab === 'stem'
                            ? '/stem'
                            : activeTab === 'summer'
                              ? '/projects/summer-education'
                            : '/gsp';
                          const learnHref = activeTab === 'stem'
                            ? '/projects/stem'
                            : activeTab === 'summer'
                              ? '/projects/summer-education'
                              : '/projects/gsp';
                          return (
                            <>
                              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                                <Button 
                                  variant="blue"
                                  className="group font-semibold w-full sm:w-auto h-10 px-6"
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
                                  className="w-full sm:w-auto h-10 px-6"
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
          <Card className="relative overflow-hidden bg-white/95 text-kc-black border border-kc-blue/10 ring-1 ring-kc-blue/5 shadow-card">
            {/* subtle glow accents */}
            <div className="pointer-events-none absolute -top-32 -left-24 h-64 w-64 rounded-full bg-kc-blue/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-24 h-64 w-64 rounded-full bg-kc-blue/10 blur-3xl" />

            <CardContent className="relative p-6 sm:p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="inline-flex items-center gap-3 mb-4 rounded-full bg-kc-blue/10 px-3 py-1 border border-kc-blue/20 text-xs font-semibold uppercase tracking-[0.18em]">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-kc-blue">
                      <Trophy className="h-3.5 w-3.5 text-white" />
                    </span>
                    <span className="text-kc-blue">Flagship Competition</span>
                  </div>

                  <div className="flex items-center gap-3 mb-5">
                    <h3 className="text-2xl sm:text-3xl font-heading font-bold leading-tight text-kc-blue">
                      National STEM Competition
                    </h3>
                  </div>
                  
                  <p className="text-kc-black/80 leading-relaxed mb-4 sm:mb-5 text-sm sm:text-base">
                    The KC STEM (Science, Technology, Engineering, and Mathematics) Competition,
                    whose first edition took place in December of 2021, is an annual national
                    (Cameroon) scientific contest organized by Knowledge Center (KC) to foster
                    scientific thinking in students.
                  </p>
                  
                  <p className="text-kc-black/70 leading-relaxed mb-6 sm:mb-7 text-sm sm:text-base">
                    We challenge participants with thought‑provoking questions that push them
                    beyond routine memorisation, helping them unlock creativity, critical
                    thinking, and real problem‑solving skills.
                  </p>

                  <motion.div
                    className="inline-flex"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <Button
                      variant="blue"
                      size="lg"
                      className="group font-semibold rounded-full px-6 sm:px-7 "
                      asChild
                    >
                      <Link to="/stem">
                        <span>Join Competition</span>
                        <Trophy className="ml-2 h-4 w-4 group-hover:scale-110 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="space-y-5 sm:space-y-6"
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      className="bg-white/95 rounded-3xl p-4 text-center border border-kc-blue/10 ring-1 ring-kc-blue/5 shadow-card"
                      whileHover={{ y: -3, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    >
                      <Target className="h-8 w-8 text-kc-blue mx-auto mb-2" />
                      <div className="text-xl sm:text-2xl font-heading font-bold text-kc-blue">Annual</div>
                      <div className="text-xs sm:text-sm text-kc-black/70">Competition</div>
                    </motion.div>
                    <motion.div
                      className="bg-white/95 rounded-3xl p-4 text-center border border-kc-blue/10 ring-1 ring-kc-blue/5 shadow-card"
                      whileHover={{ y: -3, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    >
                      <Award className="h-8 w-8 text-kc-blue mx-auto mb-2" />
                      <div className="text-xl sm:text-2xl font-heading font-bold text-kc-blue">National</div>
                      <div className="text-xs sm:text-sm text-kc-black/70">Recognition</div>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    className="relative bg-white/95 rounded-3xl p-5 sm:p-6 border border-kc-blue/10 ring-1 ring-kc-blue/5 shadow-card overflow-hidden"
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  >
                    <div className="pointer-events-none absolute -top-10 -right-4 h-20 w-20 rounded-full bg-kc-blue/20 blur-2xl" />
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-kc-blue/80 text-[10px]">KC</span>
                      <span>Next Competition</span>
                    </h4>
                    <p className="text-kc-black/70 text-xs sm:text-sm mb-3">
                      December 2026 &mdash; registration opens in September.
                    </p>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-kc-black/70">
                      <Clock className="h-4 w-4 text-kc-blue" />
                      <span>Driving innovation, problem-solving and creativity.</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  );
};

export default Projects;

