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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gradient-subtle border-t border-border">
      {/* Newsletter Section */}
      <div className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h3 className="text-3xl font-playfair font-bold text-white mb-4">
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
              className="bg-white text-primary hover:bg-white/90"
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
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div className="text-xl font-playfair font-bold">
                  <span className="text-primary">KC</span>
                  <span className="text-accent ml-1">Knowledge Center</span>
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
                  { label: "Home", id: "home" },
                  { label: "About Us", id: "about" },
                  { label: "Our Projects", id: "projects" },
                  { label: "Blog", id: "blog" },
                  { label: "Meet Our Team", id: "team" },
                  { label: "Contact Us", id: "contact" },
                ].map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="text-muted-foreground hover:text-primary transition-smooth"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Programs */}
            <div>
              <h4 className="text-lg font-playfair font-semibold mb-6">Our Programs</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => scrollToSection("stem-registration")}
                    className="text-muted-foreground hover:text-primary transition-smooth"
                  >
                    STEM Education Program
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("projects")}
                    className="text-muted-foreground hover:text-primary transition-smooth"
                  >
                    Summer Education Program
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("projects")}
                    className="text-muted-foreground hover:text-primary transition-smooth"
                  >
                    Weekend School
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("projects")}
                    className="text-muted-foreground hover:text-primary transition-smooth"
                  >
                    STEM Competition
                  </button>
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
      <div className="border-t border-border py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Knowledge Center Cameroon. All rights reserved.
            </p>
            
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-muted-foreground hover:text-primary transition-smooth">
                Privacy Policy
              </a>
              <a href="/terms" className="text-muted-foreground hover:text-primary transition-smooth">
                Terms of Service
              </a>
              <button
                onClick={() => scrollToSection("donations")}
                className="text-muted-foreground hover:text-accent transition-smooth"
              >
                Donate
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;