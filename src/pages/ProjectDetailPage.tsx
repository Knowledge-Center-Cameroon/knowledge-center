import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { projects } from "@/data/projects";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Image as ImageIcon, CheckCircle } from "lucide-react";

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

        {/* What is the project? */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-12">
          <Card className="overflow-hidden shadow-elegant">
            <CardContent className="p-0">
              <div className="relative aspect-[16/10] bg-muted">
                <img src={project.images[0]} alt={`${project.title} overview`} className="w-full h-full object-cover" />
              </div>
            </CardContent>
          </Card>
          <div className="self-center">
            <h2 className="text-2xl font-heading font-semibold mb-3">What is {project.title}?</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              {project.summary}
            </p>
            <p className="text-foreground/80 leading-relaxed">
              {project.details.slice(0, 2).join(" · ")}
            </p>
          </div>
        </div>

        {/* Why take this project? */}
        <div className="mb-12">
          <h2 className="text-2xl font-heading font-semibold mb-4">Why take {project.title}?</h2>
          <div className="space-y-6">
            {project.features.map((f, i) => (
              <div key={i} className="grid md:grid-cols-5 gap-4 items-center">
                <div className="md:col-span-2">
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-[16/10] bg-muted">
                        <img src={project.images[(i + 1) % project.images.length]} alt={`${project.title} benefit ${i + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" />
                          Benefit {i + 1}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="md:col-span-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-foreground">{f}</div>
                      <p className="text-sm text-foreground/80">{project.title} helps you achieve this through mentor-led sessions, hands-on activities, and real-world applications designed to build confidence and mastery.</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits and Details */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Benefits */}
          <Card className="shadow-elegant">
            <CardContent className="p-6">
              <h2 className="text-xl font-heading font-semibold mb-4">Benefits Summary</h2>
              <div className="space-y-4">
                {project.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-foreground">{f}</div>
                      <p className="text-sm text-foreground/80">This benefit empowers learners through hands-on practice and expert mentoring tailored to each student's goals.</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
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
        </div>

        {/* Statistics band */}
        {stats.length > 0 && (
          <div className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
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

        {/* Call to action */}
        <div className="mt-10 md:mt-12 flex items-center justify-between gap-4 flex-wrap">
          <div className="text-muted-foreground">Ready to learn more about {project.title}?</div>
          <div className="flex gap-3">
            <Button asChild variant="blue">
              <Link to="/stem-registration">Get Registered</Link>
            </Button>
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
