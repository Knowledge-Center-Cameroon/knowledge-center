import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    { label: "Meet the Team", to: "/team" },
    { label: "Contact Us", to: "/contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-smooth",
        "bg-white/95 backdrop-blur-md shadow-elegant border-b border-border"
      )}
    >
      <nav className="container mx-auto px-3 sm:px-4 lg:px-8">
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
              <span className="hidden sm:block text-[11px] text-muted-foreground -mt-0.5">Cameroon</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobile}
                className={({ isActive }) =>
                  cn(
                    "relative text-foreground transition-smooth font-medium",
                    "after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all",
                    "hover:after:w-full",
                    isActive ? "text-primary after:w-full" : "hover:text-primary"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button asChild variant="blackOutline">
              <Link to="/donate">Donate</Link>
            </Button>
            <Button asChild variant="blue">
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