import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, MapPin, Clock, ChevronDown, Calendar, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StemBackground from "@/components/StemBackground";
import { useParallax, Parallax } from "@/hooks/use-parallax";
import { useSeo } from "@/hooks/useSeo";
import { getEvents, type KCEvent } from "@/services/eventsApi";

// Pre-seeded fallback events in case backend is empty
const SEED_EVENTS: KCEvent[] = [
  {
    id: "seed-1",
    title: "Opening of Knowledge Center Buea",
    date: "Feb 9, 2026",
    date_iso: "2026-02-09",
    time: "10:00 - 14:00",
    location: "KC Campus, Buea",
    description: "Join us for the grand opening ceremony of the Knowledge Center Buea. Meet the team, explore our facilities, and discover opportunities for STEM learning and innovation.",
    badge: "Upcoming",
  },
  {
    id: "seed-2",
    title: "National STEM Competition",
    date: "Dec 28, 2025",
    date_iso: "2025-12-28",
    time: "09:00 - 18:00",
    location: "KC Campus, Buea",
    description: "A fast-paced build day where students prototype solutions to real local challenges with mentors on-site.",
    badge: "Featured",
  },
];

interface Event {
  title: string;
  date: string;
  dateObj: Date;
  time: string;
  location: string;
  description: string;
  badge?: string;
}

