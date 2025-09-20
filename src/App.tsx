import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
const Layout = React.lazy(() => import("./components/Layout"));
const Home = React.lazy(() => import("./pages/Home"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const ProjectsPage = React.lazy(() => import("./pages/ProjectsPage"));
const ProjectDetailPage = React.lazy(() => import("./pages/ProjectDetailPage"));
const BlogPage = React.lazy(() => import("./pages/BlogPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const DonatePage = React.lazy(() => import("./pages/DonatePage"));
const StemRegistrationPage = React.lazy(() => import("./pages/StemRegistrationPage"));
const StemRegistrationApplyPage = React.lazy(() => import("./pages/StemRegistrationApplyPage"));
const PrivacyPage = React.lazy(() => import("./pages/PrivacyPage"));
const TermsPage = React.lazy(() => import("./pages/TermsPage"));
const EventsPage = React.lazy(() => import("./pages/EventsPage"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const location = useLocation();
  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<div className="container mx-auto px-4 lg:px-8 py-12 text-center text-muted-foreground">Loading…</div>}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/:slug" element={<ProjectDetailPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="blog" element={<BlogPage />} />
              
              <Route path="contact" element={<ContactPage />} />
              <Route path="donate" element={<DonatePage />} />
              <Route path="stem-registration" element={<StemRegistrationPage />} />
              <Route path="stem-registration/apply" element={<StemRegistrationApplyPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="terms" element={<TermsPage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
