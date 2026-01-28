/**
 * Testimonials Component - Student success stories and feedback
 */
import React from "react";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

// Student testimonials - Real feedback from KC students and success stories
const TESTIMONIALS = [
  {
    name: "Martha A.",
    role: "Upper Sixth – Physics",
    company: "Buea Hub",
    quote:
      "KC taught me how to think through a physics problem, not just memorize formulas. My grades improved, but more importantly I now understand why the answers work.",
    image: "/image1.jpg",
    initials: "MA",
    rating: 5,
  },
  {
    name: "Junior T.",
    role: "Form 5 – Chemistry",
    company: "Limbe Hub",
    quote:
      "Our tutor would always ask: 'What is the principle here?' That question changed how I study. KC’s experiments made abstract ideas real for me.",
    image: "/logo.jpeg",
    initials: "JT",
    rating: 5,
  },
  {
    name: "Sally N.",
    role: "Lower Sixth – Biology",
    company: "Douala Hub",
    quote:
      "I used to fear structured questions. KC broke them into steps, gave me feedback weekly, and now I score confidently in past papers.",
    image: "/kc_round_trans.png",
    initials: "SN",
    rating: 5,
  },
  {
    name: "Brian K.",
    role: "O/L – Mathematics",
    company: "Yaoundé Hub",
    quote:
      "KC’s method made me enjoy proofs. The mentors don’t give answers—they guide you to find them. That habit changed my results across subjects.",
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
        className={`h-4 w-4 ${i < value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
      />
    ))}
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const Testimonials: React.FC = () => {
  return (
    <section className="relative">
      {/* Background accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-background/50"
      />

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Success Stories
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real voices from students across KC hubs—how our approach to science education builds confidence, clarity, and results.
          </p>
        </div>

        {/* Desktop/Grid layout */}
        <motion.div
          className="mt-12 hidden gap-8 md:grid md:grid-cols-2 lg:mt-16 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
       >
          {TESTIMONIALS.map((t, idx) => (
            <motion.div key={idx} variants={cardVariants}>
              <Card
                className="group relative overflow-hidden border-border/60 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/40"
              >
                <div className="pointer-events-none absolute inset-x-0 -top-24 h-40 bg-gradient-to-b from-primary/10 to-transparent opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                <CardContent className="p-8 md:p-9">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-14 w-14 ring-2 ring-primary/20 shadow-sm">
                        <AvatarImage src={t.image} alt={t.name} />
                        <AvatarFallback>{t.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-lg font-semibold leading-tight">{t.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {t.role} • {t.company}
                        </p>
                      </div>
                    </div>
                    <StarRating value={t.rating} />
                  </div>

                  <div className="mt-6 flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                      <Quote className="h-4 w-4" />
                    </div>
                    <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                      “{t.quote}”
                    </p>
                  </div>
                </CardContent>
                <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-primary/10 blur-2xl transition-all duration-300 group-hover:-right-6 group-hover:-top-6" />
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile / Snap Carousel (no JS) */}
        <div className="mt-10 md:hidden">
          <motion.div
            className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {TESTIMONIALS.map((t, idx) => (
              <motion.div key={idx} className="snap-center shrink-0 basis-[90%]" variants={cardVariants}>
                <Card className="relative overflow-hidden border-border/60 shadow-sm transition-all duration-300 active:scale-[0.99]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                          <AvatarImage src={t.image} alt={t.name} />
                          <AvatarFallback>{t.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-base font-semibold leading-tight">{t.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {t.role} • {t.company}
                          </p>
                        </div>
                      </div>
                      <StarRating value={t.rating} />
                    </div>
                    <div className="mt-4 flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-1.5 text-primary">
                        <Quote className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-[15px] leading-relaxed text-muted-foreground">“{t.quote}”</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Avatar wall */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 opacity-90">
          {TESTIMONIALS.map((t, idx) => (
            <Avatar key={`wall-${idx}`} className="h-12 w-12">
              <AvatarImage src={t.image} alt={t.name} />
              <AvatarFallback>{t.initials}</AvatarFallback>
            </Avatar>
          ))}
        </div>

        {/* View more */}
        <div className="mt-10 text-center">
          <a href="/blog" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-kc-blue text-white font-semibold shadow hover:bg-kc-red transition-colors">
            View more stories
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
