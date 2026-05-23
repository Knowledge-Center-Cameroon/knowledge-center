import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { googleLogout } from "@react-oauth/google";
import {
  Activity,
  Award,
  BookOpen,
  Calendar,
  ChevronRight,
  GraduationCap,
  Home,
  Layers,
  LogOut,
  MessageSquare,
  Star,
  TrendingUp,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGspAuth } from "@/contexts/GspAuthContext";
import { useUser } from "@/contexts/UserContext";
import { blogPosts } from "@/data/blogs";
import { computeProgressPct, computeSectionState, getPersistedSectionState } from "@/lib/gspUtils";
import { getBlogComments, getBlogLikeStatus, getPublishedBlogPosts } from "@/services/blogApi";
import { getEvents, type KCEvent } from "@/services/eventsApi";
import { getGspApplication } from "@/services/gspApi";

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const PROGRAMS = [
  {
    id: "gsp",
    label: "Global Scholars Programme",
    short: "GSP 2026",
    link: "/gsp/dashboard",
    icon: GraduationCap,
  },
  {
    id: "summer",
    label: "Summer STEM Camp",
    short: "Summer 2026",
    link: "/projects/summer-education",
    icon: Star,
  },
];

const WEEKS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CARD_CLASS = "rounded-2xl border border-kc-blue/10 bg-white p-5 shadow-card";

type BlogPostSummary = {
  id: string;
  title: string;
};

type DashboardInteraction = {
  likedPosts: BlogPostSummary[];
  comments: number;
};

function getRoleLabel(role?: string) {
  if (role === "admin") return "Administrator";
  return "User";
}

function safeReadJson<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
}

