import React, { useState, useEffect } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpeg";
import heroImage2 from "@/assets/hero-image2.jpeg";
import heroImage3 from "@/assets/weekend.jpeg";
import heroImage4 from "@/assets/hero-image4.jpeg";
import heroImage5 from "@/assets/hero-image5.jpeg";
import { motion, AnimatePresence } from "framer-motion";
import { useParallax } from "@/hooks/use-parallax";
import AnimatedLogo from "@/components/AnimatedLogo";
import { Link } from "react-router-dom";
import { ArrowButton } from "@/components/arrowbtn";

const slides = [
  {
    image: heroImage,
    title: "Knowledge Center Cameroon",
    subtitle: "Empowering Young Scientists Through STEM Education",
    description:
      "We tutor young Cameroonians, and growing scientists, unto unprecedented levels of scientific curiosity, creativity, and love.",
  },
  {
    image: heroImage2,
    title: "Home where passion meets academic drive",
    subtitle: "Inspiring Excellence in Science",
    description:
      "Building from a rich repertoire of books and question papers, combined with novel material developed by the KC staff.",
  },
  {
    image: heroImage3,
    title: "Inspiring a generation of creative thinkers",
    subtitle: "Hands-on Learning Experience",
    description:
      "We help them see the applications and manifestations of the concepts they learn, fostering creativity in solving real-world problems.",
  },
  {
    image: heroImage4,
    title: "Family, epiphany, serendipity, and scientific obsession",
    subtitle: "Beyond the Classroom",
    description:
      "Every once in a while, we seal the pages of our books and just head out into the sun. To play, to laugh, and to live.",
  },
  {
    image: heroImage5,
    title: "Family, epiphany, serendipity, and scientific obsession",
    subtitle: "Beyond the Classroom",
    description:
      "Every once in a while, we seal the pages of our books and just head out into the sun. To play, to laugh, and to live.",
  },
];

const phrases = [
  "Learning Today, Leading Tomorrow",
  "Turning Potential Into Impact",
  "Igniting the Spark of Curiosity",
  "Inspiring Young Minds to Rise",
  "Nurturing Creativity, Driving Change.",
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  // Preload the next slide image to smooth transitions without loading all upfront
  useEffect(() => {
    const nextIndex = (currentSlide + 1) % slides.length;
    const img = new Image();
    img.src = slides[nextIndex].image;
  }, [currentSlide, slides]);

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

  useEffect(() => {
    const id = setInterval(() => setPhraseIndex((i) => (i + 1) % phrases.length), 3200);
    return () => clearInterval(id);
  }, [phrases.length]);

  const { ref: parRef, y: yBack } = useParallax(60);
  const { y: yOverlay } = useParallax(30);
  const { y: yImage } = useParallax(45); // Enhanced parallax for individual images
  return (
    <section
      ref={parRef as React.Ref<HTMLElement>}
      id="home"
      className="relative pt-24 md:pt-28 lg:pt-32 min-h-[70svh] sm:min-h-[75svh] md:min-h-[80svh] lg:min-h-[88svh] flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Image background panel on the right, with slider (desktop / tablet) */}
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
                className="w-full h-full object-cover object-center will-change-transform transition-transform duration-700"
                loading={idx === 0 ? "eager" : "lazy"}
                decoding="async"
                sizes="(min-width: 1024px) 60vw, 70vw"
              />
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-black/45"
              style={{ y: yOverlay }}
            />
          </motion.div>
        ))}
      </div>

      {/* Main content card inspired by reference layout */}
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
          {/* White curved content panel */}
          <div className="relative">
            <div className="relative bg-white rounded-[2.5rem] md:rounded-[3rem] px-6 pt-5 pb-7 sm:px-8 sm:pt-6 sm:pb-9 md:px-10 md:py-10 shadow-[0_18px_60px_rgba(15,23,42,0.18)] border border-slate-100/80 max-w-xl">
              {/* Mobile image embedded in card */}
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
                      className="w-full h-full object-cover object-center"
                      loading={idx === 0 ? "eager" : "lazy"}
                      decoding="async"
                      sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-black/25" />
                  </motion.div>
                ))}
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
                  <button
                    onClick={prevSlide}
                    className="bg-black/55 text-white p-2 rounded-full hover:bg-black/75 transition-colors shadow-lg"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-1.5">
                    {slides.map((_, index) => (
                      <span
                        key={index}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          index === currentSlide ? "bg-white w-5" : "bg-white/60 w-2"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={nextSlide}
                    className="bg-black/55 text-white p-2 rounded-full hover:bg-black/75 transition-colors shadow-lg"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Animated Logo */}
              <div className="flex items-center gap-3 mb-5 md:mb-6">
                <div className="shrink-0">
                  <AnimatedLogo size={68} />
                </div>
                <div className="hidden sm:flex flex-col text-xs font-semibold tracking-[0.22em] uppercase text-slate-500">
                  <span>Knowledge Center</span>
                  <span className="text-slate-700">Cameroon</span>
                </div>
              </div>

              {/* Heading with solid color text */}
              <div className="relative mb-4 md:mb-5">
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={phraseIndex}
                    className="heading-1 text-slate-900 leading-tight sm:leading-tight break-words max-w-[18ch] sm:max-w-[22ch]"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {phrases[phraseIndex]}
                  </motion.h1>
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`subtitle-${currentSlide}`}
                  className="text-sm sm:text-base md:text-lg font-semibold text-slate-700 mb-3 md:mb-4"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  {slides[currentSlide].subtitle}
                </motion.div>
              </AnimatePresence>

              {/* Description */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`desc-${currentSlide}`}
                  className="text-sm sm:text-base md:text-[0.98rem] font-body text-slate-600 leading-relaxed mb-6 md:mb-7 max-w-xl"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {slides[currentSlide].description}
                </motion.p>
              </AnimatePresence>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                <ArrowButton
                  text="Our Impact"
                  bgPrimaryColor="#111827"
                  bgSecondaryColor="#2563eb"
                  textPrimaryColor="#ffffff"
                  textSecondaryColor="#ffffff"
                  className="rounded-full w-full sm:w-auto"
                  href="/projects"
                />

                <ArrowButton
                  text="Discover Our Story"
                  bgPrimaryColor="rgba(15,23,42,0.04)"
                  bgSecondaryColor="#111827"
                  textPrimaryColor="#0f172a"
                  textSecondaryColor="#ffffff"
                  className="rounded-full w-full sm:w-auto border border-slate-200/80 backdrop-blur-[8px]"
                  href="/about"
                />
              </div>

              {/* Bottom meta row: slide dots + scroll circle */}
              <div className="mt-7 md:mt-8 flex items-center justify-between gap-4 flex-wrap">
                {/* Slide indicators */}
                <div className="flex items-center gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "bg-slate-900 w-6"
                          : "bg-slate-300 w-2 hover:bg-slate-400"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Scroll circle */}
                <button
                  type="button"
                  onClick={() => scrollToSection("about-home")}
                  aria-label="Scroll to about section on home page"
                  className="relative inline-flex items-center justify-center rounded-full border border-slate-200/90 w-24 h-24 text-[0.65rem] uppercase tracking-[0.18em] text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors"
                >
                  <span className="absolute inset-[18%] rounded-full border border-dashed border-slate-200" />
                  <span className="z-10 text-[0.6rem] font-semibold">Scroll Down</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right column: empty placeholder for layout balance on large screens */}
          <div className="hidden md:block" aria-hidden="true" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;