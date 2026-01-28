import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { prefetchRoute } from "@/route-prefetch";

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

  const navItems = [
    { label: "Home", to: "/" },
    { label: "About Us", to: "/about" },
    { label: "Projects", to: "/projects" },
    { label: "Events", to: "/events" },
    { label: "Blog", to: "/blog" },
    { label: "Contact Us", to: "/contact" },
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
        "bg-white/95 backdrop-blur-md border-b border-border",
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
                <span className="text-kc-blue">Knowledge</span>
                <span className="text-kc-red ml-1">Center</span>
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
                className="absolute top-0 bottom-0 my-auto h-10 rounded-full bg-kc-black shadow-lg"
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
            <Button
              asChild
              variant="blue"
              size="sm"
              className="font-semibold"
            >
              <Link
                to="/stem"
                onMouseEnter={handlePrefetch("/stem")}
                onFocus={handlePrefetch("/stem")}
              >
                STEM Reg.
              </Link>
            </Button>
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
              className="bg-white/95 backdrop-blur-md border border-border shadow-elevated rounded-2xl overflow-hidden"
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
                          ? "bg-kc-black text-white"
                          : "text-foreground hover:bg-muted"
                      )
                    }
                    aria-current={location.pathname === item.to ? "page" : undefined}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
              <div className="px-4 py-4 border-t border-border/70 grid grid-cols-2 gap-3">
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
                <Button
                  asChild
                  variant="blue"
                  className="w-full font-semibold"
                  onClick={closeMobile}
                >
                  <Link
                    to="/stem"
                    onMouseEnter={handlePrefetch("/stem")}
                    onFocus={handlePrefetch("/stem")}
                  >
                    STEM
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