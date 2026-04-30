import React, { Suspense } from "react";
import EngagingLoader from "@/components/EngagingLoader";
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
const GspAuthPage = React.lazy(() => import("./pages/GspAuthPage"));
const GspDashboardPage = React.lazy(() => import("./pages/GspDashboardPage"));
const AuthCallbackPage = React.lazy(() => import("./pages/AuthCallbackPage"));
const GspApplicationPage = React.lazy(() => import("./pages/GspApplicationPage"));
const GspDecisionPage = React.lazy(() => import("./pages/GspDecisionPage"));
const GspAdminPage = React.lazy(() => import("./pages/GspAdminPage"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();
const MIN_BOOT_LOADER_MS = 1400;

const ScrollToTop = () => {
  const location = useLocation();
  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
};

const AppShell: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <GspAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<EngagingLoader />}>
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
                  <Route path="gsp/auth" element={<GspAuthPage />} />
                  <Route path="gsp/auth/callback" element={<AuthCallbackPage />} />
                  <Route path="gsp/dashboard" element={<GspDashboardPage />} />
                  <Route path="gsp/application" element={<GspApplicationPage />} />
                  <Route path="gsp/decision" element={<GspDecisionPage />} />
                  <Route path="gsp/admin" element={<GspAdminPage />} />
                  <Route path="privacy" element={<PrivacyPage />} />
                  <Route path="terms" element={<TermsPage />} />
                </Route>
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </GspAuthProvider>
    </UserProvider>
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
      if (mounted) setIsBootReady(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!isBootReady) return <EngagingLoader />;
  return <AppShell />;
};

export default App;
