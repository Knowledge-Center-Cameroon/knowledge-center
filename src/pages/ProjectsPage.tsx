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

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  useSeo({
    title: "STEM Programs and Projects",
    description:
      "Explore Knowledge Center's flagship programs including the National STEM Competition, Summer Education Program, Weekend School, KC Prepa, and Global Scholars Program.",
  });
  
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
          <Parallax ref={ref as React.Ref<HTMLDivElement>} style={{ y }} className="text-center mb-10 md:mb-12">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 space-y-6"
          >
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="max-w-2xl mx-auto relative"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors duration-300" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="pl-10 py-6 text-lg shadow-sm transition-all duration-300 focus-visible:shadow-md focus-visible:ring-2 focus-visible:ring-kc-blue/50"
              />
            </motion.div>

            {/* Category Pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.5 + (index * 0.05),
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden
                    ${selectedCategory === category
                      ? 'bg-kc-blue text-white shadow-md transform scale-105'
                      : 'bg-white/70 text-foreground hover:bg-white hover:shadow-sm'}
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
              transition={{ delay: 0.6, duration: 0.4 }}
              className="max-w-md mx-auto"
            >
              <Select onValueChange={(slug) => navigate(`/projects/${slug}`)}>
                <SelectTrigger className="transition-all duration-300 hover:shadow-md focus:ring-2 focus:ring-kc-blue/50">
                  <SelectValue placeholder="Or jump directly to a project..." />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.slug} value={p.slug}>{p.title}</SelectItem>
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
                  <Card className="group h-full overflow-hidden bg-white/80 backdrop-blur-md border border-white/20 shadow-elegant rounded-2xl transition-all duration-500 hover:border-kc-blue/40 hover:shadow-2xl">
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
                          className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        />

                        {/* Featured Badge */}
                        {p.featured && (
                          <motion.div
                            className="absolute top-4 right-4 flex items-center gap-1 bg-kc-red/90 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm"
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
                                  className="bg-kc-blue/10 text-kc-blue hover:bg-kc-blue hover:text-white transition-colors duration-300 cursor-pointer"
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
          
          {/* Detailed project sections with impact numbers */}
          <div className="mt-16 space-y-16">
            {/* Project 1: STEM National Project */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 items-start"
            >
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-2">
                  Project 1
                </p>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-kc-blue mb-4">
                  The KC National STEM Project
                </h3>
                <div className="h-1 w-24 bg-kc-red mb-6" />
                <div className="space-y-4 text-sm md:text-base text-foreground/80 leading-relaxed">
                  <p>
                    At KC, we are driven by the confidence that our students are smart enough and can understand
                    scientific concepts well enough to become luminary participants in today&apos;s burgeoning innovation
                    economy.
                  </p>
                  <p>
                    We believe that, with more effort to direct their focus away from inertia-heavy, creativity-stifling
                    practices in schools, we can unlock an era where it would not matter to global customers whether the
                    computer they buy was built in Silicon Valley or in Bambili, Cameroon &mdash; the quality of either will
                    be just as impressive.
                  </p>
                  <p>
                    The STEM National Project does exactly this by challenging learners with conceptually rich
                    questions that reward reasoning, creativity, and problem solving over rote memorisation. It is our
                    way of nurturing a generation of innovators who are excited about science and confident in their
                    ability to use it to change their communities.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold tracking-[0.14em] uppercase text-muted-foreground">
                  Impact in numbers
                </p>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-kc-blue text-white rounded-2xl px-4 py-5 flex flex-col justify-between shadow-elegant">
                    <div className="text-3xl md:text-4xl font-heading font-bold leading-none mb-2">139</div>
                    <p className="text-xs md:text-sm text-white/90">
                      Participants in 2021 across 3 national writing centers.
                    </p>
                  </div>
                  <div className="bg-kc-blue text-white rounded-2xl px-4 py-5 flex flex-col justify-between shadow-elegant">
                    <div className="text-3xl md:text-4xl font-heading font-bold leading-none mb-2">309</div>
                    <p className="text-xs md:text-sm text-white/90">
                      Participants in 2022 across 5 national writing centers.
                    </p>
                  </div>
                  <div className="bg-kc-blue text-white rounded-2xl px-4 py-5 flex flex-col justify-between shadow-elegant">
                    <div className="text-3xl md:text-4xl font-heading font-bold leading-none mb-2">523</div>
                    <p className="text-xs md:text-sm text-white/90">
                      Participants in 2023 across 7 national writing centers.
                    </p>
                  </div>
                  <div className="bg-kc-blue text-white rounded-2xl px-4 py-5 flex flex-col justify-between shadow-elegant">
                    <div className="text-3xl md:text-4xl font-heading font-bold leading-none mb-2">1004</div>
                    <p className="text-xs md:text-sm text-white/90">
                      Participants in 2024 across 13 national writing centers.
                    </p>
                  </div>
                </div>
                <div className="bg-black text-white rounded-2xl px-5 py-6 md:py-7 shadow-elegant">
                  <div className="text-4xl md:text-5xl font-heading font-bold leading-none mb-2">1975</div>
                  <p className="text-xs md:text-sm text-white/90 max-w-xs">
                    Total number of directly impacted students from the STEM Project since inception in 2021.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Project 2: Summer Holiday Education Program */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 items-start"
            >
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-2">
                  Project 2
                </p>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-kc-blue mb-4">
                  The KC Summer Holiday Education Program
                </h3>
                <div className="h-1 w-24 bg-kc-red mb-6" />
                <div className="space-y-4 text-sm md:text-base text-foreground/80 leading-relaxed">
                  <p>
                    The KC Summer Holiday Program is one of our flagship programs, thanks to its enormous impact on
                    learners. It attracts principals, national educators, parents, and learners from across Cameroon who
                    are looking for something more than traditional holiday classes.
                  </p>
                  <p>
                    Our objective is simple: create a richly innovative learning experience that nurtures critical
                    21st‑century competencies and prepares learners for responsible citizenship and career success in
                    today&apos;s innovation‑led economy.
                  </p>
                  <p>
                    Beyond syllabus coverage, we bring science and innovation to life through smart classroom
                    experiments, project development, and club activities such as creative writing and public speaking.
                    Learners leave the program more confident, more curious, and more prepared to shape the future.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold tracking-[0.14em] uppercase text-muted-foreground">
                  Impact in numbers
                </p>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-black text-white rounded-2xl px-4 py-5 flex flex-col justify-between shadow-elegant">
                    <div className="text-3xl md:text-4xl font-heading font-bold leading-none mb-2">515</div>
                    <p className="text-xs md:text-sm text-white/90">
                      Total number of young science learners directly impacted through this program.
                    </p>
                  </div>
                  <div className="bg-kc-red text-white rounded-2xl px-4 py-5 flex flex-col justify-between shadow-elegant">
                    <div className="text-3xl md:text-4xl font-heading font-bold leading-none mb-2">264</div>
                    <p className="text-xs md:text-sm text-white/90">
                      Total number of girls impacted.
                    </p>
                  </div>
                  <div className="bg-kc-red text-white rounded-2xl px-4 py-5 flex flex-col justify-between shadow-elegant">
                    <div className="text-3xl md:text-4xl font-heading font-bold leading-none mb-2">251</div>
                    <p className="text-xs md:text-sm text-white/90">
                      Total number of boys impacted.
                    </p>
                  </div>
                  <div className="bg-kc-blue text-white rounded-2xl px-4 py-5 flex flex-col justify-between shadow-elegant">
                    <div className="text-3xl md:text-4xl font-heading font-bold leading-none mb-2">51</div>
                    <p className="text-xs md:text-sm text-white/90">
                      Participants impacted during the main edition in the summer of 2021 &mdash; Buea only.
                    </p>
                  </div>
                  <div className="bg-kc-blue text-white rounded-2xl px-4 py-5 flex flex-col justify-between shadow-elegant">
                    <div className="text-3xl md:text-4xl font-heading font-bold leading-none mb-2">122</div>
                    <p className="text-xs md:text-sm text-white/90">
                      Participants impacted during the 2022 edition &mdash; Buea only.
                    </p>
                  </div>
                  <div className="bg-kc-blue text-white rounded-2xl px-4 py-5 flex flex-col justify-between shadow-elegant">
                    <div className="text-3xl md:text-4xl font-heading font-bold leading-none mb-2">153</div>
                    <p className="text-xs md:text-sm text-white/90">
                      Participants impacted during the summer of 2023 &mdash; Buea and Limbe.
                    </p>
                  </div>
                  <div className="bg-kc-blue text-white rounded-2xl px-4 py-5 flex flex-col justify-between shadow-elegant col-span-2 md:col-span-1">
                    <div className="text-3xl md:text-4xl font-heading font-bold leading-none mb-2">189</div>
                    <p className="text-xs md:text-sm text-white/90">
                      Participants impacted during the summer of 2024 &mdash; Buea and Limbe.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Project 3: KC Weekend School */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 items-start"
            >
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-2">
                  Project 3
                </p>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-kc-blue mb-4">
                  The KC Weekend School
                </h3>
                <div className="h-1 w-24 bg-kc-red mb-6" />
                <div className="space-y-4 text-sm md:text-base text-foreground/80 leading-relaxed">
                  <p>
                    The KC Weekend School is a competitively selective, audio‑visual science tutoring program that
                    nurtures some of the nation&apos;s best‑performing students while providing critical mentorship and
                    access to quality education opportunities.
                  </p>
                  <p>
                    Beyond innovatively covering their high‑school academic syllabus, we offer extra personal attention,
                    consistent encouragement, close mentorship, more learning opportunities, and quarterly seminars that
                    expose students to the dynamics of the 21st‑century world.
                  </p>
                  <p>
                    Our scholars fall in love with learning, develop a clear sense of career purpose, and consistently
                    post outstanding academic outcomes. Above all, they experience school as a vibrant community where
                    they are inspired to continuously grow and reinvent themselves.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold tracking-[0.14em] uppercase text-muted-foreground">
                  Impact in numbers
                </p>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-black text-white rounded-2xl px-4 py-5 flex flex-col justify-between shadow-elegant">
                    <div className="text-3xl md:text-4xl font-heading font-bold leading-none mb-2">423</div>
                    <p className="text-xs md:text-sm text-white/90">
                      Total number of young science learners directly impacted through this program.
                    </p>
                  </div>
                  <div className="bg-kc-red text-white rounded-2xl px-4 py-5 flex flex-col justify-between shadow-elegant">
                    <div className="text-3xl md:text-4xl font-heading font-bold leading-none mb-2">358</div>
                    <p className="text-xs md:text-sm text-white/90">
                      Graduated in the top 1% in the GCE.
                    </p>
                  </div>
                  <div className="bg-kc-red text-white rounded-2xl px-4 py-5 flex flex-col justify-between shadow-elegant">
                    <div className="text-3xl md:text-4xl font-heading font-bold leading-none mb-2">36</div>
                    <p className="text-xs md:text-sm text-white/90">
                      Graduated as national honours students with straight A&apos;s.
                    </p>
                  </div>
                  <div className="bg-kc-blue text-white rounded-2xl px-4 py-5 flex flex-col justify-between shadow-elegant">
                    <div className="text-3xl md:text-4xl font-heading font-bold leading-none mb-2">62</div>
                    <p className="text-xs md:text-sm text-white/90">
                      Participants impacted during the 2021/2022 academic year.
                    </p>
                  </div>
                  <div className="bg-kc-blue text-white rounded-2xl px-4 py-5 flex flex-col justify-between shadow-elegant">
                    <div className="text-3xl md:text-4xl font-heading font-bold leading-none mb-2">104</div>
                    <p className="text-xs md:text-sm text-white/90">
                      Participants impacted during the 2022/2023 academic year.
                    </p>
                  </div>
                  <div className="bg-kc-blue text-white rounded-2xl px-4 py-5 flex flex-col justify-between shadow-elegant">
                    <div className="text-3xl md:text-4xl font-heading font-bold leading-none mb-2">122</div>
                    <p className="text-xs md:text-sm text-white/90">
                      Participants impacted during the 2023/2024 academic year.
                    </p>
                  </div>
                  <div className="bg-kc-blue text-white rounded-2xl px-4 py-5 flex flex-col justify-between shadow-elegant col-span-2 md:col-span-1">
                    <div className="text-3xl md:text-4xl font-heading font-bold leading-none mb-2">135</div>
                    <p className="text-xs md:text-sm text-white/90">
                      Participants impacted during the 2024/2025 academic year.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
          
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
      </section>
    </motion.div>
  );
};

export default ProjectsPage;
