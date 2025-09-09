import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

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
        "bg-white/95 backdrop-blur-md shadow-elegant border-b border-border"
      )}
    >
      <nav className="container mx-auto px-3 sm:px-4 lg:px-8 font-heading">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" onClick={(e) => handleNavClick(e, "/")}>
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

          {/* Desktop Navigation */}
          <div className="hidden lg:block relative">
            {/* Sliding pill container: dynamic equal columns */}
            <div
              className="relative grid items-center"
              style={{ gridTemplateColumns: `repeat(${navCount}, minmax(0, 1fr))` }}
            >
              {/* Sliding pill */}
              <motion.span
                layout
                initial={{ left: 0 }}
                animate={{ left: `calc((100% / ${navCount}) * ${activeIndex})` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute top-0 bottom-0 my-auto h-10 rounded-full bg-neutral-900 shadow-lg"
                style={{ width: `calc(100%/${navCount})` }}
              />
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={(e) => handleNavClick(e, item.to)}
                  end={item.to === "/" ? true : undefined}
                  className={({ isActive }) =>
                    cn(
                      "relative z-10 transition-smooth font-semibold",
                      "px-3 py-2 text-sm text-center",
                      isActive
                        ? "text-white drop-shadow-sm"
                        : "text-foreground hover:text-foreground"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button asChild variant="blackOutline" size="sm">
              <Link to="/donate">Donate</Link>
            </Button>
            <Button asChild variant="blue" size="sm">
              <Link to="/stem-registration">STEM Registration</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-border shadow-lg animate-slide-up">
            <div className="container mx-auto px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={(e) => handleNavClick(e, item.to)}
                  end={item.to === "/" ? true : undefined}
                  className={({ isActive }) =>
                    cn(
                      "block w-full text-left py-2 transition-smooth font-medium",
                      "relative rounded-lg px-3",
                      isActive ? "bg-neutral-900 text-white" : "text-foreground hover:bg-black/5"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t border-border">
                <Button asChild variant="blackOutline" className="w-full" onClick={closeMobile}>
                  <Link to="/donate">Donate</Link>
                </Button>
                <Button asChild variant="blue" className="w-full" onClick={closeMobile}>
                  <Link to="/stem-registration">STEM Registration</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navigation;