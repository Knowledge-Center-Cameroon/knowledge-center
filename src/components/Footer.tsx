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
  Send,
  ArrowRight
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link, NavLink } from "react-router-dom";
import { subscribeEmail } from "@/services/api";
import StemBackground from "@/components/StemBackground";
import { AeroButton } from "@/components/aerobutton";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await subscribeEmail(email);
      toast({
        title: "Thank you for subscribing!",
        description: "You'll receive updates about our STEM programs and activities.",
      });
      setEmail("");
    } catch (err) {
      toast({ title: "Subscription failed", description: "Please try again.", });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-border relative mt-12 md:mt-16">
      {/* Enhanced wave separator at the very top */}
      <svg className="absolute -top-12 left-0 w-full h-12 overflow-visible" viewBox="0 0 1440 96" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--kc-blue))" stopOpacity="0.3" />
            <stop offset="50%" stopColor="hsl(var(--kc-red))" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(var(--kc-blue))" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M0,48 C144,24 288,0 432,12 C576,24 720,48 864,36 C1008,24 1152,0 1296,12 C1440,24 1584,48 1728,36 C1872,24 2016,0 2160,12 L2160,96 L0,96 Z"
          fill="url(#waveGradient)"
        />
        <path
          d="M0,64 C240,40 480,24 720,24 C960,24 1200,40 1440,64 L1440,96 L0,96 Z"
          fill="hsl(var(--kc-black))"
        />
      </svg>

      {/* Main Footer Content */}
      <div className="pt-8 pb-16 bg-kc-black relative overflow-visible">
    
        <StemBackground opacity={0.16} density={46} lineDistance={130} speed={0.45} showIcons={true} />
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
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
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 mt-4 sm:mt-6 max-w-md">
                <h5 className="text-white font-semibold mb-2 text-sm">Subscribe</h5>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-9 bg-white/10 border-white/20 text-white placeholder:text-white/60 text-sm"
                    required
                  />
                  <AeroButton
                    type="submit"
                    disabled={submitting}
                    loading={submitting}
                    text=""
                    width={150}
                    primaryCol="#ffffff"
                    gradientCol="hsl(240, 0.60%, 31.20%)"
                    className="h-9 w-full sm:w-auto text-black"
                    icon={<Send className="h-4 w-4 text-black" />}
                    iconAlways
                  />
                </form>
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
                        `group inline-flex items-center gap-2 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded ${isActive ? 'text-kc-red' : 'text-white/90 hover:text-primary'}`
                      }
                    >
                      <span className="relative">{link.label}</span>
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
                    to="/projects/stem"
                    className="group inline-flex items-center gap-2 text-white/90 hover:text-primary transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
                  >
                    <span className="relative">National STEM Competition</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/projects/summer-education"
                    className="group inline-flex items-center gap-2 text-white/90 hover:text-primary transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
                  >
                    <span className="relative">Summer Education Program</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/projects/weekend-school"
                    className="group inline-flex items-center gap-2 text-white/90 hover:text-primary transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
                  >
                    <span className="relative">Weekend School</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/projects"
                    className="group inline-flex items-center gap-2 text-white/90 hover:text-primary transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
                  >
                    <span className="relative">Global Scholars Program</span>
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
      <div className="relative bg-black text-white border-t border-border py-5">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-white/80 text-center md:text-left">
              &copy; {new Date().getFullYear()} Knowledge Center. All rights reserved.
            </p>
            {/* Social links */}
            <div className="flex space-x-3 sm:space-x-4 justify-center md:justify-end">
              <a 
                href="https://www.linkedin.com/company/knowledge-centercmr/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-smooth border border-white/10"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
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
                href="https://x.com/KCCameroon" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-smooth border border-white/10"
                aria-label="X"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://web.facebook.com/share/g/1YeC5UgLSP/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-smooth border border-white/10"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;