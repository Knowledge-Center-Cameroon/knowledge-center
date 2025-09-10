import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Youtube,
  Linkedin,

  Send
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link, NavLink } from "react-router-dom";
import StemBackground from "@/components/StemBackground";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Thank you for subscribing!",
        description: "You'll receive updates about our STEM programs and activities.",
      });
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-border">
      {/* Main Footer Content */}
      <div className="pt-8 pb-16 bg-kc-black relative overflow-visible">
        {/* Wave flush with footer top */}
        <svg className="absolute top-0 left-0 w-full h-10 text-background -translate-y-full z-20" viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,64 C240,32 480,0 720,0 C960,0 1200,32 1440,64 L1440,80 L0,80 Z" fill="currentColor" />
        </svg>
        <StemBackground opacity={0.18} density={50} lineDistance={120} speed={0.45} showIcons={true} />
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="/logo.png"
                  alt="Knowledge Center Logo"
                  className="h-10 w-10 md:h-12 md:w-12 object-contain"
                />
                <div className="text-lg md:text-xl font-heading font-bold leading-tight">
                  <span className="text-kc-blue">Knowledge</span>
                  <span className="text-kc-red ml-1">Center</span>
                  
                </div>
              </div>
              <p className="text-white mb-6 leading-relaxed">
                Building a strong nexus for future-ready STEM Leaders through STEM education, tutoring, 
                and inspiring scientific curiosity, creativity, and love.
              </p>

              {/* Compact Newsletter */}
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <h5 className="text-white font-semibold mb-2 text-sm">Subscribe</h5>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-9 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    required
                  />
                  <Button 
                    type="submit" 
                    variant="secondary"
                    className="h-9 px-3 bg-white text-black hover:bg-white/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4 mt-4">
                <a 
                  href="https://web.facebook.com/share/g/1YeC5UgLSP/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-smooth border border-white/10"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://x.com/KCCameroon" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-smooth border border-white/10"
                  aria-label="X"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="https://youtube.com/@knowledgecentercameroon-bz8dt?si=LVdBwRFkRBY2M79c" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-smooth border border-white/10"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.linkedin.com/company/knowledge-centercmr/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-smooth border border-white/10"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg text-white font-playfair font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3 text-white/90">
                {[
                  { label: "Home", to: "/" },
                  { label: "About Us", to: "/about" },
                  { label: "Our Projects", to: "/projects" },
                  { label: "Blog", to: "/blog" },
                  { label: "Contact Us", to: "/contact" },
                ].map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `transition-smooth ${isActive ? 'text-white underline underline-offset-4' : 'hover:text-white'}`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Programs */}
            <div>
              <h4 className="text-lg text-white font-playfair font-semibold mb-6">Our Programs</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/projects/stem-education"
                    className="text-white hover:text-primary transition-smooth"
                  >
                    National STEM Competition
                  </Link>
                </li>
                <li>
                  <Link
                    to="/projects/summer-education"
                    className="text-white hover:text-primary transition-smooth"
                  >
                    Summer Education Program
                  </Link>
                </li>
                <li>
                  <Link
                    to="/projects/weekend-shool"
                    className="text-white hover:text-primary transition-smooth"
                  >
                    Weekend School
                  </Link>
                </li>
                <li>
                  <Link
                    to="/projects"
                    className="text-white hover:text-primary transition-smooth"
                  >
                    Global Scholars Program
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg text-white font-playfair font-semibold mb-6">Contact Information</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-white">
                    Buea, Southwest Region<br />
                    Cameroon
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  <a 
                    href="mailto:kcstemhub@gmail.com" 
                    className="text-white hover:text-primary transition-smooth"
                  >
                    kcstemhub@gmail.com
                  </a>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <a 
                    href="tel:+237680789894" 
                    target="_blank"
                    className="text-white hover:text-primary transition-smooth"
                  >
                    +237 680 789 894
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative bg-black text-white border-t border-border py-8">
        {/* Wave separator between main footer and bottom bar */}
        <svg className="absolute -top-10 left-0 w-full h-10 text-kc-black" viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,64 C240,32 480,0 720,0 C960,0 1200,32 1440,64 L1440,80 L0,80 Z" fill="currentColor" />
        </svg>
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/80 text-center md:text-left">
              &copy; {new Date().getFullYear()} Knowledge Center. All rights reserved.
            </p>
            
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-white/80 hover:text-white transition-smooth">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-white/80 hover:text-white transition-smooth">
                Terms of Service
              </Link>
              <Link to="/donate" className="text-white hover:text-accent transition-smooth">
                Donate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;