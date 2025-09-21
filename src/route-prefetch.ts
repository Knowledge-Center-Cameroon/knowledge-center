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
  "/stem-registration": () => import("./pages/StemRegistrationPage"),
  "/stem-registration/apply": () => import("./pages/StemRegistrationApplyPage"),
  "/stem-registration/success": () => import("./pages/StemRegistrationSuccessPage"),
  "/privacy": () => import("./pages/PrivacyPage"),
  "/terms": () => import("./pages/TermsPage"),
};

export function prefetchRoute(path: string) {
  // Preload top-level path for nested routes like /projects/:slug
  const base = path.split("/").slice(0, 2).join("/") || "/";
  const fn = routePrefetchers[path] || routePrefetchers[base];
  if (fn) {
    try { fn(); } catch {}
  }
}
