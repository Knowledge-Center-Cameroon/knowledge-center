/**
 * Testimonials Component - Student success stories and feedback
 */
import React from "react";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TESTIMONIALS = [
  {
    name: "Martha A.",
    role: "Upper Sixth - Physics",
    company: "Buea Hub",
    quote:
      "KC taught me how to think through a physics problem, not just memorize formulas. My grades improved, but more importantly I now understand why the answers work.",
    image: "/image1.jpg",
    initials: "MA",
    rating: 5,
  },
  {
    name: "Junior T.",
    role: "Form 5 - Chemistry",
    company: "Limbe Hub",
    quote:
      "Our tutor would always ask: 'What is the principle here?' That question changed how I study. KC's experiments made abstract ideas real for me.",
    image: "/logo.jpeg",
    initials: "JT",
    rating: 5,
  },
  {
    name: "Sally N.",
    role: "Lower Sixth - Biology",
    company: "Douala Hub",
    quote:
      "I used to fear structured questions. KC broke them into steps, gave me feedback weekly, and now I score confidently in past papers.",
    image: "/kc_round_trans.png",
    initials: "SN",
    rating: 5,
  },
  {
    name: "Brian K.",
    role: "O/L - Mathematics",
    company: "Yaounde Hub",
    quote:
      "KC's method made me enjoy proofs. The mentors do not give answers - they guide you to find them. That habit changed my results across subjects.",
    image: "/logo.jpeg",
    initials: "BK",
    rating: 5,
  },
];

const StarRating: React.FC<{ value: number }> = ({ value }) => (
  <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < value ? "fill-kc-blue text-kc-blue" : "text-kc-gray/30"}`}
      />
    ))}
  </div>
);

const Testimonials: React.FC = () => {
  const marqueeItems = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-white" />

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="home-section-heading">Success Stories</h2>
          <p className="mt-4 text-lg text-kc-black/80">
            Real voices from students across KC hubs - how our approach to science education builds confidence, clarity, and results.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-border/60 bg-white py-4 md:py-5">
          <div className="testimonials-marquee">
            {marqueeItems.map((t, idx) => (
              <Card key={`${t.name}-${idx}`} className="mx-2 inline-block w-[320px] md:w-[360px] align-top overflow-hidden border-border/60 shadow-sm">
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-11 w-11 ring-2 ring-kc-blue/20">
                        <AvatarImage src={t.image} alt={t.name} />
                        <AvatarFallback>{t.initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm md:text-base font-semibold leading-tight truncate">{t.name}</p>
                        <p className="text-xs text-kc-black/70 truncate">
                          {t.role} - {t.company}
                        </p>
                      </div>
                    </div>
                    <StarRating value={t.rating} />
                  </div>
                  <div className="mt-3 flex items-start gap-2">
                    <Quote className="h-4 w-4 text-kc-blue mt-0.5 flex-shrink-0" />
                    <p className="text-sm md:text-[15px] leading-relaxed text-kc-black/70 line-clamp-3">
                      "{t.quote}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 opacity-90">
          {TESTIMONIALS.map((t, idx) => (
            <Avatar key={`wall-${idx}`} className="h-12 w-12">
              <AvatarImage src={t.image} alt={t.name} />
              <AvatarFallback>{t.initials}</AvatarFallback>
            </Avatar>
          ))}
        </div>

        <div className="mt-10 mb-4 md:mb-6 text-center">
          <a href="/blog" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-kc-blue text-white font-semibold shadow hover:bg-kc-blue-dark transition-colors">
            View more stories
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
