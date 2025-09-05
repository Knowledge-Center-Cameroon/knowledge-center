import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import studentsImage from "@/assets/students-studying.jpg";
import scienceLabImage from "@/assets/science-lab.jpg";
import sportsImage from "@/assets/sports-recreation.jpg";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: heroImage,
      title: "Knowledge Center Cameroon",
      subtitle: "Empowering Young Scientists Through STEM Education",
      description: "We tutor young Cameroonians, and growing scientists, unto unprecedented levels of scientific curiosity, creativity, and love.",
    },
    {
      image: studentsImage,
      title: "Home where passion meets academic drive",
      subtitle: "Inspiring Excellence in Science",
      description: "Building from a rich repertoire of books and question papers, combined with novel material developed by the KC staff.",
    },
    {
      image: scienceLabImage,
      title: "Inspiring a generation of creative thinkers",
      subtitle: "Hands-on Learning Experience",
      description: "We help them see the applications and manifestations of the concepts they learn, fostering creativity in solving real-world problems.",
    },
    {
      image: sportsImage,
      title: "Family, epiphany, serendipity, and scientific obsession",
      subtitle: "Beyond the Classroom",
      description: "Every once in a while, we seal the pages of our books and just head out into the sun. To play, to laugh, and to live.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

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

  return (
    <section id="home" className="relative h-[78vh] md:h-[88vh] min-h-[560px] md:min-h-[620px] flex items-center justify-center overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Solid overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/65" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center text-white pt-24 md:pt-28 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl md:max-w-4xl mx-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-elegant px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white text-kc-black rounded-full px-3 py-1 text-xs sm:text-sm font-semibold mb-4 md:mb-5">
            <span className="w-2 h-2 rounded-full bg-kc-red" />
            Knowledge Center Cameroon
          </div>

          {/* Heading */}
          <h1 className="text-[1.9rem] sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold leading-tight mb-3 md:mb-4">
            Empowering Young Scientists
          </h1>
          <div className="text-base sm:text-lg md:text-xl text-white/90 mb-6 md:mb-7">
            {slides[currentSlide].subtitle}
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg font-body text-white/85 leading-relaxed mb-6 md:mb-8">
            {slides[currentSlide].description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Button asChild size="lg" variant="blue" className="px-6 sm:px-7 py-3 sm:py-4 text-base sm:text-lg font-semibold group">
              <Link to="/stem-registration">
                Join Our STEM Program
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="blackOutline"
              className="px-6 sm:px-7 py-3 sm:py-4 text-base sm:text-lg font-semibold group bg-white/10 backdrop-blur-md hover:bg-white hover:text-kc-black border-white"
            >
              <Link to="/about">
                <Play className="mr-2 h-5 w-5" />
                Discover Our Story
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-smooth"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-smooth"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 hidden lg:block animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full p-1">
          <div className="w-1 h-3 bg-white/70 rounded-full mx-auto animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;