import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const bullets = [
  {
    title: "Reasoning over memorization",
    text: "KC trains clear thinking, defensible methods, and confident communication across STEM disciplines.",
  },
  {
    title: "Mentorship that multiplies",
    text: "Students get timely, specific feedback, with mentors and peers accelerating growth together.",
  },
  {
    title: "Programs that scale impact",
    text: "National STEM events, Summer Program, Weekend School, Prepa, and Global Scholars support real outcomes.",
  },
  {
    title: "Community and character",
    text: "We build family, courage, and curiosity—the habits that turn ideas into solutions for communities.",
  },
];

const AboutBand: React.FC = () => {
  return (
    <section className="py-10 md:py-14 lg:py-16" aria-labelledby="about-kc-heading">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="text-center mb-8 md:mb-10">
          <h2 id="about-kc-heading" className="text-2xl md:text-3xl font-heading font-bold">
            About <span className="text-kc-blue">Knowledge Center</span>
          </h2>
          <p className="text-foreground/80 mt-2 max-w-3xl mx-auto">
            We re‑imagine learning for young Cameroonians—turning curiosity into capability through rigorous teaching,
            mentorship, and programs that connect classroom ideas to real impact.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {bullets.map((b, i) => (
            <Card key={i} className="h-full bg-white/40 backdrop-blur-sm border-white/50 shadow-elegant">
              <CardContent className="p-5">
                <h3 className="font-semibold text-foreground mb-1">{b.title}</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{b.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link to="/about" className="inline-flex items-center gap-2 text-primary hover:underline">
            Learn more about KC
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutBand;
