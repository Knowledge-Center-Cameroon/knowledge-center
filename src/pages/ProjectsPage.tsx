import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { projects } from "@/data/projects";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ExternalLink, Star, Compass } from "lucide-react";
import StemBackground from "@/components/StemBackground";
import { useParallax, Parallax } from "@/hooks/use-parallax";
import { Badge } from "@/components/ui/badge";
import { useSeo } from "@/hooks/useSeo";

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  hover: {
    y: -12,
    scale: 1.03,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20
    }
  }
};

/**
 * Projects Page - Showcase of Knowledge Center programs and initiatives
 * 
 * SEO Structure:
 * - H1: "Our Projects"
 * - H2: Project cards with descriptive titles
 * - Category filtering for improved navigation
 * - Proper image alt text describing each project
 * 
 * Design:
 * - Grid layout with card hover effects
 * - Category filtering for improved navigation
 * - Smooth animations on load
 * - Responsive design (1, 2, 3 columns)
 */
const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const projectPriority: Record<string, number> = {
    gsp: 0,
  };
  
  useSeo({
    title: "Our Projects | Knowledge Center - STEM Programs",
    description:
      "Discover Knowledge Center's innovative STEM programs: National STEM Competition, Summer Education Program, Weekend School, KC Prepa, and Global Scholars Program.",
  });
  
  // Get unique categories
  const categories = React.useMemo(() => {
    const cats = new Set(projects.flatMap(p => p.categories || []));
    return ["all", ...Array.from(cats)];
  }, []);

  // Filter projects
  const filteredProjects = React.useMemo(() => {
    return projects
    .filter(project => {
      const matchesCategory = selectedCategory === "all" || project.categories?.includes(selectedCategory);
      return matchesCategory;
    })
    .sort((a, b) => {
      const aPriority = projectPriority[a.slug] ?? 100;
      const bPriority = projectPriority[b.slug] ?? 100;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return projects.findIndex((p) => p.slug === a.slug) - projects.findIndex((p) => p.slug === b.slug);
    });
  }, [selectedCategory]);

  const sortedProjects = React.useMemo(
    () => [...projects].sort((a, b) => a.title.localeCompare(b.title)),
    []
  );

  const { ref, y } = useParallax(40);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-[60vh] relative"
    >
      <div className="absolute inset-0 -z-10">
        <StemBackground opacity={0.1} density={50} lineDistance={130} speed={0.45} showIcons={true} />
      </div>
      <section id="projects" className="py-10 md:py-12 lg:py-14">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          {/* Header */}
          <Parallax ref={ref as React.Ref<HTMLDivElement>} style={{ y }} className="text-center mb-10 md:mb-12">
            <div className="h-1 w-28 mx-auto mb-3 bg-kc-blue rounded-full" />
            <h1 className="heading-1 mb-6">
              Explore Our Projects
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Dive deeper into each of our programs. Browse highlights below or jump straight into a project page.
            </p>
          </Parallax>


          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 space-y-6"
          >
            {/* Category Pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.4 + (index * 0.05),
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden border
                    ${selectedCategory === category
                      ? 'bg-kc-blue text-white border-kc-blue shadow-md transform scale-105'
                      : 'bg-kc-blue/5 text-foreground border-kc-blue/15 hover:bg-white hover:shadow-sm'}
                  `}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.button>
              ))}
            </motion.div>

            {/* Quick Jump */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="max-w-md mx-auto"
            >
              <div className="mb-2 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-kc-blue">
                <Compass className="h-3.5 w-3.5" />
                Quick Project Jump
              </div>
              <Select onValueChange={(slug) => navigate(`/projects/${slug}`)}>
                <SelectTrigger className="h-12 rounded-full bg-white/95 border border-kc-blue/10 ring-1 ring-kc-blue/5 transition-all duration-300 hover:shadow-md focus:ring-2 focus:ring-kc-blue/50">
                  <SelectValue placeholder="Choose a project and press Enter..." />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {sortedProjects.map((p) => (
                    <SelectItem key={p.slug} value={p.slug}>
                      <div className="flex w-full items-center justify-between gap-3">
                        <span>{p.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          </motion.div>
          {/* Project Cards */}
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="wait">
              {filteredProjects.map((p, index) => (
                <motion.div
                  key={p.slug}
                  variants={cardVariants}
                  whileHover="hover"
                  layout
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                    y: 20,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card className="group h-full overflow-hidden bg-white/95 border border-kc-blue/10 ring-1 ring-kc-blue/5 shadow-card rounded-3xl transition-all duration-500 hover:border-kc-blue/40 hover:shadow-hover">
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <motion.img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
                          loading="lazy"
                          decoding="async"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.4 }}
                        />
                        <motion.div
                          className="absolute inset-0 bg-kc-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        />

                        {/* Featured Badge */}
                        {p.featured && (
                          <motion.div
                            className="absolute top-4 right-4 flex items-center gap-1 bg-kc-blue text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2 + (index * 0.05), type: "spring", stiffness: 260 }}
                          >
                            <Star className="h-4 w-4" />
                            Featured
                          </motion.div>
                        )}
                      </div>

                      <div className="flex-1 p-6 flex flex-col">
                        {/* Categories */}
                        {p.categories && (
                          <motion.div
                            className="flex flex-wrap gap-2 mb-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + (index * 0.05) }}
                          >
                            {p.categories.map((cat) => (
                              <motion.div
                                key={cat}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Badge
                                  variant="secondary"
                                  className="rounded-full bg-kc-blue/10 text-kc-blue ring-1 ring-kc-blue/20 hover:bg-kc-blue hover:text-white transition-colors duration-300 cursor-pointer"
                                  onClick={() => setSelectedCategory(cat)}
                                >
                                  {cat}
                                </Badge>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}

                        <motion.h3
                          className="text-xl font-heading font-semibold mb-3 group-hover:text-kc-blue transition-colors duration-300"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + (index * 0.05) }}
                        >
                          {p.title}
                        </motion.h3>
                        <motion.p
                          className="text-foreground/80 text-base mb-6 line-clamp-3 flex-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 + (index * 0.05) }}
                        >
                          {p.summary}
                        </motion.p>

                        <motion.div
                          className="flex flex-wrap items-center gap-4 mt-auto"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + (index * 0.05) }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              asChild
                              variant="blue"
                              className="rounded-full gap-2 text-base"
                            >
                              <Link to={`/projects/${p.slug}`}>
                                View Project
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </motion.div>

                          {p.externalUrl && (
                            <motion.a
                              href={p.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-kc-blue transition-colors duration-300"
                              whileHover={{ scale: 1.05, x: 2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <ExternalLink className="h-4 w-4" />
                              Visit Site
                            </motion.a>
                          )}
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          
          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-lg text-muted-foreground">
                No projects found in this category.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default ProjectsPage;
