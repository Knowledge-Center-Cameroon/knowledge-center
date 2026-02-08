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
  Send
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link, NavLink } from "react-router-dom";
import { subscribeEmail } from "@/services/api";
import StemBackground from "@/components/StemBackground";

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
    } catch {
      toast({
        variant: "destructive",
        title: "Subscription failed",
        description: "Please try again.",
      });
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
    <footer className="relative mt-20 bg-white border-t border-border rounded-t-3xl overflow-hidden">

      <div className="relative pt-20 pb-12">
        <StemBackground
          opacity={0.04}
          density={30}
          lineDistance={150}
          speed={0.3}
          showIcons={false}
        />

        <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

            {/* Brand & Newsletter */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <Link to="/" className="flex items-center gap-3 mb-6 group">
                  <img
                    src="/logo.png"
                    alt="KC Logo"
                    className="h-12 w-12 object-contain transition-transform group-hover:scale-105"
                  />
                  <div className="text-2xl font-bold tracking-tight text-kc-blue">
                    Knowledge Center
                  </div>
                </Link>

                <p className="text-kc-black/80 text-base leading-relaxed max-w-sm mb-8">
                  Building a strong nexus of future-ready STEM leaders. For the betterment of humanity.
                </p>
              </div>

              <div className="max-w-sm">
                <h5 className="text-kc-blue font-semibold mb-4 text-base">
                  Stay updated with our newsletter
                </h5>

                <form onSubmit={handleNewsletterSubmit} className="relative">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-white border-border rounded-xl pl-4 pr-28 text-sm text-kc-black placeholder:text-kc-gray/60 focus:ring-kc-blue/50 focus:border-kc-blue/50"
                    required
                  />

                  <Button
                    disabled={submitting}
                    className="absolute right-1 top-1 h-9 px-4 text-sm rounded-lg bg-kc-blue hover:bg-kc-blue/90 text-white font-bold"
                  >
                    {submitting ? "..." : (
                      <>
                        <span className="hidden sm:inline mr-2">Join</span>
                        <Send className="h-3.5 w-3.5" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="mt-2.5 text-xs text-kc-gray uppercase tracking-widest font-medium">
                  No spam.
                </p>
              </div>
            </div>

            {/* Platform Links */}
            <div className="lg:col-span-2 lg:ml-auto">
              <h4 className="text-sm font-bold text-kc-blue uppercase tracking-[0.2em] mb-8">
                Platform
              </h4>
              <ul className="space-y-4">
                {["Home", "About Us", "Our Projects", "Blog", "Contact Us"].map((item) => (
                  <li key={item}>
                    <NavLink
                      to={`/${item.toLowerCase().replace(" ", "")}`}
                      className={({ isActive }) =>
                        isActive
                          ? "text-kc-blue font-semibold"
                          : "text-kc-black/80 hover:text-kc-blue transition-colors"
                      }
                    >
                      {item}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Programs */}
            <div className="lg:col-span-2 lg:ml-auto">
              <h4 className="text-sm font-bold text-kc-blue uppercase tracking-[0.2em] mb-8">
                Programs
              </h4>
              <ul className="space-y-4">
                <li><Link to="/projects/stem" className="text-kc-black/80 hover:text-kc-blue transition-colors">STEM Competition</Link></li>
                <li><Link to="/projects/summer-education" className="text-kc-black/80 hover:text-kc-blue transition-colors">Summer School</Link></li>
                <li><Link to="/projects/weekend-school" className="text-kc-black/80 hover:text-kc-blue transition-colors">Weekend School</Link></li>
                <li><Link to="/projects" className="text-kc-black/80 hover:text-kc-blue transition-colors">Global Scholars</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="lg:col-span-3 lg:ml-auto">
              <h4 className="text-sm font-bold text-kc-blue uppercase tracking-[0.2em] mb-8">
                Get In Touch
              </h4>

              <div className="space-y-6 text-kc-black/80 text-sm">
                <div className="flex gap-4">
                  <div className="bg-kc-blue/10 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-kc-blue" />
                  </div>
                  <span>Molyko, Buea<br />Southwest Region, Cameroon</span>
                </div>

                <a href="mailto:kcstemhub@gmail.com" className="flex gap-4 hover:text-kc-blue">
                  <div className="bg-kc-blue/10 p-2 rounded-lg">
                    <Mail className="h-5 w-5 text-kc-blue" />
                  </div>
                  kcstemhub@gmail.com
                </a>

                <a href="tel:+237680789894" className="flex gap-4 hover:text-kc-blue">
                  <div className="bg-kc-blue/10 p-2 rounded-lg">
                    <Phone className="h-5 w-5 text-kc-blue" />
                  </div>
                  +237 680 789 894
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-white py-8">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-kc-black/70">
            &copy; {new Date().getFullYear()} Knowledge Center.
          </p>

          <div className="flex gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-white hover:bg-kc-blue text-kc-blue hover:text-white rounded-2xl flex items-center justify-center transition-all border border-border"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