const toGCalUrl = (title: string, date: string, time?: string, details?: string, location?: string) => {
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

// mobileLineLeft: pass "left-3" to align dot with line on mobile
const TimelineEvent: React.FC<{ event: Event; index: number; isUpcoming: boolean; mobileLineLeft?: string }> = ({ event, index, isUpcoming, mobileLineLeft }) => {
  const isLeft = index % 2 === 0;
  return (
    <motion.div
      initial={{ opacity: 0, x: 30, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`flex gap-4 md:gap-8 mb-8 md:mb-10 items-start relative`}
    >
      {/* Timeline dot - centered on line on mobile, centered on vertical line on desktop */}
      <div className={`flex flex-col items-center flex-shrink-0 z-10 ${mobileLineLeft ? "absolute left-3.5 transform -translate-x-1/2" : "md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:top-0"}`}>
        <motion.div
          whileHover={{ scale: 1.25 }}
          className="w-6 h-6 rounded-full bg-kc-blue border-3 border-background flex items-center justify-center shadow-lg"
        >
          <div className="w-2 h-2 rounded-full bg-white" />
        </motion.div>
      </div>

      {/* Card container - all cards on right on mobile, alternating on desktop */}
      <div className={`flex-1 ${isLeft ? "md:order-first md:flex md:justify-end md:pr-6" : ""}`}>
          <motion.div
            whileHover={{ y: -6 }}
            className="group relative max-w-xs w-full overflow-hidden rounded-3xl border border-kc-blue/10 ring-1 ring-kc-blue/5 bg-white/95 shadow-card transition-all duration-300 hover:shadow-hover"
          >
            <div className="relative p-4 md:p-5 z-10">
              {event.badge && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-1.5 mb-3 rounded-full bg-kc-blue/10 text-kc-blue px-3 py-1 text-xs font-semibold border border-kc-blue/30"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-kc-blue" />
                  {event.badge}
                </motion.div>
              )}

              <h3 className="text-sm md:text-base font-heading font-bold mb-2.5 text-kc-blue line-clamp-2">
                {event.title}
              </h3>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                  <CalendarDays className="h-3.5 w-3.5 text-kc-blue flex-shrink-0" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                  <Clock className="h-3.5 w-3.5 text-kc-blue flex-shrink-0" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                  <MapPin className="h-3.5 w-3.5 text-kc-blue flex-shrink-0" />
                  <span>{event.location}</span>
                </div>
              </div>

              <p className="text-xs text-kc-black/80 mb-4 leading-relaxed line-clamp-3">
                {event.description}
              </p>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="blue"
                  size="sm"
                  className="rounded-full gap-1.5 h-8 px-3 text-xs shadow-sm hover:shadow-md"
                >
                  <Info className="h-3.5 w-3.5" />
                  Details
                </Button>
                <motion.a
                  href={toGCalUrl(event.title, event.date, event.time, event.description, event.location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-1.5 px-3 h-8 text-xs font-medium text-kc-blue hover:text-kc-blue/90 border border-kc-blue/30 rounded-full transition-colors hover:bg-kc-blue/10"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Add
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
    </motion.div>
  );
};

const EventsTimelineSkeleton = () => (
  <div className="relative pb-16">
    <div className="absolute left-3.5 md:left-1/2 top-0 bottom-0 w-1 bg-kc-blue/20 md:-translate-x-1/2" />
    <div className="space-y-8">
      {Array.from({ length: 4 }).map((_, index) => {
        const isLeft = index % 2 === 0;
        return (
          <div
            key={index}
            className={`relative flex md:grid md:grid-cols-2 md:gap-12 ${
              isLeft ? "" : "md:[&>*]:col-start-2"
            }`}
          >
            <div className="absolute left-3.5 md:left-1/2 top-2 h-6 w-6 -translate-x-1/2 rounded-full border-4 border-white bg-kc-blue/20" />
            <div className="ml-12 md:ml-0 w-full">
              <div className="max-w-xs rounded-3xl border border-kc-blue/10 ring-1 ring-kc-blue/5 bg-white/95 p-5 shadow-sm">
                <Skeleton className="mb-4 h-6 w-24 rounded-full" />
                <Skeleton className="mb-4 h-5 w-4/5" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-36" />
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <div className="mt-5 space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
                <div className="mt-5 flex gap-2">
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-8 w-16 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const EventsPage = () => {
  const [dynamicEvents, setDynamicEvents] = useState<KCEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        if (data && data.length > 0) {
          setDynamicEvents(data);
        } else {
          setDynamicEvents(SEED_EVENTS);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setDynamicEvents(SEED_EVENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useSeo({
    title: "Events | Knowledge Center - STEM Programs & Competitions",
    description: "Discover upcoming Knowledge Center events including STEM competitions, workshops, mentorships, and networking opportunities for students and professionals.",
  });

  const [expandUpcoming, setExpandUpcoming] = useState(false);
  const [expandPast, setExpandPast] = useState(false);

  const now = new Date();

  const { upcoming, past } = useMemo(() => {
    const mapped = dynamicEvents.map(e => ({
      ...e,
      dateObj: new Date(e.date_iso)
    }));
    const upcoming = mapped.filter(e => e.dateObj >= now).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
    const past = mapped.filter(e => e.dateObj < now).sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
    return { upcoming, past };
  }, [dynamicEvents]);

  const upcomingToShow = expandUpcoming ? upcoming : upcoming.slice(0, 3);
  const pastToShow = expandPast ? past : past.slice(0, 3);

  const hasMoreUpcoming = upcoming.length > 3;
  const hasMorePast = past.length > 3;

  const { ref, y } = useParallax(20);

  return (
    <motion.section
      ref={ref as any}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen relative py-16 md:py-24 lg:py-32"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <StemBackground opacity={0.08} density={35} lineDistance={130} speed={0.4} showIcons={true} />
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        {/* Header */}
        <Parallax style={{ y }} className="text-center mb-16 md:mb-20">
          <div className="h-1 w-28 mx-auto mb-3 bg-kc-blue rounded-full" />
          <h1 className="heading-1 mb-4">
            <span className="text-kc-blue">Upcoming Events</span>
          </h1>
          <p className="subheading max-w-3xl mx-auto">
            Join us for exciting STEM events, competitions, and workshops designed to inspire and educate young minds.
          </p>
        </Parallax>

        {/* Timeline */}
        <div className="relative">
          {loading ? (
            <EventsTimelineSkeleton />
          ) : (
            <>

          {/* Mobile Timeline: Upcoming Events */}
          <div className="md:hidden">
            <div className="relative pl-12 pb-10">
              <h2 className="heading-3 mb-8 text-kc-blue -ml-12">Upcoming Events</h2>
              {/* Mobile vertical line for upcoming events - starts below heading */}
              <div className="absolute left-3.5 top-12 bottom-10 w-1 bg-kc-blue/40" style={{ zIndex: 0 }} />
              
              <div className="mb-12 relative z-5">
                <AnimatePresence>
                  {upcomingToShow.map((event, index) => (
                    <TimelineEvent key={event.title} event={event} index={index} isUpcoming={true} mobileLineLeft="left-3" />
                  ))}
                </AnimatePresence>
                {hasMoreUpcoming && !expandUpcoming && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setExpandUpcoming(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full border-2 border-kc-blue text-kc-blue font-semibold hover:bg-kc-blue/10 transition-colors"
                  >
                    View {upcoming.length - 3} More Events
                    <ChevronDown className="h-5 w-5" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Mobile Timeline: Past Events */}
            {past.length > 0 && (
              <div className="relative pl-12 mt-8 pb-10">
                <h2 className="heading-3 mb-8 text-kc-blue -ml-12">Past Events</h2>
                {/* Mobile vertical line for past events - starts below heading */}
                <div className="absolute left-3.5 top-12 bottom-10 w-1 bg-kc-blue/20" style={{ zIndex: 0 }} />
                
                <div className="relative z-5">
                  <AnimatePresence>
                    {pastToShow.map((event, index) => (
                      <TimelineEvent key={event.title} event={event} index={index} isUpcoming={false} mobileLineLeft="left-3" />
                    ))}
                  </AnimatePresence>
                  {hasMorePast && !expandPast && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setExpandPast(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full border-2 border-kc-blue text-kc-blue font-semibold hover:bg-kc-blue/10 transition-colors"
                    >
                      View {past.length - 3} More Events
                      <ChevronDown className="h-5 w-5" />
                    </motion.button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Timeline */}
          <div className="hidden md:block">
            {/* Upcoming Events with vertical line */}
            <div className="relative pb-16">
              <div
                className="absolute left-1/2 transform -translate-x-1/2 w-1.5 bg-kc-blue/40 hidden md:block"
                style={{ top: 0, bottom: hasMoreUpcoming && !expandUpcoming ? "4.5rem" : "0" }}
              />
              
              <AnimatePresence>
                {upcomingToShow.map((event, index) => (
                  <TimelineEvent key={event.title} event={event} index={index} isUpcoming={true} />
                ))}
              </AnimatePresence>

              {hasMoreUpcoming && !expandUpcoming && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center my-12 relative z-20 bg-white px-6"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setExpandUpcoming(true)}
                    className="flex items-center justify-center gap-2 py-3 px-8 rounded-full border-2 border-kc-blue text-kc-blue font-semibold hover:bg-kc-blue/10 transition-colors"
                  >
                    View {upcoming.length - 3} More Upcoming Events
                    <ChevronDown className="h-5 w-5" />
                  </motion.button>
                </motion.div>
              )}
            </div>

            {past.length > 0 && (
              <>
                <div className="my-16 text-center relative z-10 bg-background py-4">
                  <h2 className="heading-2 text-kc-blue">Past Events</h2>
                </div>

                {/* Past Events with vertical line */}
                <div className="relative pb-16">
                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 w-1.5 bg-kc-blue/20 hidden md:block"
                    style={{ top: 0, bottom: hasMorePast && !expandPast ? "4.5rem" : "0" }}
                  />
                  
                  <AnimatePresence>
                    {pastToShow.map((event, index) => {
                      // Continue alternating from where upcoming events left off
                      const totalUpcomingCount = upcomingToShow.length;
                      const adjustedIndex = totalUpcomingCount + index;
                      return (
                        <TimelineEvent key={event.title} event={event} index={adjustedIndex} isUpcoming={false} />
                      );
                    })}
                  </AnimatePresence>

                  {hasMorePast && !expandPast && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center mt-12 relative z-20 bg-white px-6"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setExpandPast(true)}
                      className="flex items-center justify-center gap-2 py-3 px-8 rounded-full border-2 border-kc-blue text-kc-blue font-semibold hover:bg-kc-blue/10 transition-colors"
                    >
                      View {past.length - 3} More Past Events
                      <ChevronDown className="h-5 w-5" />
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </>
            )}
          </div>
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default EventsPage;

