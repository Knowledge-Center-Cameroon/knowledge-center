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
import { useSeo } from "@/hooks/useSeo";

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
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  active: {
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
    rotateX: -15
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  hover: {
    y: -12,
    scale: 1.02,
    rotateX: 2,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    rotateX: 15,
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
  <motion.div
    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
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
          style={{ transformOrigin: "center" }}
        >
          <Card className="group relative h-full overflow-hidden bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl hover:shadow-2xl rounded-3xl transition-all duration-500 hover:border-kc-blue/50 hover:bg-white/95">
            {/* Animated border gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-kc-blue/20 via-transparent to-kc-red/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {e.badge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1), type: "spring", stiffness: 260 }}
                className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-kc-red to-kc-red/90 text-white px-3 py-1.5 text-sm font-medium shadow-lg backdrop-blur-sm border border-white/20"
              >
                <Sparkles className="h-4 w-4" />
                {e.badge}
              </motion.div>
            )}
            <CardHeader className="p-6 pb-0 relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <motion.h3
                    className="text-xl font-bold leading-tight mb-2 group-hover:text-kc-blue transition-colors duration-300"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                  >
                    {e.title}
                  </motion.h3>
                  <motion.div
                    className="flex flex-wrap gap-4 text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                  >
                    <div className="flex items-center gap-1.5 transition-colors duration-300 group-hover:text-kc-blue/80">
                      <CalendarDays className="h-4 w-4" />
                      {e.date}
                    </div>
                    <div className="flex items-center gap-1.5 transition-colors duration-300 group-hover:text-kc-blue/80">
                      <Clock className="h-4 w-4" />
                      {e.time}
                    </div>
                  </motion.div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <motion.div
                className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4 transition-colors duration-300 group-hover:text-kc-blue/80"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (i * 0.1) }}
              >
                <MapPin className="h-4 w-4" />
                {e.location}
              </motion.div>
              <motion.p
                className="text-base leading-relaxed text-foreground/80 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + (i * 0.1) }}
              >
                {e.description}
              </motion.p>
              <motion.div
                className="flex flex-wrap items-center gap-4 mt-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + (i * 0.1) }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowButton
                    text="Learn More"
                    bgPrimaryColor="#2563eb"
                    bgSecondaryColor="#1d4ed8"
                    textPrimaryColor="#ffffff"
                    textSecondaryColor="#ffffff"
                    className="rounded-full text-base"
                    href="#"
                  />
                </motion.div>
                <motion.a
                  className="group inline-flex items-center text-sm font-medium text-muted-foreground hover:text-kc-blue transition-colors duration-300"
                  href={toGCalUrl(e.title, e.date, e.time, e.description, e.location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Calendar className="mr-1.5 h-4 w-4" />
                  Add to Calendar
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.a>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </AnimatePresence>
  </motion.div>
);

const EventsPage = () => {
  useSeo({
    title: "STEM Events and Competitions",
    description:
      "Discover upcoming and past STEM events, competitions, and workshops hosted by Knowledge Center Cameroon.",
  });

  const upcomingTimelineItems: TimelineItem[] = UPCOMING.map((e) => ({
    title: e.title,
    date: e.date,
    subtitle: e.time,
    description: e.location,
  }));

  const pastTimelineItems: TimelineItem[] = PAST.map((e) => ({
    title: e.title,
    date: e.date,
    subtitle: e.time,
    description: e.location,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="container mx-auto px-4 pt-28 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="heading-2 mb-4">
            <span className="text-kc-blue">Events</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join us for exciting STEM events, competitions, and workshops designed to inspire and educate.
          </p>
        </motion.div>

        {/* Mobile nav between cards and timeline */}
        <div className="mb-4 flex gap-2 md:hidden text-xs">
          <button
            className="flex-1 rounded-full border border-slate-300 bg-white/80 px-3 py-1"
            onClick={() => {
              const el = document.getElementById("events-cards");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            Events
          </button>
          <button
            className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1"
            onClick={() => {
              const el = document.getElementById("events-timeline");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            Timeline
          </button>
        </div>

        <Tabs defaultValue="upcoming" className="w-full" id="events-cards">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upcoming" className="text-lg">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past" className="text-lg">Past Events</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <EventsGrid items={UPCOMING} />
          </TabsContent>
          <TabsContent value="past">
            <EventsGrid items={PAST} />
          </TabsContent>
        </Tabs>

        {/* Timeline summary (especially helpful on mobile) */}
        <div id="events-timeline" className="mt-16 grid gap-10 lg:grid-cols-2">
          <Timeline title="Upcoming Timeline" items={upcomingTimelineItems} />
          <Timeline title="Past Timeline" items={pastTimelineItems} />
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
