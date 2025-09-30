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
  Bell,
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
    <footer className="border-t border-border">
      {/* Main Footer Content */}
      <div className="pt-8 pb-16 bg-kc-black relative overflow-visible">
    
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
                  <AeroButton
                    type="submit"
                    disabled={submitting}
                    loading={submitting}
                    text=""
                    width={150}
                    primaryCol="hsl(180, 1.30%, 84.50%)"
                    gradientCol="#ffffff"
                    className="h-9 text-black"
                    icon={<Bell className="h-4 w-4 text-black" />}
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
      <div className="relative bg-black text-white border-t border-border py-6">
        {/* Wave separator between main footer and bottom bar */}
        <svg className="absolute -top-10 left-0 w-full h-10 text-kc-black" viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,64 C240,32 480,0 720,0 C960,0 1200,32 1440,64 L1440,80 L0,80 Z" fill="currentColor" />
        </svg>
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/80 text-center md:text-left">
              &copy; {new Date().getFullYear()} Knowledge Center. All rights reserved.
            </p>
            {/* Social links moved here for a compact footer */}
            <div className="flex space-x-4">
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