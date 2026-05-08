import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { prefetchRoute } from "@/route-prefetch";
import { useGspAuth } from "@/contexts/GspAuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { googleLogout } from "@react-oauth/google";

/**
 * Navigation Component - Primary site navigation
 * 
 * Features:
 * - Sticky header with scroll-aware shadow
 * - Desktop: Animated sliding pill indicator
 * - Mobile: Collapsible menu with smooth animations
 * - Semantic HTML with ARIA labels for accessibility
 * - Route prefetching on hover/focus
 * - Consistent styling using design tokens
 */
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, loading, signOut } = useGspAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobile = () => setIsMobileMenuOpen(false);

  const handleNavClick = (e: React.MouseEvent, to: string) => {
    if (to === "/") {
      // Always scroll to top when clicking Home
      if (location.pathname === "/") {
        e.preventDefault();
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    closeMobile();
  };

  const handlePrefetch = (to: string) => () => prefetchRoute(to);
  const displayName = user?.name?.trim() || user?.email?.split("@")[0] || "User";
  const userInitial = displayName.charAt(0).toUpperCase();
  const authRedirect = `/auth?redirect=${encodeURIComponent(
    `${location.pathname}${location.search}`,
  )}`;

  const handleLogout = () => {
    googleLogout();
    signOut();
    closeMobile();
  };

  const authControls = (
    <>
      {user ? (
        <div className="flex items-center bg-white border border-border rounded-full shadow-sm overflow-hidden h-9">
          <Link
            to="/gsp/dashboard"
            className="flex items-center justify-center h-full pl-1 pr-2 hover:bg-muted transition-colors"
            aria-label="Open dashboard"
          >
            <Avatar className="h-7 w-7 border border-kc-blue/20">
              <AvatarFallback className="bg-kc-blue text-white font-semibold text-xs">
                {userInitial}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="h-4 w-px bg-border"></div>
          <button
            type="button"
            className="px-3 h-full text-sm font-semibold text-foreground hover:text-kc-blue transition-colors hover:bg-muted"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <Button
          asChild
          variant="outline"
          size="sm"
          className="font-semibold bg-white text-gray-700 border-gray-300 hover:bg-gray-50 shadow-sm flex items-center gap-2 h-9 px-3"
          disabled={loading}
        >
          <Link
            to={authRedirect}
            onMouseEnter={handlePrefetch("/auth")}
            onFocus={handlePrefetch("/auth")}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in
          </Link>
        </Button>
      )}
    </>
  );

  const navItems = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Projects", to: "/projects" },
    { label: "Events", to: "/events" },
    { label: "Blog", to: "/blog" },
    { label: "Contact", to: "/contact" },
  ];

  // Determine active index for sliding pill: exact for home, prefix for others
  const foundIndex = navItems.findIndex((item) =>
    item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to)
  );
  const activeIndex = foundIndex === -1 ? 0 : foundIndex;
  const navCount = navItems.length;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-smooth",
        "bg-white border-b border-border",
        isScrolled ? "shadow-elegant" : "shadow-sm"
      )}
      role="banner"
    >
      <nav
        className="container mx-auto px-3 sm:px-4 lg:px-8 font-body"
        aria-label="Primary"
      >
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo: Poppins bold heading font */}
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300"
            onClick={(e) => handleNavClick(e, "/")}
            aria-label="Knowledge Center home"
          >
            <img
              src="/logo.png"
              alt="Knowledge Center Logo"
              className="h-10 w-10 lg:h-12 lg:w-12 object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-base sm:text-lg lg:text-xl font-heading font-bold tracking-tight">
                <span className="text-kc-blue">Knowledge Center</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation: Animated sliding pill with Montserrat text */}
          <div className="hidden lg:block relative">
            {/* Sliding pill container: dynamic equal columns */}
            <div
              className="relative grid items-center"
              style={{ gridTemplateColumns: `repeat(${navCount}, minmax(0, 1fr))` }}
            >
              {/* Animated sliding pill background */}
              <motion.span
                layout
                initial={{ left: 0 }}
                animate={{ left: `calc((100% / ${navCount}) * ${activeIndex})` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute top-0 bottom-0 my-auto h-10 rounded-full bg-kc-blue shadow-elegant"
                style={{ width: `calc(100%/${navCount})` }}
              />
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={(e) => handleNavClick(e, item.to)}
                  onMouseEnter={handlePrefetch(item.to)}
                  onFocus={handlePrefetch(item.to)}
                  end={item.to === "/" ? true : undefined}
                  className={({ isActive }) =>
                    cn(
                      "relative z-10 transition-smooth font-semibold font-body",
                      "px-3 py-2 text-sm text-center",
                        isActive
                        ? "text-white drop-shadow-sm"
                        : "text-foreground hover:text-foreground/80"
                    )
                  }
                  aria-current={location.pathname === item.to ? "page" : undefined}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* CTA Buttons: Brand blue and black outline */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              asChild
              variant="blackOutline"
              size="sm"
              className="font-semibold"
            >
              <Link
                to="/donate"
                onMouseEnter={handlePrefetch("/donate")}
                onFocus={handlePrefetch("/donate")}
              >
                Donate
              </Link>
            </Button>
            {authControls}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu: Montserrat text, brand colors */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 px-3 pb-3">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-border shadow-elevated rounded-2xl overflow-hidden"
              id="mobile-nav"
            >
              <div className="px-4 py-3 border-b border-border/70 bg-kc-blue/5">
                <span className="text-sm font-semibold text-foreground font-body">Navigation</span>
              </div>
              <div className="py-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={(e) => handleNavClick(e, item.to)}
                    end={item.to === "/" ? true : undefined}
                    className={({ isActive }) =>
                      cn(
                        "block w-full text-left py-3 transition-smooth font-semibold font-body",
                        "px-5",
                        isActive
                          ? "bg-kc-blue text-white"
                          : "text-foreground hover:bg-muted"
                      )
                    }
                    aria-current={location.pathname === item.to ? "page" : undefined}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
              <div className="px-4 py-4 border-t border-border/70 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3 w-full">
                  {user ? (
                    <div className="flex items-center bg-white border border-border rounded-full shadow-sm overflow-hidden h-10 w-full">
                      <Link
                        to="/gsp/dashboard"
                        className="flex items-center justify-center h-full pl-2 pr-3 hover:bg-muted transition-colors flex-1"
                        aria-label="Open dashboard"
                        onClick={closeMobile}
                      >
                        <Avatar className="h-7 w-7 border border-kc-blue/20 mr-2">
                          <AvatarFallback className="bg-kc-blue text-white font-semibold text-xs">
                            {userInitial}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate text-sm font-semibold text-foreground">
                          {displayName}
                        </span>
                      </Link>
                      <div className="h-5 w-px bg-border"></div>
                      <button
                        type="button"
                        className="px-4 h-full text-sm font-semibold text-foreground hover:text-kc-blue transition-colors hover:bg-muted"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full font-semibold bg-white text-gray-700 border-gray-300 flex items-center justify-center gap-2 h-10"
                      disabled={loading}
                      onClick={closeMobile}
                    >
                      <Link to={authRedirect} className="flex items-center gap-2">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                      </Link>
                    </Button>
                  )}
                </div>
                <Button
                  asChild
                  variant="blackOutline"
                  className="w-full font-semibold"
                  onClick={closeMobile}
                >
                  <Link
                    to="/donate"
                    onMouseEnter={handlePrefetch("/donate")}
                    onFocus={handlePrefetch("/donate")}
                  >
                    Donate
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navigation;
