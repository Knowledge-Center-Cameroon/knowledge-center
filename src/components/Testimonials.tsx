import React from "react";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

// Replace these with real images in `src/assets/` or served from `public/`
const TESTIMONIALS = [
  {
    name: "Amara N.",
    role: "STEM Scholar",
    company: "Cohort '24",
    quote:
      "Knowledge Center transformed my confidence. I shipped my first data app and landed a summer internship!",
    image: "/image1.jpg",
    initials: "AN",
    rating: 5,
  },
  {
    name: "Kofi B.",
    role: "Robotics Lead",
    company: "TechStars Club",
    quote:
      "The mentorship was world-class. The workshops felt practical and industry-ready—no fluff, just value.",
    image: "/logo.jpeg",
    initials: "KB",
    rating: 5,
  },
  {
    name: "Zara I.",
    role: "Software Fellow",
    company: "Open Source",
    quote:
      "From zero to contributing to open-source in weeks. The community support is unmatched.",
    image: "/logo_trans.png",
    initials: "ZI",
    rating: 5,
  },
  {
    name: "David O.",
    role: "AI Enthusiast",
    company: "ML Guild",
    quote:
      "Clear path, great peers, and hands-on learning. I finally built my first end‑to‑end ML project.",
    image: "/logo.jpeg",
    initials: "DO",
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
            Real voices from our community—students, mentors, and builders who turned ambition into outcomes.
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
      </div>
    </section>
  );
};

export default Testimonials;
