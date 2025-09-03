import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import studentsImage from "@/assets/students-studying.jpg";
import scienceLabImage from "@/assets/science-lab.jpg";
import sportsImage from "@/assets/sports-recreation.jpg";

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
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
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
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center text-white">
        <div className="max-w-5xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight">
            <span className="text-kc-blue bg-white/90 px-4 py-2 rounded-lg inline-block mb-2 mr-2">Knowledge</span>
            <span className="text-kc-red bg-white/90 px-4 py-2 rounded-lg inline-block mb-2">Center</span>
            <br />
            <span className="text-white text-3xl md:text-4xl lg:text-5xl">Cameroon</span>
          </h1>
          
          <h2 className="text-xl md:text-2xl lg:text-3xl font-body font-medium mb-8 text-white/95 bg-kc-black/50 backdrop-blur-sm px-6 py-3 rounded-lg inline-block">
            Empowering Young Scientists Through STEM Education
          </h2>
          
          <p className="text-lg md:text-xl lg:text-xl font-body mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed bg-kc-black/40 backdrop-blur-sm p-6 rounded-lg">
            {slides[currentSlide].description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              variant="blue"
              onClick={() => scrollToSection("stem-registration")}
              className="px-8 py-4 text-lg font-semibold group"
            >
              Join Our STEM Program
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              size="lg"
              variant="blackOutline"
              onClick={() => scrollToSection("about")}
              className="px-8 py-4 text-lg font-semibold group bg-white/10 backdrop-blur-sm hover:bg-white hover:text-kc-black border-white"
            >
              <Play className="mr-2 h-5 w-5" />
              Discover Our Story
            </Button>
          </div>
        </div>
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