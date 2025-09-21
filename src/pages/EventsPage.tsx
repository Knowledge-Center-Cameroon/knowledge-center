import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Clock, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowButton } from "@/components/arrowbtn";
import StemBackground from "@/components/StemBackground";
import Timeline, { type TimelineItem } from "@/components/Timeline";
import { getTimeline } from "@/services/api";

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
    {items.map((e, i) => (
      <motion.div key={i} variants={fadeUp} whileHover={{ y: -4 }}>
        <Card className="relative h-full border-border/60 shadow-sm transition-all hover:shadow-2xl hover:border-border">
          {e.badge && (
            <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-kc-red text-white px-3 py-1 text-xs font-semibold shadow">
              <Sparkles className="h-3.5 w-3.5" /> {e.badge}
            </span>
          )}
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold leading-tight">{e.title}</h3>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {e.date}</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> {e.time}</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {e.location}</div>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-foreground/80">{e.description}</p>
            <div className="mt-5 flex items-center gap-3">
              <ArrowButton
                text="Details"
                bgPrimaryColor="#111827"
                bgSecondaryColor="#1f2937"
                textPrimaryColor="#ffffff"
                textSecondaryColor="#ffffff"
                className="rounded-full"
                href="#"
              />
              <a
                className="group inline-flex items-center text-sm font-semibold text-kc-blue hover:text-kc-red transition-colors"
                href={toGCalUrl(e.title, e.date, e.time, e.description, e.location)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Add to calendar
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
);

const EventsPage: React.FC = () => {
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
      <motion.div variants={fadeUp} className="mb-8 text-center">
      <div className="h-1 w-28 mx-auto mb-3 bg-kc-blue rounded-full" />
        <h1 className="heading-2 mb-6">
          <span className="text-kc-blue">KC</span> <span className="text-kc-red">Events</span>
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Join our upcoming events, hackathons, and community days. Save the dates and be part of the action.
        </p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-8">
            {(() => {
              const [activeTab, setActiveTab] = useState("upcoming");
              return (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="relative w-full mb-8 p-2 rounded-2xl bg-white/40 backdrop-blur-md border border-white/40 shadow-elegant grid grid-cols-2 gap-2">
                    {/* Animated indicator */}
                    <div
                      className="absolute bottom-2 left-2 h-1 rounded-full bg-neutral-900/60 transition-transform duration-300 ease-out"
                      style={{ width: 'calc((100% - 1rem) / 2)', transform: `translateX(${activeTab === 'upcoming' ? 0 : 100}%)` }}
                    />
                    <TabsTrigger value="upcoming" className="font-semibold rounded-xl data-[state=active]:bg-kc-blue data-[state=active]:text-white data-[state=inactive]:text-foreground/80 data-[state=inactive]:hover:bg-white/50">
                  Upcoming
                    </TabsTrigger>
                    <TabsTrigger value="past" className="font-semibold rounded-xl data-[state=active]:bg-kc-red data-[state=active]:text-white data-[state=inactive]:text-foreground/80 data-[state=inactive]:hover:bg-white/50">
                  Past
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming">
                    <EventsGrid items={UPCOMING} />
                  </TabsContent>
                  <TabsContent value="past">
                    <EventsGrid items={PAST} />
                  </TabsContent>
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
