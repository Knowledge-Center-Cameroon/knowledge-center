import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// Assets
import heroImage from "@/assets/hero-image.jpeg";
import heroImage2 from "@/assets/hero-image2.jpeg";
import heroImage3 from "@/assets/weekend.jpeg";
import heroImage4 from "@/assets/hero-image4.jpeg";
import heroImage5 from "@/assets/hero-image5.jpeg";

// Components & Hooks
import { useParallax } from "@/hooks/use-parallax";
import AnimatedLogo from "@/components/AnimatedLogo";
import { ArrowButton } from "@/components/arrowbtn";

const slides = [
  {
    image: heroImage,
    title: "Where Curiosity Becomes Capability",
    subtitle: "Empowering Young Scientists",
    description:
      "We don’t teach students what to think. We teach them how to question, explore, and turn understanding into real-world impact.",
  },
  {
    image: heroImage2,
    title: "Inspiring Minds. Shaping Futures",
    subtitle: "Inspiring Excellence in Science",
    description:
      "Every lesson is an invitation to imagine more, aim higher, and grow into a thinker the future actually needs.",
  },
  {
    image: heroImage3,
    title: "Education That Ignites Possibility",
    subtitle: "Hands-on Learning Experience",
    description:
      "Beyond grades and syllabi, we awaken curiosity, creativity, and the courage to try what feels impossible.",
  },
  {
    image: heroImage4,
    title: "Learning That Reaches Beyond Exams",
    subtitle: "Building Practical Knowledge",
    description:
      "Here, knowledge isn’t memorized for tests; it's used to build, solve, and serve communities.",
  },
  {
    image: heroImage5,
    title: "Building Thinkers for a Changing World",
    subtitle: "Beyond the Classroom",
    description:
      "We prepare young minds not just for school, but for uncertainty, innovation, and meaningful contribution.",
  },
];

// Extracted titles for the cycling heading
const phrases = slides.map((slide) => slide.title);

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Preload the next slide image
  useEffect(() => {
    const nextIndex = (currentSlide + 1) % slides.length;
    const img = new Image();
    img.src = slides[nextIndex].image;
  }, [currentSlide]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const { ref: parRef, y: yBack } = useParallax(60);
  const { y: yOverlay } = useParallax(30);
  const { y: yImage } = useParallax(45);

  return (
    <section
      ref={parRef as React.Ref<HTMLElement>}
      id="home"
      className="relative pt-24 md:pt-28 lg:pt-32 min-h-[70svh] sm:min-h-[75svh] md:min-h-[80svh] lg:min-h-[88svh] flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Desktop Parallax Background */}
      <div className="pointer-events-none hidden md:block absolute inset-y-6 right-0 left-2/5 lg:left-[45%] rounded-l-[2.75rem] md:rounded-l-[3.25rem] overflow-hidden shadow-2xl shadow-black/30">
        {slides.map((s, idx) => (
          <motion.div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              idx === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{ y: yBack }}
          >
            <motion.div
              className="absolute inset-0 scale-110"
              style={{ y: yImage }}
            >
              <img
                src={s.image}
                alt={s.title}
                className="w-full h-full object-cover object-center will-change-transform"
                loading={idx === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-black/45"
              style={{ y: yOverlay }}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        className="relative z-10 container mx-auto px-4 lg:px-8"
        style={{ y: yOverlay }}
      >
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative grid gap-10 md:gap-12 lg:gap-16 items-center md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]"
        >
          {/* Main Content Card */}
          <div className="relative bg-white rounded-[2.5rem] md:rounded-[3rem] px-6 pt-5 pb-7 sm:px-8 sm:pt-6 sm:pb-9 md:px-10 md:py-10 shadow-[0_18px_60px_rgba(211,92,132,0.12)] border border-kc-blue/20 max-w-xl">
            {/* Mobile image slider */}
              <div className="relative mb-5 -mx-4 sm:-mx-6 md:hidden rounded-[2rem] overflow-hidden h-52 xs:h-56 sm:h-64">
                {slides.map((s, idx) => (
                  <motion.div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                      idx === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/25" />
                  </motion.div>
                ))}
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
                  <button onClick={prevSlide} className="bg-black/55 text-white p-2 rounded-full"><ChevronLeft className="h-4 w-4" /></button>
                  <div className="flex gap-1.5">
                    {slides.map((_, i) => (
                      <span key={i} className={`h-1.5 rounded-full transition-all ${i === currentSlide ? "bg-white w-5" : "bg-white/60 w-2"}`} />
                    ))}
                  </div>
                  <button onClick={nextSlide} className="bg-black/55 text-white p-2 rounded-full"><ChevronRight className="h-4 w-4" /></button>
                </div>
              </div>

              {/* Logo Row */}
              <div className="flex items-center gap-3 mb-5 md:mb-6">
                <AnimatedLogo size={68} />
                <div className="hidden sm:flex flex-col text-xs font-semibold tracking-[0.22em] uppercase text-foreground/60">
                  <span>Knowledge Center</span>
                  <span className="text-foreground">Cameroon</span>
                </div>
              </div>

              {/* Dynamic Content */}
              <div className="relative mb-4 md:mb-5">
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={`title-${currentSlide}`}
                    className="heading-1 text-foreground leading-tight break-words max-w-[22ch]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                    {slides[currentSlide].title}
                  </motion.h1>
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`subtitle-${currentSlide}`}
                  className="text-sm sm:text-base md:text-lg font-semibold text-kc-blue mb-3 md:mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {slides[currentSlide].subtitle}
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.p
                  key={`desc-${currentSlide}`}
                  className="text-sm sm:text-base md:text-[0.98rem] font-body text-foreground/70 leading-relaxed mb-6 md:mb-7"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  {slides[currentSlide].description}
                </motion.p>
              </AnimatePresence>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                <ArrowButton
                  text="Our Impact"
                  bgPrimaryColor="hsl(220 100% 45%)"
                  bgSecondaryColor="hsl(0 75% 50%)"
                  textPrimaryColor="#ffffff"
                  textSecondaryColor="#ffffff"
                  className="rounded-full w-full sm:w-auto"
                  href="/projects"
                />
                <ArrowButton
                  text="Discover Our Story"
                  bgPrimaryColor="hsl(0 0% 100%)"
                  bgSecondaryColor="hsl(220 100% 45%)"
                  textPrimaryColor="hsl(0 0% 10%)"
                  textSecondaryColor="#ffffff"
                  className="rounded-full w-full sm:w-auto border border-kc-blue/30 backdrop-blur-[8px]"
                  href="/about"
                />
              </div>

              {/* Pagination Dots & Scroll Down */}
              <div className="mt-7 md:mt-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentSlide ? "bg-kc-blue w-6" : "bg-kc-blue/40 w-2"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => scrollToSection("about-home")}
                  className="relative inline-flex items-center justify-center rounded-full border border-kc-blue/30 w-24 h-24 text-[0.6rem] uppercase tracking-widest text-foreground/60 hover:text-foreground transition-colors"
                >
                  <span className="absolute inset-[18%] rounded-full border border-dashed border-kc-blue/30" />
                  <span className="z-10 font-semibold">Scroll Down</span>
                </button>
              </div>
            </div>
          <div className="hidden md:block" aria-hidden="true" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;