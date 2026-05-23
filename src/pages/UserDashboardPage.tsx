import React, { useState, useEffect, useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGspAuth } from "@/contexts/GspAuthContext";
import { getGspApplication } from "@/services/gspApi";
import { getEvents } from "@/services/eventsApi";
import { googleLogout } from "@react-oauth/google";
import {
  Home, LogOut, User, Calendar, BookOpen, MessageSquare,
  Activity, GraduationCap, ChevronRight, Star, Clock,
  Award, Bell, TrendingUp, Layers
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

/* ─── tiny helpers ─── */
const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const PROGRAMS = [
  { id: "gsp", label: "Global Scholars Programme", short: "GSP 2026", color: "bg-blue-600", link: "/gsp/dashboard", icon: GraduationCap },
  { id: "summer", label: "Summer STEM Camp", short: "Summer 2026", color: "bg-emerald-600", link: "/stem", icon: Star },
];

/* ─── activity bar chart (static mock sparkline) ─── */
const WEEKS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ActivityGraph: React.FC<{ data: number[] }> = ({ data }) => {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((v, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(v / max) * 100}%` }}
            transition={{ duration: 0.6, delay: i * 0.06 }}
            className="w-full rounded-t-sm bg-kc-blue/70 min-h-[2px]"
            style={{ height: `${(v / max) * 100}%` }}
          />
          <span className="text-[9px] text-muted-foreground">{WEEKS[i]}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── stat card ─── */
const StatCard: React.FC<{ icon: React.ElementType; label: string; value: string | number; color: string }> = ({ icon: Icon, label, value, color }) => (
  <motion.div whileHover={{ y: -3 }} className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3 shadow-sm">
    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
      <Icon className="h-5 w-5 text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground font-heading">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </motion.div>
);

/* ─── main ─── */
const UserDashboardPage: React.FC = () => {
  const { user, loading, signOut } = useGspAuth();
  const [gspApp, setGspApp] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  const displayName = user?.name?.trim() || user?.email?.split("@")[0] || "User";
  const userInitial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getGspApplication().then(d => setGspApp(d.application)).catch(() => null),
      getEvents().then(setEvents).catch(() => []),
    ]).finally(() => setFetching(false));
  }, [user]);

  const upcomingEvents = useMemo(() =>
    events.filter(e => new Date(e.date_iso) >= new Date()).sort((a, b) => new Date(a.date_iso).getTime() - new Date(b.date_iso).getTime()).slice(0, 3),
    [events]
  );

  const activityData = [2, 5, 3, 7, 4, 6, 1]; // mock weekly activity

  const handleLogout = () => { googleLogout(); signOut(); };

  if (!loading && !user) return <Navigate to="/auth?redirect=/dashboard" replace />;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-white border-b border-border sticky top-0 z-40 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 text-kc-blue font-heading font-bold text-sm hover:opacity-80 transition-opacity">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Knowledge Center</span>
          </Link>
          <span className="text-sm font-semibold text-foreground">My Dashboard</span>
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7 border border-kc-blue/20">
              <AvatarFallback className="bg-kc-blue text-white text-xs font-bold">{userInitial}</AvatarFallback>
            </Avatar>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-500 transition-colors px-2 py-1 rounded-full hover:bg-red-50">
              <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">

        {/* Hero greeting */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-kc-blue to-blue-700 rounded-3xl p-6 md:p-8 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute rounded-full border border-white"
                style={{ width: `${80 + i * 60}px`, height: `${80 + i * 60}px`, top: "50%", right: `${-20 + i * 15}px`, transform: "translateY(-50%)" }} />
            ))}
          </div>
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">Welcome back</p>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">{displayName}</h1>
              <p className="text-blue-200 text-sm mt-1">{user?.email}</p>
              <div className="flex items-center gap-2 mt-3">
                <Badge className="bg-white/20 text-white border-white/30 text-xs">
                  {user?.role === "admin" ? "Administrator" : "Student"}
                </Badge>
                {user?.isEmailVerified && <Badge className="bg-emerald-500/80 text-white border-0 text-xs">Verified</Badge>}
              </div>
            </div>
            <Avatar className="h-16 w-16 border-2 border-white/40 flex-shrink-0">
              <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">{userInitial}</AvatarFallback>
            </Avatar>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={Calendar} label="Upcoming Events" value={upcomingEvents.length} color="bg-kc-blue" />
          <StatCard icon={BookOpen} label="Blogs Liked" value={0} color="bg-violet-500" />
          <StatCard icon={MessageSquare} label="Comments" value={0} color="bg-amber-500" />
          <StatCard icon={Layers} label="Programs" value={gspApp ? 1 : 0} color="bg-emerald-600" />
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: Programs + Activity */}
          <div className="lg:col-span-2 space-y-6">

            {/* Programs */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-white rounded-3xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-5 w-5 text-kc-blue" />
                <h2 className="font-heading font-bold text-base">Programs Applied For</h2>
              </div>
              <div className="space-y-3">
                {PROGRAMS.map((prog) => {
                  const isGsp = prog.id === "gsp";
                  const hasApp = isGsp && Boolean(gspApp);
                  const status = isGsp ? (gspApp?.status || (fetching ? "loading" : "not started")) : "not started";
                  const progress = isGsp && gspApp ? (gspApp.status === "submitted" ? 100 : 40) : 0;
                  return (
                    <Link key={prog.id} to={prog.link}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-kc-blue/40 hover:bg-blue-50/30 transition-all group">
                      <div className={`w-10 h-10 rounded-xl ${prog.color} flex items-center justify-center flex-shrink-0`}>
                        <prog.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">{prog.label}</p>
                        {isGsp && (
                          <div className="mt-1.5">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground capitalize">{status}</span>
                              <span className="text-xs font-semibold text-kc-blue">{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-1.5" />
                          </div>
                        )}
                        {!isGsp && <p className="text-xs text-muted-foreground mt-0.5">Explore &amp; register</p>}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-kc-blue transition-colors flex-shrink-0" />
                    </Link>
                  );
                })}
                {!fetching && !gspApp && (
                  <p className="text-xs text-center text-muted-foreground py-2">You haven't started any program application yet.</p>
                )}
              </div>
            </motion.div>

            {/* Activity graph */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl border border-border p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-kc-blue" />
                  <h2 className="font-heading font-bold text-base">Activity This Week</h2>
                </div>
                <Badge variant="outline" className="text-xs rounded-full">Last 7 days</Badge>
              </div>
              <ActivityGraph data={activityData} />
              <p className="text-xs text-muted-foreground mt-3 text-center">Platform interactions across the week</p>
            </motion.div>

            {/* Blogs / Comments placeholder */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-3xl border border-border p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-4 w-4 text-violet-500" />
                  <h3 className="font-semibold text-sm">Liked Blogs</h3>
                </div>
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <BookOpen className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <p className="text-xs text-muted-foreground">No liked posts yet</p>
                  <Link to="/blog" className="mt-2 text-xs text-kc-blue font-medium hover:underline">Browse Blog →</Link>
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-border p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="h-4 w-4 text-amber-500" />
                  <h3 className="font-semibold text-sm">My Comments</h3>
                </div>
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <MessageSquare className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <p className="text-xs text-muted-foreground">No comments yet</p>
                  <Link to="/blog" className="mt-2 text-xs text-kc-blue font-medium hover:underline">Join a discussion →</Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Profile + Events */}
          <div className="space-y-6">

            {/* Profile card */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-3xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-kc-blue" />
                <h2 className="font-heading font-bold text-base">Profile</h2>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <Avatar className="h-16 w-16 border-2 border-kc-blue/20">
                  <AvatarFallback className="bg-kc-blue text-white text-2xl font-bold">{userInitial}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-base text-foreground">{displayName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                </div>
                <div className="w-full pt-3 border-t border-border space-y-2 text-left">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Role</span>
                    <span className="font-medium capitalize">{user?.role || "student"}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Email verified</span>
                    <span className={`font-medium ${user?.isEmailVerified ? "text-emerald-600" : "text-amber-500"}`}>
                      {user?.isEmailVerified ? "Yes" : "Pending"}
                    </span>
                  </div>
                  {user?.lastLoginAt && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Last login</span>
                      <span className="font-medium">{fmt(user.lastLoginAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Upcoming events */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl border border-border p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-kc-blue" />
                  <h2 className="font-heading font-bold text-base">Upcoming Events</h2>
                </div>
                <Link to="/events" className="text-xs text-kc-blue hover:underline font-medium">See all</Link>
              </div>
              {fetching ? (
                <div className="space-y-3">
                  {[1, 2].map(i => <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />)}
                </div>
              ) : upcomingEvents.length === 0 ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <Calendar className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <p className="text-xs text-muted-foreground">No upcoming events</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((ev) => (
                    <div key={ev.id} className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-kc-blue flex flex-col items-center justify-center text-white">
                        <span className="text-[9px] font-bold uppercase leading-none">{new Date(ev.date_iso).toLocaleString("en", { month: "short" })}</span>
                        <span className="text-sm font-bold leading-none">{new Date(ev.date_iso).getDate()}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground line-clamp-1">{ev.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{ev.time} · {ev.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Quick links */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
              className="bg-white rounded-3xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-kc-blue" />
                <h2 className="font-heading font-bold text-base">Quick Links</h2>
              </div>
              <div className="space-y-1">
                {[
                  { label: "Browse Blog", to: "/blog", icon: BookOpen },
                  { label: "View Events", to: "/events", icon: Calendar },
                  { label: "GSP Application", to: "/gsp/application", icon: GraduationCap },
                  { label: "STEM Programs", to: "/stem", icon: Award },
                ].map(link => (
                  <Link key={link.to} to={link.to}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 transition-colors group">
                    <link.icon className="h-4 w-4 text-muted-foreground group-hover:text-kc-blue transition-colors" />
                    <span className="text-sm text-foreground group-hover:text-kc-blue transition-colors">{link.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground ml-auto group-hover:text-kc-blue transition-colors" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Back to home button */}
        <div className="flex justify-center pt-4 pb-8">
          <Button asChild variant="outline" className="rounded-full gap-2">
            <Link to="/"><Home className="h-4 w-4" /> Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
