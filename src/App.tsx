import React, { Suspense } from "react";
import EngagingLoader from "@/components/EngagingLoader";
import { optimisticPreloadAuthFlow } from "@/route-prefetch";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { UserProvider } from "./contexts/UserContext";
import { GspAuthProvider } from "./contexts/GspAuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
const Layout = React.lazy(() => import("./components/Layout"));
const Home = React.lazy(() => import("./pages/Home"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const ProjectsPage = React.lazy(() => import("./pages/ProjectsPage"));
const ProjectDetailPage = React.lazy(() => import("./pages/ProjectDetailPage"));
const BlogPage = React.lazy(() => import("./pages/BlogPage"));
const BlogDetailPage = React.lazy(() => import("./pages/BlogDetailPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const DonatePage = React.lazy(() => import("./pages/DonatePage"));
const StemRegistrationPage = React.lazy(() => import("./pages/StemRegistrationPage"));
const StemRegistrationApplyPage = React.lazy(() => import("./pages/StemRegistrationApplyPage"));
const StemRegistrationSuccessPage = React.lazy(() => import("./pages/StemRegistrationSuccessPage"));
const StemRegistrationManagePage = React.lazy(() => import("./pages/StemRegistrationManagePage"));
const PrivacyPage = React.lazy(() => import("./pages/PrivacyPage"));
const TermsPage = React.lazy(() => import("./pages/TermsPage"));
const EventsPage = React.lazy(() => import("./pages/EventsPage"));
const AuthPage = React.lazy(() => import("./pages/AuthPage"));
const GspDashboardPage = React.lazy(() => import("./pages/GspDashboardPage"));
const AuthCallbackPage = React.lazy(() => import("./pages/AuthCallbackPage"));
const GspApplicationPage = React.lazy(() => import("./pages/GspApplicationPage"));
const GspDecisionPage = React.lazy(() => import("./pages/GspDecisionPage"));
const GspAdminPage = React.lazy(() => import("./pages/GspAdminPage"));
const UserDashboardPage = React.lazy(() => import("./pages/UserDashboardPage"));
const GspAdminApplicationPage = React.lazy(() => import("./pages/GspAdminApplicationPage"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();
const MIN_BOOT_LOADER_MS = 1400;

const PageSkeletonFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
      {children}
    </div>
  </div>
);

const ProjectsPageSkeleton: React.FC = () => (
  <PageSkeletonFrame>
    <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
      <Skeleton className="mx-auto mb-4 h-1 w-28 rounded-full" />
      <Skeleton className="mx-auto mb-5 h-12 w-72 max-w-full" />
      <Skeleton className="mx-auto h-5 w-full max-w-2xl" />
      <Skeleton className="mx-auto mt-3 h-5 w-2/3 max-w-xl" />
    </div>

    <div className="mb-10 rounded-2xl border border-kc-blue/10 bg-white/95 p-4 shadow-sm ring-1 ring-kc-blue/5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-72 max-w-full" />
            <Skeleton className="h-4 w-full max-w-xl" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>
    </div>

    <div className="mb-12 space-y-6">
      <div className="flex flex-wrap justify-center gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <Skeleton className="mx-auto h-12 w-full max-w-md rounded-full" />
    </div>

    <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-kc-blue/10 bg-white/95 shadow-sm ring-1 ring-kc-blue/5"
        >
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-4 p-6">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </PageSkeletonFrame>
);

const AboutPageSkeleton: React.FC = () => (
  <PageSkeletonFrame>
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <div className="space-y-5">
        <Skeleton className="h-1 w-24 rounded-full" />
        <Skeleton className="h-12 w-80 max-w-full" />
        <Skeleton className="h-5 w-full max-w-xl" />
        <Skeleton className="h-5 w-5/6 max-w-lg" />
        <div className="grid grid-cols-3 gap-4 pt-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
      <Skeleton className="h-72 w-full rounded-3xl md:h-96" />
    </div>

    <div className="mt-16 grid gap-6 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-kc-blue/10 bg-white/95 p-6 shadow-sm">
          <Skeleton className="mb-5 h-10 w-10 rounded-full" />
          <Skeleton className="mb-4 h-6 w-36" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>

    <div className="mt-16 grid gap-8 lg:grid-cols-2">
      <Skeleton className="h-64 w-full rounded-3xl" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </div>
  </PageSkeletonFrame>
);

const ScrollToTop = () => {
  const location = useLocation();
  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
};

const RouteFallback: React.FC = () => {
  const location = useLocation();

  if (location.pathname === "/projects") return <ProjectsPageSkeleton />;
  if (location.pathname === "/about") return <AboutPageSkeleton />;

  return <EngagingLoader />;
};

const AppShell: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <GspAuthProvider>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="projects" element={<ProjectsPage />} />
                  <Route path="projects/:slug" element={<ProjectDetailPage />} />
                  <Route path="events" element={<EventsPage />} />
                  <Route path="blog" element={<BlogPage />} />
                  <Route path="blog/:slug" element={<BlogDetailPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="donate" element={<DonatePage />} />
                  <Route path="stem" element={<StemRegistrationPage />} />
                  <Route path="stem/register" element={<StemRegistrationApplyPage />} />
                  <Route path="stem/success" element={<StemRegistrationSuccessPage />} />
                  <Route path="stem/manage" element={<StemRegistrationManagePage />} />
                  <Route path="gsp" element={<Navigate to="/gsp/dashboard" replace />} />
                  <Route path="auth" element={<AuthPage />} />
                  <Route path="auth/callback" element={<AuthCallbackPage />} />
                  <Route path="gsp/dashboard" element={<GspDashboardPage />} />
                  <Route path="gsp/decision" element={<GspDecisionPage />} />
                  <Route path="gsp/admin" element={<GspAdminPage />} />
                  <Route path="gsp/admin/applications/:id" element={<GspAdminApplicationPage />} />
                  <Route path="privacy" element={<PrivacyPage />} />
                  <Route path="terms" element={<TermsPage />} />
                </Route>
                {/* GSP Application — no navbar/footer, full-screen portal */}
                <Route path="gsp/application" element={<GspApplicationPage />} />
                {/* User general dashboard — no navbar/footer */}
                <Route path="dashboard" element={<UserDashboardPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </GspAuthProvider>
  </QueryClientProvider>
);

const App: React.FC = () => {
  const [isBootReady, setIsBootReady] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    const waitForWindowLoad = new Promise<void>((resolve) => {
      if (document.readyState === "complete") {
        resolve();
        return;
      }
      window.addEventListener("load", () => resolve(), { once: true });
    });

    const waitForMinimumDelay = new Promise<void>((resolve) => {
      window.setTimeout(() => resolve(), MIN_BOOT_LOADER_MS);
    });

    Promise.all([waitForWindowLoad, waitForMinimumDelay]).then(() => {
      if (mounted) {
        setIsBootReady(true);
        optimisticPreloadAuthFlow();
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!isBootReady) return <EngagingLoader />;
  return <AppShell />;
};

export default App;
