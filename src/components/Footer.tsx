import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Youtube,
  Linkedin,
  Send,
  ExternalLink
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link, NavLink } from "react-router-dom";
import { subscribeEmail } from "@/services/api";
import StemBackground from "@/components/StemBackground";
import { motion } from "framer-motion";

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
        title: "Success!",
        description: "Welcome to the KC STEM community.",
      });
      setEmail("");
    } catch (err) {
      toast({ variant: "destructive", title: "Subscription failed", description: "Please try again.", });
    } finally {
      setSubmitting(false);
    }
  };

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/company/knowledge-centercmr/", label: "LinkedIn" },
    { icon: Youtube, href: "https://youtube.com/@knowledgecentercameroon-bz8dt?si=LVdBwRFkRBY2M79c", label: "YouTube" },
    { icon: Twitter, href: "https://x.com/KCCameroon", label: "X" },
    { icon: Facebook, href: "https://web.facebook.com/share/g/1YeC5UgLSP/", label: "Facebook" },
  ];

  return (
    <footer className="relative mt-20 bg-[#0A0C10] border-t border-white/5">
      {/* Decorative Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-kc-blue/50 to-transparent" />

      <div className="relative overflow-hidden pt-20 pb-12">
        <StemBackground opacity={0.08} density={30} lineDistance={150} speed={0.3} showIcons={false} />
        
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* 1. Brand & Newsletter - Taking up 6 cols for a larger presence */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <Link to="/" className="flex items-center gap-3 mb-6 group">
                  <img
                    src="/logo.png"
                    alt="KC Logo"
                    className="h-12 w-12 object-contain transition-transform group-hover:scale-105"
                  />
                  <div className="text-2xl font-bold tracking-tight text-white">
                    Knowledge<span className="text-kc-blue"> Center</span>
                  </div>
                </Link>
                <p className="text-slate-400 text-lg leading-relaxed max-w-md mb-8">
                  Empowering Cameroon's next generation of scientists and engineers through world-class STEM education.
                </p>
              </div>

              <div className="relative max-w-xl">
                <h5 className="text-white font-semibold mb-6 text-xl">Stay updated with our newsletter</h5>
                <form onSubmit={handleNewsletterSubmit} className="relative group">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-16 bg-white/5 border-white/10 rounded-2xl pl-6 pr-40 text-lg text-white placeholder:text-slate-500 focus:ring-kc-blue/50 transition-all"
                    required
                  />
                  <Button 
                    disabled={submitting}
                    className="absolute right-2 top-2 h-12 px-8 rounded-xl bg-kc-blue hover:bg-kc-blue/90 text-white text-lg font-bold transition-all shadow-lg"
                  >
                    {submitting ? "..." : <><span className="hidden sm:inline mr-2">Subscribe</span> <Send className="h-5 w-5" /></>}
                  </Button>
                </form>
                <p className="mt-4 text-xs text-slate-500 uppercase tracking-[0.2em] font-medium">No spam. Only world-class STEM excellence.</p>
              </div>
            </div>

            {/* 2. Quick Links - 2 cols */}
            <div className="lg:col-span-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-8">Platform</h4>
              <ul className="space-y-4">
                {["Home", "About Us", "Our Projects", "Blog", "Contact Us"].map((item) => (
                  <li key={item}>
                    <NavLink
                      to={`/${item.toLowerCase().replace(" ", "")}`}
                      className={({ isActive }) => 
                        `text-base transition-colors duration-300 ${isActive ? 'text-kc-blue' : 'text-slate-400 hover:text-white'}`
                      }
                    >
                      {item}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Programs - 2 cols */}
            <div className="lg:col-span-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-8">Programs</h4>
              <ul className="space-y-4">
                {[
                  { name: "STEM Competition", to: "/projects/stem" },
                  { name: "Summer School", to: "/projects/summer-education" },
                  { name: "Weekend School", to: "/projects/weekend-school" },
                  { name: "Global Scholars", to: "/projects" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link to={item.to} className="text-base text-slate-400 hover:text-white transition-colors flex items-center group">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Contact Info - 2 cols */}
            <div className="lg:col-span-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-8">Get In Touch</h4>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/5 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-kc-blue" />
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed">
                    Molyko, Buea<br />Southwest Region, Cameroon
                  </span>
                </div>
                
                <a href="mailto:kcstemhub@gmail.com" className="flex items-center gap-4 group">
                  <div className="bg-white/5 p-2 rounded-lg group-hover:bg-kc-blue/10 transition-colors">
                    <Mail className="h-5 w-5 text-kc-blue" />
                  </div>
                  <span className="text-slate-300 text-sm group-hover:text-white transition-colors">kcstemhub@gmail.com</span>
                </a>
                
                <a href="tel:+237680789894" className="flex items-center gap-4 group">
                  <div className="bg-white/5 p-2 rounded-lg group-hover:bg-kc-blue/10 transition-colors">
                    <Phone className="h-5 w-5 text-kc-blue" />
                  </div>
                  <span className="text-slate-300 text-sm group-hover:text-white transition-colors">+237 680 789 894</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-[#080A0E] py-8">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-8">
              <p className="text-sm text-slate-500">
                &copy; {new Date().getFullYear()} Knowledge Center.
              </p>
              <div className="hidden md:flex gap-6">
                <Link to="/privacy" className="text-xs text-slate-600 hover:text-slate-400 uppercase tracking-widest font-bold">Privacy</Link>
                <Link to="/terms" className="text-xs text-slate-600 hover:text-slate-400 uppercase tracking-widest font-bold">Terms</Link>
              </div>
            </div>

            {/* Modern Social Icons */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a 
                  key={social.label}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-11 h-11 bg-white/5 hover:bg-kc-blue text-slate-400 hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300 border border-white/5 shadow-xl"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;