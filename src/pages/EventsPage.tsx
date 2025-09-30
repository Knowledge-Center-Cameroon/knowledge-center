import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, MapPin, Clock, Sparkles, ArrowRight, Users, Calendar, Info } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowButton } from "@/components/arrowbtn";
import StemBackground from "@/components/StemBackground";
import Timeline, { type TimelineItem } from "@/components/Timeline";
import { getTimeline } from "@/services/api";
import { useParallax, Parallax } from "@/hooks/use-parallax";
import { cn } from "@/lib/utils";

const UPCOMING = [
  {
    title: "National STEM Competition",
    date: "Dec 28, 2025",
    time: "09:00 - 18:00",
    location: "KC Campus, Buea",
    description:
      "A fast-paced build day where students prototype solutions to real local challenges with mentors on-site.",
    badge: "Featured",
  },
  {
    title: "Weekend Program for 2025/2026",
    date: "Sep 14, 2025",
    time: "12:00 - 17:00",
    location: "KC Center",
    description:
      "Teams demo autonomous bots, line followers, and arm builds. Families and partners welcome!",
  },
];

const PAST = [
  {
    title: "National STEM Convention",
    date: "Aug 30, 2025",
    time: "09:00 - 16:00",
    location: "Mountain Hotel, Buea",
    description:
      "Talks from scientists and engineers, scholarship guidance, and networking with peers.",
  },
  {
    title: "Summer Opening Ceremony",
    date: "Jul 05, 2025",
    time: "09:00 - 15:00",
    location: "Veracity University, Buea",
    description:
      "Opening ceremony to the commencement of an impact full summer.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
  hover: {
    y: -8,
    transition: { 
      type: 'spring',
      stiffness: 260,
      damping: 20
    }
  },
  exit: { 
    opacity: 0,
    y: 20,
    transition: { duration: 0.3 }
  }
};

const toGCalUrl = (title: string, date: string, time?: string, details?: string, location?: string) => {
  // Parse basic date/time like "Dec 28, 2025" and "09:00 - 18:00"
  const [startStr, endStr] = (time || "00:00 - 00:00").split("-").map((s) => s.trim());
  const start = new Date(`${date} ${startStr}`);
  const end = new Date(`${date} ${endStr}`);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const dates = `${fmt(start)}/${fmt(end)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates,
    details: details || "",
    location: location || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const EventsGrid: React.FC<{ items: typeof UPCOMING }> = ({ items }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
    <AnimatePresence mode="popLayout">
      {items.map((e, i) => (
        <motion.div 
          key={e.title} 
          variants={cardVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          whileHover="hover"
          layoutId={e.title}
        >
          <Card className="group relative h-full overflow-hidden bg-white/80 backdrop-blur-md border border-white/20 shadow-elegant rounded-2xl transition-all duration-500 hover:border-kc-blue/40">
            {e.badge && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-kc-red/90 text-white px-3 py-1.5 text-sm font-medium shadow-md backdrop-blur-sm"
              >
                <Sparkles className="h-4 w-4" /> {e.badge}
              </motion.div>
            )}
            
            <CardHeader className="p-6 pb-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold leading-tight mb-2 group-hover:text-kc-blue transition-colors duration-300">
                    {e.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 transition-colors duration-300 group-hover:text-kc-blue/80">
                      <CalendarDays className="h-4 w-4" /> {e.date}
                    </div>
                    <div className="flex items-center gap-1.5 transition-colors duration-300 group-hover:text-kc-blue/80">
                      <Clock className="h-4 w-4" /> {e.time}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4 transition-colors duration-300 group-hover:text-kc-blue/80">
                <MapPin className="h-4 w-4" /> {e.location}
              </div>
              
              <p className="text-base leading-relaxed text-foreground/80">
                {e.description}
              </p>
              
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <ArrowButton
                  text="Learn More"
                  bgPrimaryColor="#2563eb"
                  bgSecondaryColor="#1d4ed8"
                  textPrimaryColor="#ffffff"
                  textSecondaryColor="#ffffff"
                  className="rounded-full text-base"
                  href="#"
                />
                <a
                  className="group inline-flex items-center text-sm font-medium text-muted-foreground hover:text-kc-blue transition-colors duration-300"
                  href={toGCalUrl(e.title, e.date, e.time, e.description, e.location)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Calendar className="mr-1.5 h-4 w-4" />
                  Add to Calendar
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

const EventsPage: React.FC = () => {
  const { ref, y } = useParallax(40);
  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="container mx-auto px-4 lg:px-8 py-12 relative"
    >
      {/* Stem Background */}
      <div className="absolute inset-0 -z-10">
        <StemBackground opacity={0.08} density={44} lineDistance={120} speed={0.4} showIcons={true} />
      </div>
      <Parallax ref={ref as any} style={{ y }} className="mb-8 text-center">
        <div className="h-1 w-28 mx-auto mb-3 bg-kc-blue rounded-full" />
        <h1 className="heading-2 mb-6">
          <span className="text-kc-blue">KC</span> <span className="text-kc-red">Events</span>
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Join our upcoming events, hackathons, and community days. Save the dates and be part of the action.
        </p>
      </Parallax>

      <motion.div variants={fadeUp}>
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-8">
            {(() => {
              const [activeTab, setActiveTab] = useState("upcoming");
              return (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="relative overflow-hidden rounded-3xl p-1 bg-white/40 backdrop-blur-md border border-white/40 shadow-elegant mb-12">
                    <TabsList className="relative w-full grid grid-cols-2 gap-2 p-1">
                      {/* Animated background */}
                      <motion.div
                        className="absolute inset-1 rounded-2xl bg-gradient-to-r from-kc-blue to-kc-blue/90"
                        initial={false}
                        animate={{
                          x: activeTab === 'upcoming' ? '0%' : '100%',
                          opacity: 1
                        }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        style={{ width: '50%' }}
                      />
                      
                      {/* Tab Triggers */}
                      <TabsTrigger 
                        value="upcoming"
                        className={cn(
                          "relative py-3 font-medium text-base rounded-2xl transition-all duration-300",
                          activeTab === 'upcoming' 
                            ? 'text-white shadow-sm' 
                            : 'text-foreground/80 hover:text-foreground hover:bg-white/50'
                        )}
                      >
                        <motion.div
                          variants={tabVariants}
                          initial="hidden"
                          animate="show"
                          transition={{ delay: 0.1 }}
                          className="flex items-center justify-center gap-2"
                        >
                          <Calendar className="h-4 w-4" />
                          Upcoming Events
                        </motion.div>
                      </TabsTrigger>
                      
                      <TabsTrigger 
                        value="past"
                        className={cn(
                          "relative py-3 font-medium text-base rounded-2xl transition-all duration-300",
                          activeTab === 'past' 
                            ? 'text-white shadow-sm' 
                            : 'text-foreground/80 hover:text-foreground hover:bg-white/50'
                        )}
                      >
                        <motion.div
                          variants={tabVariants}
                          initial="hidden"
                          animate="show"
                          transition={{ delay: 0.2 }}
                          className="flex items-center justify-center gap-2"
                        >
                          <Info className="h-4 w-4" />
                          Past Events
                        </motion.div>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TabsContent value="upcoming">
                        <EventsGrid items={UPCOMING} />
                      </TabsContent>
                      <TabsContent value="past">
                        <EventsGrid items={PAST} />
                      </TabsContent>
                    </motion.div>
                  </AnimatePresence>
                </Tabs>
              );
            })()}
          </div>
          <div className="lg:col-span-4">
            {(() => {
              const [items, setItems] = useState<TimelineItem[] | null>(null);
              React.useEffect(() => {
                (async () => {
                  try {
                    const data = await getTimeline();
                    const mapped: TimelineItem[] = data
                      .sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime())
                      .map((t) => ({
                        id: t.id,
                        title: t.title,
                        date: new Date(t.dateISO).toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit' }),
                        description: t.description,
                        href: t.linkUrl,
                        subtitle: t.tag,
                      }));
                    setItems(mapped);
                  } catch {
                    setItems([]);
                  }
                })();
              }, []);
              const fallback: TimelineItem[] = [
                ...UPCOMING.map((e) => ({ title: e.title, date: `${e.date} • ${e.time}`, subtitle: e.location, description: e.description, href: '#' })),
                ...PAST.map((e) => ({ title: e.title, date: `${e.date} • ${e.time}`, subtitle: e.location, description: e.description, href: '#' })),
              ];
              return <Timeline title="Event Timeline" items={items ?? fallback} />;
            })()}
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default EventsPage;
