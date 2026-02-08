import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Users2, 
  Trophy, 
  Lightbulb, 
  Heart, 
  ArrowRight 
} from "lucide-react";
import studentsImage from "@/assets/hero-image3.jpeg";
import scienceLabImage from "@/assets/hero-image2.jpeg";
import sportsImage from "@/assets/hero-image5.jpeg";

const Activities = () => {
  const activities = [
    {
      icon: BookOpen,
      title: "Tutoring",
      description: "Building from a rich repertoire of books and question papers, combined with novel material developed by the KC staff, we have put together a curriculum that sets students on a course to acing their GCE examinations.",
      details: "KC has as teachers, some of the smartest minds in the country, who teach with unbridled commitment and love.",
      image: studentsImage
    },
    {
      icon: Users2,
      title: "Mentorship",
      description: "At KC, every student gets to pick out a teacher that inspires them, and whom they feel can spur them unto achieving the very best, not just in the GCE exams, but at life.",
      details: "We don't just think about today, or tomorrow, but of a generation.",
      image: scienceLabImage
    },
    {
      icon: Heart,
      title: "Sports and Recreation",
      description: "Every once in a while, we seal the pages of our books and just head out into the sun. To play, to laugh, and to live.",
      details: "Building character and fostering teamwork beyond the classroom.",
      image: sportsImage
    },
    {
      icon: Lightbulb,
      title: "Projects",
      description: "KC provides a fund which students trying to build useful science projects can benefit from. We don't just end at the classroom, we are looking to the real world.",
      details: "Supporting innovation and practical application of scientific knowledge.",
      image: scienceLabImage
    },
    {
      icon: Trophy,
      title: "Competitions",
      description: "We believe in healthy competition between students as it helps them improve upon themselves; we equally believe in rewarding effort and excellence.",
      details: "KC hosts an annual STEM Competition to foster scientific thinking and reward excellence.",
      image: studentsImage
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="heading-2 text-center mb-12 text-kc-blue">
            Our Activities
          </h2>
          <p className="text-xl text-kc-black/80 max-w-3xl mx-auto leading-relaxed">
            Comprehensive programs designed to nurture scientific minds and build character, 
            preparing students for academic excellence and life success.
          </p>
        </div>

        {/* Activities Grid */}
        <div className="space-y-16">
          {activities.map((activity, index) => (
            <Card 
              key={index} 
              className={`shadow-card border border-border overflow-hidden transition-smooth hover:shadow-hover ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              }`}
            >
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2 min-h-[400px]">
                  {/* Image Section */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={activity.image} 
                      alt={activity.title}
                      className="w-full h-full object-cover transition-transform hover:scale-110 duration-700"
                      loading="lazy"
                      decoding="async"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className={`w-16 h-16 bg-kc-blue rounded-full flex items-center justify-center mb-6`}>
                      <activity.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="heading-3 mb-4 text-kc-blue">{activity.title}</h3>
                    
                    <p className="text-kc-black/80 leading-relaxed mb-4">
                      {activity.description}
                    </p>
                    
                    <p className="text-kc-black/70 leading-relaxed mb-6 font-medium">
                      {activity.details}
                    </p>

                    <Button 
                      variant="outline" 
                      className="w-fit group"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="bg-white border border-border rounded-2xl p-8 lg:p-12 shadow-card">
              <h3 className="text-3xl font-heading font-bold mb-4 text-kc-blue">
                Join Our Learning Community
              </h3>
              <p className="text-kc-black/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                Experience the perfect blend of academic excellence, mentorship, and personal growth. 
                Become part of the KC family where passion meets academic drive.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="blue"
                  size="lg"
                  className="font-semibold"
                >
                  Explore Programs
                </Button>
                <Button 
                  variant="blackOutline"
                  size="lg"
                  className="font-semibold"
                >
                  Schedule a Visit
                </Button>
              </div>
            </div>
          </div>
      </div>
    </section>
  );
};

export default Activities;

