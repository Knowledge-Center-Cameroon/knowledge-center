// Simple route prefetch helpers to warm up lazy route chunks
// Import paths match the React.lazy definitions in App.tsx

export const routePrefetchers: Record<string, () => Promise<unknown>> = {
  "/": () => import("./pages/Home"),
  "/about": () => import("./pages/AboutPage"),
  "/projects": () => import("./pages/ProjectsPage"),
  "/events": () => import("./pages/EventsPage"),
  "/blog": () => import("./pages/BlogPage"),
  "/contact": () => import("./pages/ContactPage"),
  "/donate": () => import("./pages/DonatePage"),
  "/auth": () => import("./pages/AuthPage"),
  "/dashboard": () => import("./pages/UserDashboardPage"),
  "/gsp": () => import("./pages/GspDashboardPage"),
  "/gsp/dashboard": () => import("./pages/GspDashboardPage"),
  "/gsp/application": () => import("./pages/GspApplicationPage"),
  "/gsp/decision": () => import("./pages/GspDecisionPage"),
  "/stem": () => import("./pages/StemRegistrationPage"),
  "/stem/register": () => import("./pages/StemRegistrationApplyPage"),
  "/stem/success": () => import("./pages/StemRegistrationSuccessPage"),
  "/privacy": () => import("./pages/PrivacyPage"),
  "/terms": () => import("./pages/TermsPage"),
};

export function prefetchRoute(path: string) {
  const cleanPath = path.split("?")[0].split("#")[0] || "/";
  // Preload top-level path for nested routes like /projects/:slug
  const base = cleanPath.split("/").slice(0, 2).join("/") || "/";
  const fn = routePrefetchers[cleanPath] || routePrefetchers[base];
  if (fn) {
    try { fn(); } catch {}
  }
}

export function optimisticPreloadAuthFlow() {
  if (typeof window === "undefined") return;

  const warm = () => {
    prefetchRoute("/auth");
    prefetchRoute("/dashboard");
    prefetchRoute("/gsp/dashboard");
    prefetchRoute("/gsp/application");
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(warm, { timeout: 1500 });
    return;
  }

  window.setTimeout(warm, 450);
}