function getPostId(post: any) {
  return String(post?.slug || post?.id || post?._id || "");
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function getGreeting(activityTotal: number) {
  const hour = new Date().getHours();
  const dayPart =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (activityTotal >= 4) {
    return {
      title: `${dayPart},`,
      note: "You have real momentum today. Keep the important tabs close.",
    };
  }

  if (hour < 12) {
    return {
      title: `${dayPart},`,
      note: "Fresh start. Pick the one thing that moves your KC work forward.",
    };
  }

  if (hour < 17) {
    return {
      title: `${dayPart},`,
      note: "A steady afternoon is enough. Your portal is ready when you are.",
    };
  }

  return {
    title: `${dayPart},`,
    note: "Wind down the day cleanly. Check what changed, then keep going.",
  };
}

function buildActivityData({
  application,
  likedPosts,
  comments,
  lastLoginAt,
}: {
  application: any;
  likedPosts: BlogPostSummary[];
  comments: number;
  lastLoginAt?: string;
}) {
  const today = startOfDay(new Date());
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const data = Array(7).fill(0);

  const addDate = (value?: string | null) => {
    if (!value) return;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return;
    const day = startOfDay(date);
    const offset = Math.floor((day.getTime() - weekStart.getTime()) / 86400000);
    if (offset >= 0 && offset < 7) data[offset] += 1;
  };

  addDate(lastLoginAt);
  addDate(application?.updatedAt || application?.updated_at || application?.modifiedAt || application?.modified_at);
  addDate(application?.createdAt || application?.created_at);

  if (likedPosts.length > 0) data[Math.min(6, Math.max(0, new Date().getDay() - 1))] += likedPosts.length;
  if (comments > 0) data[Math.min(6, Math.max(0, new Date().getDay() - 1))] += comments;

  return data;
}

const ActivityGraph: React.FC<{ data: number[] }> = ({ data }) => {
  const max = Math.max(...data, 1);
  const total = data.reduce((sum, item) => sum + item, 0);

  return (
    <div>
      <div className="flex h-20 items-end gap-2">
        {data.map((value, index) => (
          <div key={WEEKS[index]} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(8, (value / max) * 100)}%` }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className="w-full rounded-t-md bg-kc-blue/80 shadow-sm"
            />
            <span className="text-[10px] font-semibold text-muted-foreground">{WEEKS[index]}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        {total > 0 ? `${total} recorded portal interactions this week` : "No recorded portal interactions this week"}
      </p>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string | number;
}> = ({ icon: Icon, label, value }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="rounded-2xl border border-kc-blue/10 bg-white p-4 shadow-card"
  >
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-kc-blue/10 text-kc-blue">
      <Icon className="h-5 w-5" />
    </div>
    <p className="font-heading text-2xl font-bold text-foreground">{value}</p>
    <p className="text-xs font-semibold text-muted-foreground">{label}</p>
  </motion.div>
);

const UserDashboardPage: React.FC = () => {
  const { user, loading, signOut } = useGspAuth();
  const { user: blogUser } = useUser();
  const [gspApp, setGspApp] = useState<any>(null);
  const [events, setEvents] = useState<KCEvent[]>([]);
  const [interactions, setInteractions] = useState<DashboardInteraction>({
    likedPosts: [],
    comments: 0,
  });
  const [fetching, setFetching] = useState(true);

  const displayName = user?.name?.trim() || user?.email?.split("@")[0] || "User";
  const userInitial = displayName.charAt(0).toUpperCase();
  const roleLabel = getRoleLabel(user?.role);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function loadDashboard() {
      setFetching(true);
      try {
        const [applicationResult, eventResult, dynamicPosts] = await Promise.all([
          getGspApplication().catch(() => ({ application: null })),
          getEvents().catch(() => []),
          getPublishedBlogPosts().catch(() => []),
        ]);

        if (cancelled) return;

        const mappedDynamicPosts = dynamicPosts.map((post: any) => ({
          id: getPostId(post),
          title: String(post?.title || "Untitled post"),
        }));
        const allPosts = [
          ...blogPosts.map((post) => ({ id: post.id, title: post.title })),
          ...mappedDynamicPosts,
        ].filter((post) => post.id);

        setGspApp(applicationResult.application);
        setEvents(eventResult);

        const localLiked = safeReadJson<Record<string, boolean>>("kc_liked_posts_v1", {});
        const localLikesV2 = safeReadJson<Record<string, string[]>>("kc_blog_likes_v2", {});
        const userId = blogUser?.id || user.id;

        const interactionResults = await Promise.all(
          allPosts.map(async (post) => {
            const localIsLiked =
              localLiked[post.id] === true || (localLikesV2[post.id] || []).includes(userId);
            const [likeStatus, commentsData] = await Promise.all([
              getBlogLikeStatus(post.id, userId).catch(() => ({
                isLiked: localIsLiked,
                likeCount: 0,
              })),
              getBlogComments(post.id, 1, 25, userId).catch(() => ({
                comments: [],
                pagination: { page: 1, limit: 25, total: 0, pages: 1 },
              })),
            ]);

            return {
              post,
              isLiked: likeStatus.isLiked || localIsLiked,
              comments: commentsData.comments.filter((comment) => comment.userId === userId).length,
            };
          }),
        );

        if (cancelled) return;

        setInteractions({
          likedPosts: interactionResults.filter((item) => item.isLiked).map((item) => item.post),
          comments: interactionResults.reduce((sum, item) => sum + item.comments, 0),
        });
      } finally {
        if (!cancelled) setFetching(false);
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [blogUser?.id, user]);

  const upcomingEvents = useMemo(
    () =>
      events
        .filter((event) => new Date(event.date_iso) >= new Date())
        .sort((a, b) => new Date(a.date_iso).getTime() - new Date(b.date_iso).getTime())
        .slice(0, 3),
    [events],
  );

  const appPayload = useMemo(() => ({ ...(gspApp?.data || {}), ...(gspApp || {}) }), [gspApp]);
  const sectionState = useMemo(
    () => getPersistedSectionState(gspApp) || computeSectionState(appPayload),
    [appPayload, gspApp],
  );
  const progress = gspApp?.status === "submitted" ? 100 : computeProgressPct(sectionState);
  const hasApplication = Boolean(gspApp?.r_id || gspApp?.id || gspApp?.status);
  const activityData = useMemo(
    () =>
      buildActivityData({
        application: gspApp,
        likedPosts: interactions.likedPosts,
        comments: interactions.comments,
        lastLoginAt: user?.lastLoginAt,
      }),
    [gspApp, interactions.comments, interactions.likedPosts, user?.lastLoginAt],
  );
  const activityTotal = activityData.reduce((sum, item) => sum + item, 0);
  const greeting = getGreeting(activityTotal);

  const handleLogout = () => {
    googleLogout();
    signOut();
  };

  if (!loading && !user) return <Navigate to="/auth?redirect=/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80" aria-label="Knowledge Center home">
            <img src="/logo.png" alt="Knowledge Center Logo" className="h-10 w-10 object-contain" />
            <span className="hidden font-heading text-base font-bold text-kc-blue sm:inline">
              Knowledge Center
            </span>
          </Link>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-sm font-semibold text-kc-blue">KC Portal</span>
            <span className="text-xs text-muted-foreground">- My Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-kc-blue/20">
              <AvatarFallback className="bg-kc-blue text-xs font-bold text-white">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold text-muted-foreground hover:bg-kc-blue/10 hover:text-kc-blue"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-kc-blue/10 bg-white p-6 shadow-card md:p-8"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.14em] text-kc-blue">
                {greeting.title}
              </p>
              <h1 className="font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl">
                {displayName}
              </h1>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">{greeting.note}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge className="rounded-full bg-kc-blue/10 text-kc-blue hover:bg-kc-blue/10">
                  {roleLabel}
                </Badge>
                {user?.isEmailVerified && (
                  <Badge className="rounded-full bg-kc-blue text-white hover:bg-kc-blue">
                    Verified email
                  </Badge>
                )}
              </div>
            </div>
            <Avatar className="h-16 w-16 ring-4 ring-kc-blue/10">
              <AvatarFallback className="bg-kc-blue font-heading text-2xl font-bold text-white">
                {userInitial}
              </AvatarFallback>
            </Avatar>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="grid grid-cols-2 gap-3 md:grid-cols-4"
        >
          <StatCard icon={Calendar} label="Upcoming Events" value={upcomingEvents.length} />
          <StatCard icon={BookOpen} label="Blogs Liked" value={interactions.likedPosts.length} />
          <StatCard icon={MessageSquare} label="Comments" value={interactions.comments} />
          <StatCard icon={Layers} label="Programs" value={hasApplication ? 1 : 0} />
        </motion.section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6 lg:col-span-2">
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={CARD_CLASS}
            >
              <div className="mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-kc-blue" />
                <h2 className="font-heading text-base font-bold text-foreground">Programs</h2>
              </div>
              <div className="space-y-3">
                {PROGRAMS.map((program) => {
                  const isGsp = program.id === "gsp";
                  const status = isGsp
                    ? gspApp?.status || (fetching ? "loading" : "not started")
                    : "open";

                  return (
                    <Link
                      key={program.id}
                      to={program.link}
                      className="group flex items-center gap-4 rounded-2xl border border-kc-blue/10 bg-white p-4 text-foreground transition-all hover:border-kc-blue/30 hover:bg-kc-blue/5 hover:text-foreground"
                    >
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-kc-blue/10 text-kc-blue">
                        <program.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-bold text-foreground">{program.label}</p>
                          <Badge variant="outline" className="rounded-md text-[10px]">
                            {program.short}
                          </Badge>
                        </div>
                        {isGsp ? (
                          <div className="mt-2">
                            <div className="mb-1 flex items-center justify-between gap-3">
                              <span className="text-xs capitalize text-muted-foreground">{status}</span>
                              <span className="text-xs font-bold text-kc-blue">{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        ) : (
                          <p className="mt-1 text-xs text-muted-foreground">Explore the programme page</p>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-kc-blue" />
                    </Link>
                  );
                })}
                {!fetching && !hasApplication && (
                  <p className="py-2 text-center text-xs text-muted-foreground">
                    No GSP application has been started yet.
                  </p>
                )}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.14 }}
              className="rounded-2xl border border-kc-blue/15 bg-kc-blue/5 p-4 text-sm text-kc-blue"
            >
              Your dashboard gathers your KC portal activity in one place. Start with GSP if you are applying, or use the links below to continue reading and exploring KC programmes.
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className={CARD_CLASS}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-kc-blue" />
                  <h2 className="font-heading text-base font-bold text-foreground">Activity This Week</h2>
                </div>
                <Badge className="rounded-full bg-kc-blue/10 text-kc-blue hover:bg-kc-blue/10">
                  Real data
                </Badge>
              </div>
              <ActivityGraph data={activityData} />
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              <div className={CARD_CLASS}>
                <div className="mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-kc-blue" />
                  <h3 className="text-sm font-bold text-foreground">Liked Blogs</h3>
                </div>
                {interactions.likedPosts.length === 0 ? (
                  <div className="py-6 text-center">
                    <BookOpen className="mx-auto mb-2 h-8 w-8 text-kc-blue/40" />
                    <p className="text-xs text-muted-foreground">No liked posts yet</p>
                    <Link to="/blog" className="mt-2 inline-flex text-xs font-bold text-kc-blue hover:underline">
                      Browse Blog
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {interactions.likedPosts.slice(0, 3).map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.id}`}
                        className="block rounded-md border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-kc-blue/5"
                      >
                        {post.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div className={CARD_CLASS}>
                <div className="mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-kc-blue" />
                  <h3 className="text-sm font-bold text-foreground">My Comments</h3>
                </div>
                <div className="py-6 text-center">
                  <MessageSquare className="mx-auto mb-2 h-8 w-8 text-kc-blue/40" />
                  <p className="text-xs text-muted-foreground">
                    {interactions.comments > 0
                      ? `${interactions.comments} comment${interactions.comments === 1 ? "" : "s"} recorded`
                      : "No comments yet"}
                  </p>
                  <Link to="/blog" className="mt-2 inline-flex text-xs font-bold text-kc-blue hover:underline">
                    Join a discussion
                  </Link>
                </div>
              </div>
            </motion.section>
          </div>

          <aside className="space-y-6">
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={CARD_CLASS}
            >
              <div className="mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-kc-blue" />
                <h2 className="font-heading text-base font-bold text-foreground">Profile</h2>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <Avatar className="h-16 w-16 ring-4 ring-kc-blue/10">
                  <AvatarFallback className="bg-kc-blue font-heading text-2xl font-bold text-white">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-foreground">{displayName}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <div className="w-full space-y-2 border-t border-border pt-3 text-left">
                  <div className="flex justify-between gap-3 text-xs">
                    <span className="text-muted-foreground">Role</span>
                    <span className="font-bold text-foreground">{roleLabel}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-xs">
                    <span className="text-muted-foreground">Email verified</span>
                    <span className="font-bold text-kc-blue">
                      {user?.isEmailVerified ? "Yes" : "Pending"}
                    </span>
                  </div>
                  {user?.lastLoginAt && (
                    <div className="flex justify-between gap-3 text-xs">
                      <span className="text-muted-foreground">Last login</span>
                      <span className="font-bold text-foreground">{fmt(user.lastLoginAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className={CARD_CLASS}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-kc-blue" />
                  <h2 className="font-heading text-base font-bold text-foreground">Upcoming Events</h2>
                </div>
                <Link to="/events" className="text-xs font-bold text-kc-blue hover:underline">
                  See all
                </Link>
              </div>
              {fetching ? (
                <div className="space-y-3">
                  {[1, 2].map((item) => (
                    <div key={item} className="h-14 animate-pulse rounded-md bg-muted" />
                  ))}
                </div>
              ) : upcomingEvents.length === 0 ? (
                <div className="py-6 text-center">
                  <Calendar className="mx-auto mb-2 h-8 w-8 text-kc-blue/40" />
                  <p className="text-xs text-muted-foreground">No upcoming events</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-start gap-3 rounded-2xl bg-kc-blue/5 p-3">
                      <div className="flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-kc-blue text-white">
                        <span className="text-[9px] font-bold uppercase leading-none">
                          {new Date(event.date_iso).toLocaleString("en", { month: "short" })}
                        </span>
                        <span className="text-sm font-bold leading-none">{new Date(event.date_iso).getDate()}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-1 text-xs font-bold text-foreground">{event.title}</p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {event.time} / {event.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className={CARD_CLASS}
            >
              <div className="mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-kc-blue" />
                <h2 className="font-heading text-base font-bold text-foreground">Quick Links</h2>
              </div>
              <div className="space-y-1">
                {[
                  { label: "Browse Blog", to: "/blog", icon: BookOpen },
                  { label: "View Events", to: "/events", icon: Calendar },
                  { label: "GSP Dashboard", to: "/gsp/dashboard", icon: GraduationCap },
                  { label: "STEM Programs", to: "/projects/stem", icon: Award },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="group flex items-center gap-3 rounded-md px-3 py-2.5 text-foreground hover:bg-kc-blue/5 hover:text-foreground"
                  >
                    <link.icon className="h-4 w-4 text-kc-blue" />
                    <span className="text-sm font-semibold">{link.label}</span>
                    <ChevronRight className="ml-auto h-3.5 w-3.5 text-kc-blue" />
                  </Link>
                ))}
              </div>
            </motion.section>
          </aside>
        </div>

        <div className="flex justify-center pb-8 pt-4">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default UserDashboardPage;
