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

  const navItems = [
    { label: "Home", to: "/" },
    { label: "About Us", to: "/about" },
    { label: "Projects", to: "/projects" },
    { label: "Blog", to: "/blog" },
    { label: "Contact Us", to: "/contact" },
  ];

  // Determine active index for sliding pill: match by startsWith
  const activeIndex = Math.max(
    0,
    navItems.findIndex((item) =>
      item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to)
    )
  );

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
          <Link to="/" className="flex items-center gap-3" onClick={closeMobile}>
            <img
              src="/logo_trans.png"
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
            {/* Sliding pill container: 5 equal columns */}
            <div className="grid grid-cols-5 items-center">
              {/* Sliding pill */}
              <motion.span
                layout
                initial={false}
                animate={{ x: `${activeIndex * 100}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute inset-y-0 my-auto h-9 rounded-full bg-black/80"
                style={{ width: "calc(100%/5)" }}
              />
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    cn(
                      "relative z-10 text-foreground transition-smooth font-semibold",
                      "px-3 py-2 text-sm text-center",
                      isActive ? "text-white" : "hover:text-primary"
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
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    cn(
                      "block w-full text-left py-2 transition-smooth font-medium",
                      "relative rounded-lg px-3",
                      isActive ? "bg-black text-white" : "text-foreground hover:bg-black/5"
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