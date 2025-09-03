import React, { useState } from "react";
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
import scienceLabImage from "@/assets/science-lab.jpg";
import studentsImage from "@/assets/students-studying.jpg";

const Projects = () => {
  const [activeTab, setActiveTab] = useState("stem");

  const projects = {
    stem: {
      title: "STEM Education Program",
      icon: FlaskConical,
      description: "Our flagship program focusing on Science, Technology, Engineering, and Mathematics education for young Cameroonians.",
      image: scienceLabImage,
      features: [
        "Comprehensive curriculum covering Physics, Chemistry, Biology, and Mathematics",
        "Hands-on laboratory experiments and practical sessions",
        "Individual mentorship and academic guidance", 
        "Preparation for GCE examinations and beyond",
        "Project-based learning with real-world applications",
        "Access to modern educational resources and materials"
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
      description: "Intensive summer sessions designed to accelerate learning and provide enrichment opportunities during school breaks.",
      image: studentsImage,
      features: [
        "6-week intensive learning program",
        "Advanced topics and accelerated curriculum",
        "Field trips to research institutions and universities",
        "Guest lectures from industry professionals",
        "Collaborative group projects and presentations",
        "Certificate of completion and achievement recognition"
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
      image: scienceLabImage,
      features: [
        "Saturday and Sunday class options",
        "Flexible scheduling to accommodate regular school",
        "Small class sizes for personalized attention",
        "Supplementary materials and practice exercises",
        "Peer tutoring and collaborative learning",
        "Progress tracking and regular assessments"
      ],
      stats: [
        { number: "300+", label: "Weekend Learners" },
        { number: "12", label: "Subjects Offered" },
        { number: "8", label: "Hours per Weekend" }
      ]
    }
  };

  const currentProject = projects[activeTab as keyof typeof projects];

  return (
    <section id="projects" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
          <span className="text-kc-blue">Our</span> <span className="text-kc-red">Projects</span>
        </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Comprehensive educational programs designed to meet diverse learning needs 
            and empower students at every stage of their academic journey.
          </p>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-12 bg-muted/50 p-2 rounded-xl">
            <TabsTrigger 
              value="stem" 
              className="flex items-center space-x-2 py-4 px-6 data-[state=active]:bg-gradient-primary data-[state=active]:text-white font-semibold"
            >
              <FlaskConical className="h-5 w-5" />
              <span>STEM Program</span>
            </TabsTrigger>
            <TabsTrigger 
              value="summer" 
              className="flex items-center space-x-2 py-4 px-6 data-[state=active]:bg-gradient-primary data-[state=active]:text-white font-semibold"
            >
              <GraduationCap className="h-5 w-5" />
              <span>Summer Education</span>
            </TabsTrigger>
            <TabsTrigger 
              value="weekend" 
              className="flex items-center space-x-2 py-4 px-6 data-[state=active]:bg-gradient-primary data-[state=active]:text-white font-semibold"
            >
              <Calendar className="h-5 w-5" />
              <span>Weekend School</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value={activeTab} className="mt-0">
            <Card className="card-gradient shadow-elegant overflow-hidden">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2 min-h-[600px]">
                  {/* Image Section */}
                  <div className="relative">
                    <img 
                      src={currentProject.image} 
                      alt={currentProject.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-primary/20" />
                    
                    {/* Stats Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-6">
                      <div className="grid grid-cols-3 gap-4 text-white text-center">
                        {currentProject.stats.map((stat, index) => (
                          <div key={index}>
                            <div className="text-2xl font-heading font-bold">{stat.number}</div>
                            <div className="text-sm opacity-90">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="w-16 h-16 bg-kc-blue rounded-full flex items-center justify-center mb-6">
                      <currentProject.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-3xl font-heading font-bold mb-4">
                      {currentProject.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed mb-8">
                      {currentProject.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-4 mb-8">
                      {currentProject.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        variant="blue"
                        size="lg"
                        className="group font-semibold"
                      >
                        Enroll Now
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <Button 
                        variant="blackOutline"
                        size="lg"
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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

                  <Button 
                    variant="red"
                    size="lg"
                    className="font-semibold"
                  >
                    Join Competition
                    <Trophy className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                      <Target className="h-8 w-8 text-white mx-auto mb-2" />
                      <div className="text-2xl font-heading font-bold">Annual</div>
                      <div className="text-sm text-white/80">Competition</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                      <Award className="h-8 w-8 text-white mx-auto mb-2" />
                      <div className="text-2xl font-heading font-bold">National</div>
                      <div className="text-sm text-white/80">Recognition</div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <h4 className="font-semibold mb-2">Next Competition</h4>
                    <p className="text-white/80 text-sm mb-3">
                      December 2024 - Registration opens in September
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-white/80">
                      <Clock className="h-4 w-4" />
                      <span>3 months to prepare</span>
                    </div>
                  </div>
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