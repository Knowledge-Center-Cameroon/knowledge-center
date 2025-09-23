import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { projects } from "@/data/projects";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";

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
    "stem-education": [
      { label: "Students Impacted", value: "500+" },
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
      body: `500+ students reached so far with 95% reporting improved problem‑solving confidence. Alumni have gone on to lead school clubs, win regional fairs, and secure scholarships after demonstrating rigorous thinking.`,
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
  const sections = project.slug === "stem-education" ? stemSections : defaultSections;

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <Link to="/projects" className="text-sm text-primary hover:underline">All projects</Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3">
            {project.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">{project.summary}</p>
        </div>

        {/* Media + Content split */
        }
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-12">
          {/* Carousel using shared UI */}
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
                    <button
                      key={idx}
                      onClick={() => api?.scrollTo(idx)}
                      aria-label={`Go to image ${idx + 1}`}
                      className={`w-2.5 h-2.5 rounded-full ${idx === activeIndex ? "bg-white" : "bg-white/60 hover:bg-white/80"}`}
                    />
                  ))}
                </div>
              </Carousel>
            </CardContent>
          </Card>

          {/* Content sections */}
          <div className="self-center space-y-5">
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="text-xl md:text-2xl font-heading font-semibold mb-2">{s.title}</h2>
                <p className="text-foreground/85 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why take this project? */}
        <div className="mb-12">
          <h2 className="text-2xl font-heading font-semibold mb-4">Why take {project.title}?</h2>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {project.features.map((f, i) => (
              <button
                key={i}
                className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all p-4 md:p-5 shadow-sm hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium text-foreground">{f}</div>
                    <p className="text-sm text-foreground/80">Built through expert mentoring, hands‑on sessions, and teamwork to turn curiosity into capability.</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Additional Details only (avoid redundancy) */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-elegant">
            <CardContent className="p-6">
              <h2 className="text-xl font-heading font-semibold mb-4">Additional Details</h2>
              <ul className="space-y-2">
                {project.details.map((d, i) => (
                  <li key={i} className="text-foreground/90">{d}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          {/* Stats on the side if present */}
          {stats.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-4">
              {stats.map((s, idx) => (
                <Card key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-heading font-bold">{s.value}</div>
                    <div className="text-sm text-foreground/80">{s.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Call to action */}
        <div className="mt-10 md:mt-12 flex items-center justify-between gap-4 flex-wrap">
          <div className="text-muted-foreground">Take the next step with {project.title}.</div>
          <div className="flex gap-3">
            {project.slug === "stem-education" && (
              <Button asChild variant="blue">
                <Link to="/stem">Get Registered</Link>
              </Button>
            )}
            <Button asChild variant="blackOutline">
              <Link to="/donate">Support the mission</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetailPage;
