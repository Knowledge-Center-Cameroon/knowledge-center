import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Target, 
  Heart, 
  Lightbulb, 
  BookOpen, 
  Trophy, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import about from "@/assets/about.jpeg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import StemBackground from "@/components/StemBackground";

const About = () => {
  const [openFaq, setOpenFaq] = useState<string | undefined>("item-0");

  const values = [
    {
      icon: Heart,
      title: "Family & Love",
      description: "At KC, we are not just a group of teachers and students; we are a family bound by love and mutual respect."
    },
    {
      icon: Lightbulb,
      title: "Scientific Curiosity",
      description: "We foster unprecedented levels of scientific curiosity and creativity in our students."
    },
    {
      icon: Users,
      title: "Compassion & Honesty",
      description: "We instill humanitarian values such as compassion and honesty, essential for meaningful scientific progress."
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We aim for nothing less than the best, setting students on a course to acing their GCE examinations and beyond."
    }
  ];

  const faqs = [
    {
      question: "What is Knowledge Center (KC)?",
      answer: "Knowledge Center (KC) is an educational institution founded in November 2019 by academically high-achieving university freshmen passionate about helping future generations of science students succeed in their academic endeavors, especially at their end-of-course GCE examinations."
    },
    {
      question: "What subjects do you offer tutoring in?",
      answer: "We specialize in STEM subjects including Mathematics, Physics, Chemistry, Biology, and Computer Science. Our curriculum is built from a rich repertoire beyond books and question papers, combined with novel material developed by our dedicated staff."
    },
    {
      question: "Who can join KC programs?",
      answer: "Our programs are designed for young Cameroonians passionate about science and mathematics. We welcome students preparing for GCE examinations and those looking to deepen their understanding of STEM subjects."
    },
    {
      question: "How do you support students beyond academics?",
      answer: "Beyond classroom instruction, we provide mentorship programs, sports and recreation activities, project funding for science initiatives, and host annual STEM competitions to foster healthy competition and reward excellence."
    },
    {
      question: "What makes KC different from other educational institutions?",
      answer: "We combine rigorous academic instruction with humanitarian values, creating a family environment where scientific obsession meets compassion, honesty, and love. Every student gets a personal mentor, and we focus on real-world applications of scientific concepts."
    }
  ];

  return (
    <section id="about" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl mb-16">
          <StemBackground opacity={0.15} density={36} lineDistance={120} speed={0.45} showIcons={true} />
          <div className="relative z-10 text-center py-8">
            <h2 className="heading-2 mb-6">
              <span className="text-kc-blue">About</span> <span className="text-kc-red">Knowledge Center</span>
            </h2>
            <p className="subheading max-w-3xl mx-auto leading-relaxed">
              Discover our journey from a small act of community service to a far bigger odyssey 
              of scientific and humanitarian engagement.
            </p>
          </div>
        </div>

        {/* Who We Are Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="animate-slide-up">
            <h3 className="text-3xl font-heading font-bold mb-6">Who We Are</h3>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-6">
                Knowledge Center (KC) is an educational institution that was founded in November of 2019 
                by a group of academically high-achieving university freshmen who were passionate about 
                helping future generations of science students succeed in their academic endeavors, 
                especially at their end-of-course GCE examinations.
              </p>
              
              <p className="text-muted-foreground leading-relaxed mb-6">
                From this small act of community service, KC has blossomed into a far bigger odyssey 
                of scientific and humanitarian engagement.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                We tutor young Cameroonians, and growing scientists, unto unprecedented levels of 
                scientific curiosity, creativity, and love. We try, as best we can, while teaching 
                them to look a little beyond the scope of examinations and help them see the applications 
                and manifestations of the concepts they learn.
              </p>
            </div>
          </div>
          
          <div className="animate-slide-up">
            <img 
              src={about} 
              alt="KC Students together" 
              className="rounded-2xl shadow-elegant w-full"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <Card className="shadow-elegant transition-bounce hover:scale-105">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-kc-blue rounded-full flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To tutor young Cameroonians unto unprecedented levels of scientific curiosity, 
                creativity, and love, while instilling humanitarian values such as compassion 
                and honesty, essential for meaningful progress in science and life.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant transition-bounce hover:scale-105">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-kc-red rounded-full flex items-center justify-center mb-6">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To inspire a generation of creative thinkers who see beyond examinations, 
                fostering scientific minds that can solve real-world problems while maintaining 
                strong humanitarian values and contributing to the betterment of society.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <h3 className="text-3xl font-heading font-bold text-center mb-12">Our Core Values</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="shadow-elegant text-center transition-bounce hover:scale-105">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-kc-black rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-lg font-heading font-semibold mb-3">{value.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-muted-foreground italic max-w-4xl mx-auto leading-relaxed">
              "At KC, we have family, friendship, scientific obsession, resilience, hard work, 
              humility, honesty, kindness, and love as our core values. Family, epiphany, serendipity, 
              and scientific obsession in some unknown permutation - this is who we are."
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h3 className="text-3xl font-heading font-bold text-center mb-8 md:mb-10">Frequently Asked Questions</h3>
          <Accordion type="single" collapsible value={openFaq} onValueChange={setOpenFaq} className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-xl mb-3 md:mb-4 overflow-hidden bg-white/5 backdrop-blur-sm">
                <AccordionTrigger className="px-5 md:px-6 py-4 md:py-5 text-left font-semibold hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <span>{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 md:px-6 pb-5 md:pb-6 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default About;