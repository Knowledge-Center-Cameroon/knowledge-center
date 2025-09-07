import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpeg";
import heroImage2 from "@/assets/hero-image2.jpeg";
import heroImage3 from "@/assets/weekend.jpeg";
import heroImage4 from "@/assets/hero-image4.jpeg";
import heroImage5 from "@/assets/hero-image5.jpeg";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowButton } from "@/components/arrowbtn";

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
      image: heroImage2,
      title: "Home where passion meets academic drive",
      subtitle: "Inspiring Excellence in Science",
      description: "Building from a rich repertoire of books and question papers, combined with novel material developed by the KC staff.",
    },
    {
      image: heroImage3,
      title: "Inspiring a generation of creative thinkers",
      subtitle: "Hands-on Learning Experience",
      description: "We help them see the applications and manifestations of the concepts they learn, fostering creativity in solving real-world problems.",
    },
    {
      image: heroImage4,
      title: "Family, epiphany, serendipity, and scientific obsession",
      subtitle: "Beyond the Classroom",
      description: "Every once in a while, we seal the pages of our books and just head out into the sun. To play, to laugh, and to live.",
    },
    {
      image: heroImage5,
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
    <section id="home" className="relative h-[88vh] md:h-[95vh] min-h-[600px] md:min-h-[680px] lg:min-h-[760px] flex items-center justify-center overflow-hidden">
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
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl md:max-w-4xl mx-auto glass rounded-2xl shadow-elegant px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white text-kc-black rounded-full px-3 py-1 text-xs sm:text-sm font-semibold mb-4 md:mb-5">
            <span className="w-2 h-2 rounded-full bg-kc-red" />
            Knowledge Center
          </div>

          {/* Heading */}
          <h1 className="heading-1 mb-3 md:mb-4">
            Empowering Young Scientists
          </h1>
          <div className="subheading text-white/90 mb-6 md:mb-7">
            {slides[currentSlide].subtitle}
          </div>

          {/* Description */}
          <p className="text-base md:text-lg font-body text-white/85 leading-relaxed mb-6 md:mb-8">
            {slides[currentSlide].description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <ArrowButton
              text="Join Our STEM Program"
              bgPrimaryColor="#FFFFFF"
              bgSecondaryColor="#3498db"
              textPrimaryColor="#3498db"
              textSecondaryColor="#FFFFFF"
              className="rounded-full"
              href="/stem-registration"
            />

            <ArrowButton
              text="Discover Our Story"
              bgPrimaryColor="rgba(255,255,255,0.12)"
              bgSecondaryColor="#FFFFFF"
              textPrimaryColor="#FFFFFF"
              textSecondaryColor="#111827"
              className="rounded-full backdrop-blur-md border border-white/30"
              href="/about"
            />
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

      {/* Scroll Indicator (clickable) */}
      <button
        type="button"
        onClick={() => scrollToSection("projects")}
        aria-label="Scroll to projects section"
        className="absolute bottom-8 right-8 hidden lg:block animate-bounce focus:outline-none"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full p-1 hover:border-white/80 transition-colors">
          <div className="w-1 h-3 bg-white/70 rounded-full mx-auto animate-pulse" />
        </div>
      </button>
    </section>
  );
};

export default Hero;