import React from "react";
import { motion } from "framer-motion";
import { ArrowButton } from "@/components/arrowbtn";
import StemBackground from "@/components/StemBackground";
import { useNavigate } from "react-router-dom";
import { MousePointerClick, MapPin, Phone } from "lucide-react";

const StemRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const handleStart = () => {
    navigate("/stem-registration/apply");
  };
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="container mx-auto py-14 md:py-20 lg:py-32"
    >
        
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="relative overflow-hidden rounded-2xl mb-16">
            <StemBackground opacity={0.15} density={36} lineDistance={120} speed={0.45} showIcons={true} />
            <div className="relative z-10 text-center py-8">
              <div className="h-1 w-28 mx-auto mb-3 bg-kc-blue rounded-full" />
                <h2 className="heading-2 mb-6">
                  <span className="text-kc-blue">National</span> <span className="text-kc-red">STEM Competition</span>
                </h2>
                <p className="subheading max-w-3xl mx-auto leading-relaxed">
                  Register for one of the nations most transformative experience.
                </p>
                <p className="text-muted-foreground max-w-3xl mx-auto mt-3">
                  Join students from across Cameroon in a hands-on challenge that blends creativity with real-world problem solving.
                  Compete in Mathematics, Physics, Chemistry, and Biology for prizes, mentorship, and national recognition.
                </p>
            </div>
          </div>

          {/* Removed top Start Registration button. */}

          {/* Additional registration options */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="bg-gradient-card p-6 rounded-2xl shadow-elegant"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-kc-blue/10 flex items-center justify-center">
                  <MousePointerClick className="w-5 h-5 text-kc-blue" />
                </div>
                <h3 className="font-semibold">Register Online</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Quickly register for the National STEM Competition via our website.
              </p>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 text-xs rounded-full bg-kc-blue/10 text-kc-blue border border-kc-blue/20">Fastest Way</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-kc-red/10 text-kc-red border border-kc-red/20">Limited Slots</span>
              </div>
              <ArrowButton
                text="Register Now"
                bgPrimaryColor="#ffffff"
                bgSecondaryColor="#e11d48"
                textPrimaryColor="#e11d48"
                textSecondaryColor="#ffffff"
                className="rounded-full shadow-lg shadow-kc-red/20 animate-pulse hover:animate-none"
                onClick={handleStart}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-gradient-card p-6 rounded-2xl shadow-elegant"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-kc-red/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-kc-red" />
                </div>
                <h3 className="font-semibold">Visit Our Head Office</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                RHIMS Campus, Buea — visit us during working hours to complete your registration in person.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-gradient-card p-6 rounded-2xl shadow-elegant"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-kc-blue/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-kc-blue" />
                </div>
                <h3 className="font-semibold">Contact Us</h3>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground mb-2">Prefer to speak with someone? Call us:</p>
                <ul className="space-y-1">
                  <li>
                    <a className="hover:underline" href="tel:+237670123456">+237 670 123 456</a>
                  </li>
                  <li>
                    <a className="hover:underline" href="tel:+237699987654">+237 699 987 654</a>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Centered Download Brochure at the bottom */}
          <div className="mt-12 flex justify-center">
            <ArrowButton
              text="Download Brochure"
              bgPrimaryColor="rgba(17,24,39,0.08)"
              bgSecondaryColor="#111827"
              textPrimaryColor="#111827"
              textSecondaryColor="#FFFFFF"
              className="rounded-full"
              onClick={() => {/* wire to brochure link */}}
            />
          </div>
        </div>
    </motion.section>
  );
};

export default StemRegistrationPage;
