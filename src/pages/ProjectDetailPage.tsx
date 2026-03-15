import React from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { projects, type Project } from "@/data/projects";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Award, BrainCircuit, Rocket, Users } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";

const MotionButton = motion(Button);

interface ProjectDetailContentProps {
  project: Project;
}

const ProjectDetailContent: React.FC<ProjectDetailContentProps> = ({ project }) => {
  // Richer impact tiles for the main detail grid
  const impactStatsBySlug: Record<string, { value: string; label: string }[]> = {
    "stem": [
      { value: "139", label: "Participants in 2021 across 3 national writing centers." },
      { value: "309", label: "Participants in 2022 across 5 national writing centers." },
      { value: "523", label: "Participants in 2023 across 7 national writing centers." },
      { value: "1004", label: "Participants in 2024 across 13 national writing centers." },
      { value: "1975", label: "Total number of directly impacted students from the STEM Project since inception." },
    ],
    "summer-education": [
      { value: "515", label: "Total number of young science learners directly impacted through this program." },
      { value: "264", label: "Total number of girls impacted." },
      { value: "251", label: "Total number of boys impacted." },
      { value: "51", label: "Participants during the main 2021 edition - Buea only." },
      { value: "122", label: "Participants during the 2022 edition - Buea only." },
      { value: "153", label: "Participants during the summer of 2023 - Buea and Limbe." },
      { value: "189", label: "Participants during the summer of 2024 - Buea and Limbe." },
    ],
    "weekend-school": [
      { value: "423", label: "Total number of young science learners directly impacted through this program." },
      { value: "358", label: "Graduated in the top 1% in the GCE." },
      { value: "36", label: "Graduated as national honours students with straight A's." },
      { value: "62", label: "Participants during the 2021/2022 academic year." },
      { value: "104", label: "Participants during the 2022/2023 academic year." },
      { value: "122", label: "Participants during the 2023/2024 academic year." },
      { value: "135", label: "Participants during the 2024/2025 academic year." },
    ],
  };
  const impactStats = impactStatsBySlug[project.slug] ?? [];
  const impactStatsDisplay = impactStats.slice(0, 4);

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
  React.useEffect(() => {
    setActiveIndex(0);
    api?.scrollTo(0);
  }, [project.slug, api]);

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
      body: `A national reasoning-first competition where students tackle authentic, multi-step STEM problems across Math, Physics, Chemistry, Biology and Computing. It's less about memorizing and more about thinking clearly, communicating methods, and defending ideas.`,
    },
    {
      title: `What impact has the STEM had?`,
      body: `2000+ students reached so far with 95% reporting improved problem-solving confidence. Alumni have gone on to lead school clubs, win regional fairs, and secure scholarships after demonstrating rigorous thinking.`,
    },
    {
      title: `What we ask students and how questions look like?`,
      body: `Questions are scenario-based and cross-disciplinary. Students analyze a situation, choose a method, compute carefully, and justify assumptions. Solutions value clarity, defensible steps, and insight, not just the final number.`,
    },
    {
      title: `Our effort in the STEM`,
      body: `We run mentor clinics, publish past papers with annotated solutions, and host team workshops. Regional qualifiers build momentum towards a December grand final, with feedback loops at every stage.`,
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
  const sections = project.sections ?? (project.slug === "stem" ? stemSections : defaultSections);
  const featuredBenefits = React.useMemo(() => {
    const templates = [
      {
        icon: BrainCircuit,
      },
      {
        icon: Rocket,
      },
      {
        icon: Users,
      },
      {
        icon: Award,
      },
    ] as const;

    const toShortTitle = (text: string) => {
      const base = text.split(/[—–-]|:/)[0].trim();
      const words = base.split(/\s+/).filter(Boolean);
      return words.length <= 4 ? base : words.slice(0, 4).join(" ");
    };

    return templates.map((template, idx) => ({
      ...template,
      title: toShortTitle(project.features[idx] ?? project.features[0] ?? `Benefit ${idx + 1}`),
      description: project.features[idx] ?? project.features[0] ?? `Benefit ${idx + 1}`,
    }));
  }, [project.features]);

  const navigate = useNavigate();

  return (
    <section className="pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-20">
      <div className="relative container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Background decor */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-kc-blue/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-kc-blue/10 rounded-full blur-3xl opacity-50" />
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
              className="heading-1 mb-4"
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
        <div className="space-y-10 mb-12">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45 }}>
            <Card className="overflow-hidden shadow-card">
              <CardContent className="p-0">
                <Carousel setApi={setApi} className="rounded-3xl shadow-card bg-white border border-border relative">
                  <CarouselContent className="">
                    {project.images.map((src, i) => (
                      <CarouselItem key={i}>
                        <div className="relative overflow-hidden aspect-[16/9] w-full">
                          <img
                            src={src}
                            alt={`${project.title} image ${i + 1}`}
                            className="w-full h-full object-cover"
                            loading={i === 0 ? "eager" : "lazy"}
                            decoding="async"
                            sizes="(min-width: 1024px) 80vw, 100vw"
                          />
                          <div className="absolute inset-0 bg-kc-blue/20" />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex bg-kc-blue text-white border-0 hover:bg-kc-blue-dark" />
                  <CarouselNext className="hidden sm:flex bg-kc-blue text-white border-0 hover:bg-kc-blue-dark" />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {project.images.map((_, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => api?.scrollTo(idx)}
                        aria-label={`Go to image ${idx + 1}`}
                        className={`w-2.5 h-2.5 rounded-full border border-white/50 transition-all duration-300 ${idx === activeIndex ? "bg-white scale-125" : "bg-white/20 hover:bg-white/60"}`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </Carousel>
              </CardContent>
            </Card>
          </motion.div>
          <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8 md:gap-10 items-start">
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {sections.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2 + (i * 0.1),
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="group"
                >
                  <motion.h2
                    className="heading-3 mb-2 group-hover:text-kc-blue transition-colors duration-300"
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

            {impactStatsDisplay.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                  Impact in numbers
                </p>
                <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                  {impactStatsDisplay.map((stat, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -2, scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-3xl px-4 py-5 flex flex-col justify-between shadow-card bg-kc-blue text-white"
                    >
                      <div className="text-h4 md:text-h3 font-heading font-bold leading-none mb-2">{stat.value}</div>
                      <p className="text-xs md:text-sm text-white/90">
                        {stat.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Key Benefits */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.h2
            className="heading-2 text-center mb-3"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Key Benefits
          </motion.h2>
          <motion.div
            className="h-1 w-20 mx-auto mb-8 bg-kc-blue rounded-full"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
            {featuredBenefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + (i * 0.08),
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.22 }
                }}
                className="group relative"
              >
                <div className="h-full rounded-3xl border border-kc-blue/10 ring-1 ring-kc-blue/5 bg-white/95 p-6 md:p-7 shadow-card transition-all duration-300 hover:shadow-hover">
                  <div className="flex flex-col items-center text-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-kc-blue/10 text-kc-blue ring-1 ring-kc-blue/20 shadow-sm"
                    >
                      <benefit.icon className="h-7 w-7" />
                    </motion.div>
                    <h3 className="text-base md:text-lg font-heading font-semibold text-kc-blue leading-tight">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-kc-black/70 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Details */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
        >
          <Card className="shadow-card bg-white border border-border/90 transition-all duration-300 hover:shadow-hover">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-kc-blue rounded-full" />
                <h2 className="heading-3">Additional Details</h2>
              </div>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {project.details.map((d, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    className="text-foreground/90"
                  >
                    {d}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
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
            className="relative bg-white  border border-border rounded-3xl p-8 md:p-10 lg:p-12 overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pointer-events-none absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_50%)]" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 ">
              <div className="text-center md:text-left space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-white/90 mb-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Next step with Knowledge Center</span>
                </div>
                <div>
                  <motion.h3
                    className="heading-2 mb-2"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    Ready to Get Started?
                  </motion.h3>
                  <motion.div
                    className="h-0.5 w-20 rounded-full bg-kc-blue md:ml-0 mx-auto mb-2"
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
                    variant="blackOutline"
                    size="lg"
                    className="px-8 text-base rounded-full"
                    disabled
                  >
                    Get Registered
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

  return <ProjectDetailContent project={project} />;
};

export default ProjectDetailPage;
