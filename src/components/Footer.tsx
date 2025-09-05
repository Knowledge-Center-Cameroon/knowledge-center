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
  ExternalLink,
  Send
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

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
      {/* Newsletter Section */}
      <div className="bg-black py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center text-white">
          <h3 className="text-3xl font-playfair font-bold mb-4">
            Stay Updated with KC
          </h3>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about our STEM programs, 
            competitions, and educational opportunities.
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-3">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70"
              required
            />
            <Button 
              type="submit" 
              variant="secondary"
              className="bg-white text-black hover:bg-white/90"
            >
              <Send className="h-4 w-4 mr-2" />
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="/logo_trans.png"
                  alt="Knowledge Center Logo"
                  className="h-10 w-10 md:h-12 md:w-12 object-contain"
                />
                <div className="text-lg md:text-xl font-heading font-bold leading-tight">
                  <span className="text-kc-blue">Knowledge</span>
                  <span className="text-kc-red ml-1">Center</span>
                  <span className="block text-[12px] text-muted-foreground font-normal -mt-0.5">Cameroon</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Empowering young Cameroonians through STEM education, tutoring, 
                and inspiring scientific curiosity, creativity, and love since 2019.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/kccameroon/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-full flex items-center justify-center transition-smooth"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://x.com/kccameroon" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-full flex items-center justify-center transition-smooth"
                  aria-label="Twitter/X"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.youtube.com/@KnowledgeCenterCameroon-bz8dt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-accent/10 hover:bg-accent text-accent hover:text-white rounded-full flex items-center justify-center transition-smooth"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
                <a 
                  href="https://linktr.ee/knowledge_center_cameroon" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-full flex items-center justify-center transition-smooth"
                  aria-label="Linktree"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-playfair font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { label: "Home", to: "/" },
                  { label: "About Us", to: "/about" },
                  { label: "Our Projects", to: "/projects" },
                  { label: "Blog", to: "/blog" },
                  { label: "Meet Our Team", to: "/team" },
                  { label: "Contact Us", to: "/contact" },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-muted-foreground hover:text-primary transition-smooth"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Programs */}
            <div>
              <h4 className="text-lg font-playfair font-semibold mb-6">Our Programs</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/stem-registration"
                    className="text-muted-foreground hover:text-primary transition-smooth"
                  >
                    STEM Education Program
                  </Link>
                </li>
                <li>
                  <Link
                    to="/projects"
                    className="text-muted-foreground hover:text-primary transition-smooth"
                  >
                    Summer Education Program
                  </Link>
                </li>
                <li>
                  <Link
                    to="/projects"
                    className="text-muted-foreground hover:text-primary transition-smooth"
                  >
                    Weekend School
                  </Link>
                </li>
                <li>
                  <Link
                    to="/projects"
                    className="text-muted-foreground hover:text-primary transition-smooth"
                  >
                    STEM Competition
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-playfair font-semibold mb-6">Contact Information</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Buea, Southwest Region<br />
                    Cameroon
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  <a 
                    href="mailto:info@kccameroon.com" 
                    className="text-muted-foreground hover:text-primary transition-smooth"
                  >
                    info@kccameroon.com
                  </a>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <a 
                    href="tel:+237123456789" 
                    className="text-muted-foreground hover:text-primary transition-smooth"
                  >
                    +237 123 456 789
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black text-white border-t border-border py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/80 text-center md:text-left">
              &copy; {new Date().getFullYear()} Knowledge Center Cameroon. All rights reserved.
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