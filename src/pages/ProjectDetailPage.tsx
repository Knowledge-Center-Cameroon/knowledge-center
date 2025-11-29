import React from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { projects } from "@/data/projects";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";

const MotionButton = motion(Button);

const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl py-16">
        <p className="text-muted-foreground">Project not found.</p>
        <Button className="mt-4" variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Go back
        </Button>
      </div>
    );
  }

  // Simple per-project stats (fallbacks) for the statistics band
  const statsBySlug: Record<string, { label: string; value: string }[]> = {
    "stem": [
      { label: "Students Impacted", value: "2000+" },
      { label: "Success Rate", value: "95%" },
      { label: "Projects Completed", value: "50+" },
    ],
    "summer-education": [
      { label: "Participants", value: "200+" },
      { label: "Duration", value: "2 months" },
      { label: "Instructors", value: "20+" },
    ],
    "weekend-school": [
      { label: "Learners", value: "300+" },
      { label: "Subjects", value: "12" },
      { label: "Hours/Weekend", value: "8" },
    ],
  };
  const stats = statsBySlug[slug!] ?? [];

  // Carousel api for embla-based UI carousel
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  React.useEffect(() => {
    if (!api) return;
    setActiveIndex(api.selectedScrollSnap());
    const onSelect = () => setActiveIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);
  React.useEffect(() => { setActiveIndex(0); api?.scrollTo(0); }, [project.slug]);

  // Autoplay for project carousel
  React.useEffect(() => {
    if (!api) return;
    const id = setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, 4500);
    return () => clearInterval(id);
  }, [api]);

  // Per-project structured sections
  const stemSections = [
    {
      title: `What the STEM is?`,
      body: `A national reasoning-first competition where students tackle authentic, multi‑step STEM problems across Math, Physics, Chemistry, Biology and Computing. It's less about memorizing and more about thinking clearly, communicating methods, and defending ideas.`,
    },
    {
      title: `What impact has the STEM had?`,
      body: `2000+ students reached so far with 95% reporting improved problem‑solving confidence. Alumni have gone on to lead school clubs, win regional fairs, and secure scholarships after demonstrating rigorous thinking.`,
    },
    {
      title: `What we ask students and how questions look like?`,
      body: `Questions are scenario‑based and cross‑disciplinary. Students analyze a situation, choose a method, compute carefully, and justify assumptions. Solutions value clarity, defensible steps, and insight—not just the final number.`,
    },
    {
      title: `Our effort in the STEM`,
      body: `We run mentor clinics, publish past papers with annotated solutions, and host team workshops. Regional qualifiers build momentum towards a December grand final—with feedback loops at every stage.`,
    },
    {
      title: `What people say about the STEM`,
      body: `“This changed how I study—now I explain my method before calculating.” · “Team rounds taught me to listen and refine ideas.” · “The finals felt like solving real problems that matter.”`,
    },
  ];

  const defaultSections = [
    {
      title: `Overview`,
      body: project.summary,
    },
    {
      title: `Why it matters`,
      body: project.features.slice(0, 3).join(" · "),
    },
    {
      title: `What to expect`,
      body: project.details.join(" · "),
    },
  ];
  const sections = project.slug === "stem" ? stemSections : defaultSections;

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="relative container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Background decor */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-kc-blue/20 via-transparent to-kc-red/20 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-kc-red/20 via-transparent to-kc-blue/20 rounded-full blur-3xl opacity-50" />
        </div>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-12"
        >
          <motion.div
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="group hover:bg-kc-blue/10 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:text-kc-blue transition-colors duration-300" />
                <span className="group-hover:text-kc-blue transition-colors duration-300">Back</span>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                variant="outline"
                className="hover:border-kc-black hover:text-white transition-all duration-300"
              >
                <Link to="/projects">All projects</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {project.title}
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {project.summary}
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Media + Content split */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-12">
          {/* Carousel using shared UI */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45 }}>
            <Card className="overflow-hidden shadow-elegant">
              <CardContent className="p-0">
                <Carousel setApi={setApi} className="rounded-2xl shadow-elegant bg-white/5 backdrop-blur-sm p-2">
                  <CarouselContent>
                    {project.images.map((src, i) => (
                      <CarouselItem key={i}>
                        <div className="relative overflow-hidden rounded-xl aspect-[16/10] w-full">
                          <img
                            src={src}
                            alt={`${project.title} image ${i + 1}`}
                            className="w-full h-full object-cover"
                            loading="eager"
                            decoding="async"
                            sizes="(min-width: 1024px) 50vw, 100vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-tr from-kc-blue/20 via-transparent to-kc-red/20" />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex bg-kc-blue text-white border-0 hover:bg-kc-red" />
                  <CarouselNext className="hidden sm:flex bg-kc-blue text-white border-0 hover:bg-kc-red" />
                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {project.images.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => api?.scrollTo(idx)}
                aria-label={`Go to image ${idx + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === activeIndex ? "bg-white scale-125" : "bg-white/60 hover:bg-white/80"}`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
                    ))}
                  </div>
                </Carousel>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content sections */}
          <motion.div
            className="self-center space-y-5"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {sections.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.4,
                  delay: 0.3 + (i * 0.1),
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="group"
              >
                <motion.h2
                  className="text-xl md:text-2xl font-heading font-semibold mb-2 group-hover:text-kc-blue transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  {s.title}
                </motion.h2>
                <motion.p
                  className="text-foreground/85 leading-relaxed"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {s.body}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Why take this project? */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.h2
            className="text-2xl font-heading font-semibold mb-4"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why take {project.title}?
          </motion.h2>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {project.features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.4,
                  delay: 0.2 + (i * 0.08),
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{
                  scale: 1.02,
                  y: -3,
                  transition: { duration: 0.2 }
                }}
                className="group"
              >
                <div className="focus:outline-none focus-visible:ring-2 focus-visible:ring-kc-blue/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all p-5 md:p-6 shadow-elegant hover:shadow-2xl">
                  <div className="flex items-start gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CheckCircle className="h-5 w-5 text-kc-blue mt-0.5 flex-shrink-0 group-hover:text-kc-red transition-colors duration-300" />
                    </motion.div>
                    <div className="flex-1">
                      <motion.div
                        className="font-medium text-foreground group-hover:text-kc-blue transition-colors duration-300"
                        initial={{ opacity: 0.9 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {f}
                      </motion.div>
                      <motion.p
                        className="text-sm text-foreground/80 mt-1"
                        initial={{ opacity: 0.7 }}
                        whileHover={{ opacity: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        Built through expert mentoring, hands‑on sessions, and teamwork to turn curiosity into capability.
                      </motion.p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Details only (avoid redundancy) */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-elegant bg-white/5 backdrop-blur-sm border-white/20 transition-all duration-300 hover:shadow-2xl">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-gradient-to-b from-kc-blue to-kc-red rounded-full" />
                <h2 className="text-xl md:text-2xl font-heading font-semibold">Additional Details</h2>
              </div>
              <ul className="space-y-2">
                {project.details.map((d, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    className="text-foreground/90"
                  >
                    {d}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
          {/* Stats on the side if present */}
          {stats.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-4">
              {stats.map((s, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                >
                  <Card className="bg-white/5 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
                    <CardContent className="p-6 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-kc-blue/5 to-kc-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative">
                        <div className="text-3xl md:text-4xl font-heading font-bold mb-1 group-hover:text-kc-blue transition-colors">{s.value}</div>
                        <div className="text-sm md:text-base text-foreground/80">{s.label}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-16 md:mt-20"
        >
          <div className="absolute inset-0 bg-kc-blue rounded-3xl " />
          <motion.div
            className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-10 lg:p-12 overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pointer-events-none absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_50%)]" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 ">
              <div className="text-center md:text-left space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 mb-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Next step with Knowledge Center</span>
                </div>
                <div>
                  <motion.h3
                    className="text-white text-2xl md:text-3xl font-heading font-bold mb-2"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    Ready to Get Started?
                  </motion.h3>
                  <motion.div
                    className="h-0.5 w-20 rounded-full bg-gradient-to-r from-kc-red to-kc-blue md:ml-0 mx-auto mb-2"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <motion.p
                    className="text-lg text-white/90 max-w-xl"
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.18 }}
                  >
                    Take the next step with {project.title} and be part of something extraordinary.
                  </motion.p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {project.slug === "stem" && (
                  <MotionButton 
                    asChild 
                    variant="blackOutline" 
                    size="lg"
                    className="px-8 text-base rounded-full"
                    whileHover={{ y: -2, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link to="/stem">Get Registered</Link>
                  </MotionButton>
                )}
                <MotionButton 
                  asChild 
                  variant="blackOutline" 
                  size="lg"
                  className="sm:w-auto px-8 text-base rounded-full"
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link to="/donate">Support the mission</Link>
                </MotionButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectDetailPage;
