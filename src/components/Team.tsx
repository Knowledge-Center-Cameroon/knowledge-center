import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LinkedinIcon, 
  Mail, 
  GraduationCap,
  Award,
  Users,
  Heart
} from "lucide-react";

const Team = () => {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  const teamMembers = [
    {
      name: "Dr. Emmanuel Tabi",
      role: "Founder & Director",
      education: "PhD Physics, University of Buea",
      bio: "Passionate educator with over 8 years of experience in STEM education. Founded KC with a vision to transform science education in Cameroon.",
      achievements: ["Best Teacher Award 2020", "STEM Education Pioneer", "Published 15+ Research Papers"],
      email: "emmanuel@kccameroon.com",
      linkedin: "#",
      avatar: "ET"
    },
    {
      name: "Sarah Mbaku",
      role: "Head of Mathematics",
      education: "MSc Mathematics, University of Yaoundé I",
      bio: "Mathematics enthusiast who believes in making complex concepts simple and accessible to all students.",
      achievements: ["Mathematics Olympiad Coach", "Curriculum Developer", "Student Mentor of the Year"],
      email: "sarah@kccameroon.com",
      linkedin: "#",
      avatar: "SM"
    },
    {
      name: "Dr. Peter Ngwa",
      role: "Physics & Chemistry Lead",
      education: "PhD Chemistry, University of Douala",
      bio: "Research scientist turned educator, bringing real-world laboratory experience to the classroom.",
      achievements: ["Research Excellence Award", "Lab Safety Expert", "Innovation in Teaching"],
      email: "peter@kccameroon.com",
      linkedin: "#",
      avatar: "PN"
    },
    {
      name: "Grace Fon",
      role: "Biology & Environmental Science",
      education: "MSc Biology, University of Bamenda",
      bio: "Environmental scientist passionate about connecting biology to real-world environmental challenges.",
      achievements: ["Environmental Education Award", "Field Research Expert", "Community Outreach Leader"],
      email: "grace@kccameroon.com",
      linkedin: "#",
      avatar: "GF"
    },
    {
      name: "John Atanga",
      role: "Technology & Engineering",
      education: "BSc Computer Engineering, University of Buea",
      bio: "Tech innovator bridging the gap between traditional education and modern technology solutions.",
      achievements: ["Tech Innovation Award", "Coding Workshop Leader", "Digital Literacy Advocate"],
      email: "john@kccameroon.com",
      linkedin: "#",
      avatar: "JA"
    },
    {
      name: "Marie Kom",
      role: "Student Affairs Coordinator",
      education: "BSc Psychology, University of Yaoundé I",
      bio: "Dedicated to ensuring every student feels supported and motivated throughout their learning journey.",
      achievements: ["Student Counselor Certification", "Mentorship Program Director", "Youth Development Specialist"],
      email: "marie@kccameroon.com",
      linkedin: "#",
      avatar: "MK"
    }
  ];

  const handleCardClick = (index: number) => {
    setFlippedCard(flippedCard === index ? null : index);
  };

  return (
    <section id="team" className="py-20 lg:py-32 bg-gradient-subtle">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold mb-6">
            Meet Our <span className="text-gradient">Team</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            With a vibrant and committed staff body, we aim for nothing less than the best. 
            Meet the passionate educators who make KC's mission a reality.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <div 
              key={index} 
              className="relative h-80 cursor-pointer perspective-1000"
              onClick={() => handleCardClick(index)}
            >
              <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
                flippedCard === index ? 'rotate-y-180' : ''
              }`}>
                {/* Front of Card */}
                <Card className="absolute inset-0 card-gradient shadow-elegant backface-hidden">
                  <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
                    {/* Avatar */}
                    <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-playfair font-bold mb-4">
                      {member.avatar}
                    </div>
                    
                    <h3 className="text-xl font-playfair font-bold mb-2">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm mb-4">{member.education}</p>
                    
                    <div className="text-xs text-muted-foreground opacity-70">
                      Click to learn more
                    </div>
                  </CardContent>
                </Card>

                {/* Back of Card */}
                <Card className="absolute inset-0 card-gradient shadow-elegant backface-hidden rotate-y-180">
                  <CardContent className="p-6 h-full flex flex-col">
                    <h3 className="text-lg font-playfair font-bold mb-3">{member.name}</h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed flex-1">
                      {member.bio}
                    </p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        Achievements
                      </h4>
                      <ul className="space-y-1">
                        {member.achievements.slice(0, 2).map((achievement, i) => (
                          <li key={i} className="text-xs text-muted-foreground">
                            • {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Mail className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                      <Button size="sm" variant="ghost" className="px-3">
                        <LinkedinIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* Team Values */}
        <div className="bg-gradient-primary rounded-2xl p-8 lg:p-12 text-white">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-playfair font-bold mb-4">Our Team Values</h3>
            <p className="text-white/90 max-w-2xl mx-auto">
              United by shared values and a common mission to transform STEM education in Cameroon.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Family & Love</h4>
              <p className="text-white/80 text-sm">
                We believe in creating a family environment where every member feels valued and supported.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Excellence</h4>
              <p className="text-white/80 text-sm">
                We are committed to delivering the highest quality education and achieving exceptional results.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Collaboration</h4>
              <p className="text-white/80 text-sm">
                Together, we achieve more. Our collaborative approach ensures comprehensive student support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;