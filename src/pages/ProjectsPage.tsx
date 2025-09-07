import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { projects } from "@/data/projects";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import StemBackground from "@/components/StemBackground";

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-[60vh] relative"
    >
      <div className="absolute inset-0 -z-10">
        <StemBackground opacity={0.08} density={44} lineDistance={120} speed={0.4} showIcons={true} />
      </div>
      <section id="projects" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-10 md:mb-12">
            <h2 className="heading-2 mb-6">
              Explore Our Projects
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Dive deeper into each of our programs. Browse highlights below or jump straight into a project page.
            </p>
          </div>

          {/* Quick Jump Dropdown */}
          <div className="mb-8 md:mb-10 max-w-md mx-auto">
            <Select onValueChange={(slug) => navigate(`/projects/${slug}`)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a project to view details" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.slug} value={p.slug}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Project Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((p) => (
              <motion.div key={p.slug} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
                <Card className="group overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-elegant rounded-2xl">
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-heading font-semibold mb-2">{p.title}</h3>
                      <p className="text-foreground/80 text-sm mb-4 line-clamp-3">{p.summary}</p>
                      <div className="flex justify-between items-center">
                        <Link to={`/projects/${p.slug}`} className="text-primary font-medium hover:underline">
                          View details
                        </Link>
                        <Button asChild variant="blackOutline" size="sm">
                          <Link to={`/projects/${p.slug}`}>
                            Learn more <ArrowRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default ProjectsPage;
