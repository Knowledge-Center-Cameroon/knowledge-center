import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { projects } from "@/data/projects";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Search, Tags, ExternalLink, Star } from "lucide-react";
import StemBackground from "@/components/StemBackground";
import { useParallax, Parallax } from "@/hooks/use-parallax";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  hover: { 
    y: -8,
    scale: 1.02,
    transition: { 
      type: 'spring',
      stiffness: 260,
      damping: 20
    }
  }
};

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  
  // Get unique categories
  const categories = React.useMemo(() => {
    const cats = new Set(projects.flatMap(p => p.categories || []));
    return ["all", ...Array.from(cats)];
  }, []);

  // Filter projects
  const filteredProjects = React.useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || project.categories?.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

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
      <section id="projects" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          {/* Header */}
          <Parallax ref={ref as any} style={{ y }} className="text-center mb-10 md:mb-12">
            <div className="h-1 w-28 mx-auto mb-3 bg-kc-blue rounded-full" />
            <h2 className="heading-2 mb-6">
              Explore Our Projects
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Dive deeper into each of our programs. Browse highlights below or jump straight into a project page.
            </p>
          </Parallax>


          {/* Search and Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mb-12 space-y-6"
          >
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="pl-10 py-6 text-lg shadow-sm transition-all duration-300 focus-visible:shadow-md"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${selectedCategory === category 
                      ? 'bg-kc-blue text-white shadow-md transform scale-105' 
                      : 'bg-white/70 text-foreground hover:bg-white hover:shadow-sm'}
                  `}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Quick Jump */}
            <div className="max-w-md mx-auto">
              <Select onValueChange={(slug) => navigate(`/projects/${slug}`)}>
                <SelectTrigger>
                  <SelectValue placeholder="Or jump directly to a project..." />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.slug} value={p.slug}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Project Cards */}
          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {filteredProjects.map((p) => (
                <motion.div 
                  key={p.slug} 
                  variants={cardVariants}
                  whileHover="hover"
                  layoutId={p.slug}
                >
                  <Card className="group h-full overflow-hidden bg-white/80 backdrop-blur-md border border-white/20 shadow-elegant rounded-2xl transition-all duration-500 hover:border-kc-blue/40">
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <img 
                          src={p.images[0]} 
                          alt={p.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform" 
                          loading="lazy" 
                          decoding="async" 
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Featured Badge */}
                        {p.featured && (
                          <div className="absolute top-4 right-4 flex items-center gap-1 bg-kc-red/90 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                            <Star className="h-4 w-4" />
                            Featured
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 p-6 flex flex-col">
                        {/* Categories */}
                        {p.categories && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {p.categories.map((cat) => (
                              <Badge 
                                key={cat} 
                                variant="secondary" 
                                className="bg-kc-blue/10 text-kc-blue hover:bg-kc-blue hover:text-white transition-colors duration-300 cursor-pointer"
                                onClick={() => setSelectedCategory(cat)}
                              >
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <h3 className="text-xl font-heading font-semibold mb-3 group-hover:text-kc-blue transition-colors duration-300">
                          {p.title}
                        </h3>
                        <p className="text-foreground/80 text-base mb-6 line-clamp-3 flex-1">
                          {p.summary}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 mt-auto">
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
                          
                          {p.externalUrl && (
                            <a 
                              href={p.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-kc-blue transition-colors duration-300"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Visit Site
                            </a>
                          )}
                        </div>
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
                No projects found matching your criteria.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default ProjectsPage;
