import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Target, 
  Lightbulb,
  Brain,
  RefreshCw,
  MessageSquare,
  Rocket,
  ShieldCheck,
  MapPin
} from "lucide-react";
import about1 from "@/assets/kc_about.jpg"
import about from "@/assets/about.jpeg";
import hero2 from "@/assets/hero-image2.jpeg";
import hero3 from "@/assets/hero-image3.jpeg";
import hero4 from "@/assets/hero-image4.jpeg";
import hero5 from "@/assets/hero-image5.jpeg";
import hero6 from "@/assets/hero6.jpeg";
import hero7 from "@/assets/hero7.jpeg";
import hero8 from "@/assets/hero8.jpeg";
import hero9 from "@/assets/hero9.jpeg";
import hero10 from "@/assets/hero10.jpeg";
import hero12 from "@/assets/hero12.jpeg"

import { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import StemBackground from "@/components/StemBackground";
import { useParallax, Parallax } from "@/hooks/use-parallax";

const About = () => {
  const [openFaq, setOpenFaq] = useState<string | undefined>("item-0");
  const [introApi, setIntroApi] = useState<CarouselApi | null>(null);
  const [philoApi, setPhiloApi] = useState<CarouselApi | null>(null);
  const hubsTrackRef = useRef<HTMLDivElement | null>(null);

  // Autoplay for the intro carousel
  useEffect(() => {
    if (!introApi) return;
    const id = setInterval(() => {
      if (!introApi) return;
      if (introApi.canScrollNext()) introApi.scrollNext();
      else introApi.scrollTo(0);
    }, 4000);
    return () => clearInterval(id);
  }, [introApi]);

  // Autoplay for the philosophy carousel
  useEffect(() => {
    if (!philoApi) return;
    const id = setInterval(() => {
      if (!philoApi) return;
      if (philoApi.canScrollNext()) philoApi.scrollNext();
      else philoApi.scrollTo(0);
    }, 4500);
    return () => clearInterval(id);
  }, [philoApi]);

  const hubs = [
    "Yaoundé",
    "Buea",
    "Limbe",
    "Tiko",
    "Douala",
    "Nkongsamba",
    "Bafoussam",
    "Kumba",
    "Bamenda",
    "Dschang",
    "Muyuka",
    "Mbouda",
    "Santchou",
  ];

  // Gentle auto-scroll for hubs chips
  useEffect(() => {
    const el = hubsTrackRef.current;
    if (!el) return;
    let ticking = false;
    const interval = setInterval(() => {
      if (!el) return;
      if (ticking) return;
      ticking = true;
      const next = el.scrollLeft + Math.max(160, el.clientWidth * 0.4);
      const max = el.scrollWidth - el.clientWidth - 2;
      el.scrollTo({ left: next >= max ? 0 : next, behavior: "smooth" });
      setTimeout(() => (ticking = false), 500);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const values = [
    {
      icon: Brain,
      title: "Independent Thinking",
      description:
        "At KC, independent thinking means liberating young people from the tyranny of rote memorization. It means refusing easy answers, privileging evidence over status, and cultivating confidence to propose alternatives. KC students test ideas, welcome contradiction, and build solutions that survive scrutiny."
    },
    {
      icon: RefreshCw,
      title: "Continuous Learning",
      description:
        "The discipline to seek new knowledge across fields, revise views in light of new evidence, and turn mistakes into the raw material of improvement. Our students carry the habits of asking, reading, testing, and growing into every season of their lives."
    },
    {
      icon: MessageSquare,
      title: "Quality Feedback",
      description:
        "Education is incomplete until learners know where they went wrong and how to rise higher. Feedback at KC is timely, specific, and outcome-focused—transforming errors into launch pads for deeper insight."
    },
    {
      icon: Rocket,
      title: "Innovativeness",
      description:
        "Practical creativity under constraint: rapid experiments, honest failure, and scalable solutions born from context. True innovation begins with a problem, not an idea. We reimagine how education itself can unleash potential."
    },
    {
      icon: Target,
      title: "Resist Lowering Standards",
      description:
        "In a system where mediocrity is normal, KC insists on excellence. Our exams are deliberately challenging because students rise to the level of trust placed in them. We believe every learner is capable of greatness."
    },
    {
      icon: ShieldCheck,
      title: "Practice What You Preach",
      description:
        "KC’s credibility comes from living our own gospel. We model resilience and iteration as we run national programs with limited resources yet growing scale. At KC, the line between teacher and learner blurs."
    }
  ];

  const faqs = [
    {
      question: "What is Knowledge Center (KC)?",
      answer: "Knowledge Center (KC) is an educational institution founded in November 2019 by academically high-achieving university freshmen passionate about helping future generations of science students succeed in their academic endeavors, especially at their end-of-course GCE examinations."
    },
    {
      question: "What subjects do you offer tutoring in?",
      answer: "We specialize in STEM subjects including Mathematics, Physics, Chemistry, Biology, and Computer Science. Our curriculum is built from a rich repertoire beyond books and question papers, combined with novel material developed by our dedicated staff."
    },
    {
      question: "Who can join KC programs?",
      answer: "Our programs are designed for young Cameroonians passionate about science and mathematics. We welcome students preparing for GCE examinations and those looking to deepen their understanding of STEM subjects."
    },
    {
      question: "How do you support students beyond academics?",
      answer: "Beyond classroom instruction, we provide mentorship programs, sports and recreation activities, project funding for science initiatives, and host annual STEM competitions to foster healthy competition and reward excellence."
    },
    {
      question: "What makes KC different from other educational institutions?",
      answer: "We combine rigorous academic instruction with humanitarian values, creating a family environment where scientific obsession meets compassion, honesty, and love. Every student gets a personal mentor, and we focus on real-world applications of scientific concepts."
    }
  ];

  const { ref, y } = useParallax(40);
  return (
    <section id="about" className="py-14 md:py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Header */}
        <Parallax ref={ref as any} style={{ y }} className="relative overflow-hidden rounded-2xl mb-16">
          <StemBackground opacity={0.15} density={36} lineDistance={120} speed={0.45} showIcons={true} />
          <div className="relative z-10 text-center py-8">
            <div className="h-1 w-28 mx-auto mb-3 bg-kc-blue rounded-full" />
            <h2 className="heading-2 mb-6">
              <span className="text-kc-blue">About</span> <span className="text-kc-red">Knowledge Center</span>
            </h2>
            <p className="subheading max-w-3xl mx-auto leading-relaxed">
              Discover our journey from a small act of community service to a far bigger odyssey 
              of scientific and humanitarian engagement.
            </p>
          </div>
        </Parallax>

        {/* What is Knowledge Center with Carousel */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center mb-14 md:mb-20">
          <div className="animate-slide-up">
<motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="h-1 mb-3 bg-kc-blue rounded-full"
              />
            <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4 md:mb-6">What is Knowledge Center</h3>
        <div className="prose md:prose-lg max-w-none">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-muted-foreground leading-relaxed mb-4 md:mb-6"
              >
                There is a violence being done to young minds across large parts of Africa: education reduced to regurgitation,
                curiosity stamped out for the sake of a grade. Knowledge Center exists to end that quiet violence. We are a youth-led
                movement that refuses the belief that school must be a factory of memorized answers. KC is where young people relearn
                how to wonder, how to reason, and how to turn knowledge into power.
              </motion.p>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-muted-foreground leading-relaxed"
              >
                We build learning that looks like life. Experiences that demand imagination, refuse easy answers, and teach students
                how to wield ideas as tools to remake their communities. Our work spans rigorous national assessments recast as
                laboratories for thought, mentorship that elevates aspiration into skill, and an innovation pipeline that turns classroom
                insight into community solutions. We do this with intention, regional reach, and relentless care.
              </motion.p>
            </div>
          </div>

          <div className="animate-slide-up mt-4 lg:mt-0">
            <Carousel setApi={setIntroApi} className="rounded-2xl shadow-elegant bg-white/5 backdrop-blur-sm p-2">
              <CarouselContent>
                {[about1, about, hero2, hero4, hero5].map((img, i) => (
                  <CarouselItem key={i}>
                    <div className="relative overflow-hidden rounded-xl">
                      <img src={img} alt={`KC slide ${i + 1}`} className="w-full h-48 sm:h-60 md:h-72 lg:h-[360px] object-cover" loading="lazy" decoding="async" sizes="(min-width: 1024px) 50vw, 100vw" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-kc-blue/20 via-transparent to-kc-red/20" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex bg-kc-blue text-white border-0 hover:bg-kc-red" />
              <CarouselNext className="hidden sm:flex bg-kc-blue text-white border-0 hover:bg-kc-red" />
            </Carousel>
          </div>
        </div>

        {/* Philosophy Sections with Side Carousel */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-start mb-14 md:mb-20">
          <div className="space-y-12 animate-slide-up">
            <div>
              <div className="h-1 w-20 mb-3 bg-kc-blue rounded-full" />
              <h3 className="text-2xl md:text-3xl font-heading font-bold mb-3 md:mb-4">What we teach that school forgets</h3>
                <div className="prose md:prose-lg max-w-none">
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-muted-foreground leading-relaxed"
                  >
                    We teach the courage to ask the wrong question until the right one appears. We value process over an answer and craft
                    problems that expand the mind rather than narrow it. We are architects of intellectual habit: skepticism,
                    cross-disciplinary synthesis, craftsmanship in reasoning, and fierce curiosity. KC's students know how to make things
                    that matter.
                  </motion.p>
                </div>
            </div>

            <div>
              <div className="h-1 w-20 mb-3 bg-kc-blue rounded-full" />
              <h3 className="text-2xl md:text-3xl font-heading font-bold mb-3 md:mb-4">Why this matters now</h3>
              <div className="prose md:prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  The global economy no longer prizes the person who remembers or knows the most. It rewards the person who sees a
                  problem nobody else sees and makes a solution. Africa’s future will be written by those trained to ask, test, and invent.
                  KC is creating that cohort, urgently. We are cultivating the mental muscles necessary for Africa to leap.
                </p>
              </div>
            </div>
          </div>

          <div className="animate-slide-up mt-4 lg:mt-0">
            <Carousel setApi={setPhiloApi} className="rounded-2xl shadow-elegant bg-white/5 backdrop-blur-sm p-2">
              <CarouselContent>
                {[hero6, hero7, hero8, hero9, hero10, hero12].map((img, i) => (
                  <CarouselItem key={i}>
                    <div className="relative overflow-hidden rounded-xl">
                      <img src={img} alt={`KC philosophy ${i + 1}`} className="w-full h-48 sm:h-60 md:h-72 lg:h-[360px] object-cover" loading="lazy" decoding="async" sizes="(min-width: 1024px) 50vw, 100vw" />
                      <div className="absolute inset-0 bg-gradient-to-br from-kc-red/20 via-transparent to-kc-blue/20" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex bg-kc-red text-white border-0 hover:bg-kc-blue" />
              <CarouselNext className="hidden sm:flex bg-kc-red text-white border-0 hover:bg-kc-blue" />
            </Carousel>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-20">
          <Card className="shadow-elegant transition-all hover:shadow-2xl hover:-translate-y-1 bg-white/40 backdrop-blur-sm border-white/50">
            <CardContent className="p-6 md:p-8">
              <motion.div 
                className="relative w-16 h-16 rounded-full flex items-center justify-center mb-6"
                whileHover={{ scale: 1.08, rotate: 1 }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="absolute inset-0 rounded-full bg-kc-blue opacity-90" />
                <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-kc-blue/40 to-kc-red/40 blur-md" />
                <Target className="h-8 w-8 text-white relative" aria-label="Mission icon" />
              </motion.div>
              <div className="h-1 w-16 mb-3 bg-kc-blue rounded-full" />
              <h3 className="text-xl md:text-2xl font-heading font-bold mb-3 md:mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To re-imagine education by cultivating critical 21st-century skills—creativity, problem-solving, collaboration, and
                resilience—that empower young learners to compete globally and lead Africa’s exponential growth. KC exists to move
                students beyond memorization into inquiry, innovation, and impact.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant transition-all hover:shadow-2xl hover:-translate-y-1 bg-white/40 backdrop-blur-sm border-white/50">
            <CardContent className="p-6 md:p-8">
              <motion.div 
                className="relative w-16 h-16 rounded-full flex items-center justify-center mb-6"
                whileHover={{ scale: 1.08, rotate: -1 }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="absolute inset-0 rounded-full bg-kc-red opacity-90" />
                <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-kc-red/40 to-kc-blue/40 blur-md" />
                <Lightbulb className="h-8 w-8 text-white relative" aria-label="Vision icon" />
              </motion.div>
              <div className="h-1 w-16 mb-3 bg-kc-blue rounded-full" />
              <h3 className="text-xl md:text-2xl font-heading font-bold mb-3 md:mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To build true parity in pre-university education where talent defines opportunity. We aim to raise a generation of
                African learners who rise as global icons, setting the pace in science, technology, leadership, and creativity.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Core Values - Updated */}
        <div className="mb-20">
          <div className="text-center">
            <div className="h-1 w-28 mx-auto mb-3 bg-kc-blue rounded-full" />
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-center mb-8 md:mb-12"><span className="text-kc-blue">KC</span> <span className="text-kc-red">Core Values</span></h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                key={index}
              >
                <Card className="h-full shadow-elegant transition-all hover:shadow-2xl bg-white/40 backdrop-blur-sm border-white/50">
                <CardContent className="p-5 md:p-6 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-kc-black text-white">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-base md:text-lg font-heading font-semibold mb-2 md:mb-3 text-center">{value.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed text-center flex-1">{value.description}</p>
                </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-center mb-6 md:mb-10">Frequently Asked Questions</h3>
          <Accordion type="single" collapsible value={openFaq} onValueChange={setOpenFaq} className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={index}
              >
                <AccordionItem 
                  value={`item-${index}`} 
                  className="border border-border rounded-xl mb-3 md:mb-4 overflow-hidden bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-kc-blue/40"
                >
                <AccordionTrigger className="px-4 md:px-6 py-3.5 md:py-5 text-left font-semibold hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <span>{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 md:px-6 pb-4 md:pb-6 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>

        {/* KC STEM Hubs - Enhanced Design with better visual hierarchy and interactivity */}
        <div className="mt-16 md:mt-24">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/30 bg-gradient-to-br from-white/80 via-white/50 to-white/30 backdrop-blur-xl">
            {/* Enhanced decorative orbs with better positioning */}
            <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-gradient-to-br from-kc-blue/40 to-kc-red/30 blur-3xl animate-pulse" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-gradient-to-tr from-kc-red/40 to-kc-blue/30 blur-3xl animate-pulse" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-r from-kc-blue/10 to-kc-red/10 blur-3xl" />

            <div className="relative p-6 md:p-8 lg:p-12">
              {/* Enhanced header with better typography hierarchy */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kc-blue/10 backdrop-blur-sm border border-kc-blue/20 mb-4"
                >
                  <MapPin className="h-4 w-4 text-kc-blue" />
                  <span className="text-sm font-semibold text-kc-blue">Locations Across Cameroon</span>
                </motion.div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-3">
                  <span className="bg-gradient-to-r from-kc-blue to-kc-red bg-clip-text text-transparent">KC STEM Hubs</span> <span className="text-foreground">Across Cameroon</span>
                </h3>
                <p className="text-foreground/80 max-w-2xl mx-auto text-lg leading-relaxed">
                  Discover inquiry-driven learning centers nationwide. Find the hub closest to you and join our community of innovators.
                </p>
              </div>

              {/* Enhanced city chips with better styling and animations */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-kc-blue/30 via-transparent to-kc-red/30" />
                  <div className="overflow-x-auto no-scrollbar snap-x snap-mandatory" ref={hubsTrackRef}>
                    <div className="flex items-stretch gap-3 md:gap-4 px-4 py-4">
                      {hubs.map((city, i) => (
                        <motion.div
                          key={city}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: i * 0.05 }}
                          whileHover={{ y: -6, scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="snap-start"
                        >
                          <div className="group relative rounded-full px-4 md:px-5 py-3 bg-gradient-to-r from-kc-blue/90 to-kc-red/90 text-white shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:border-white/40">
                            <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-kc-blue to-kc-red opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
                            <div className="relative flex items-center gap-2.5">
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                <MapPin className="h-3.5 w-3.5" />
                              </span>
                              <span className="text-sm md:text-base font-semibold tracking-tight whitespace-nowrap">{city}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced CTA section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-10 text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative inline-flex items-center gap-3 rounded-full px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-kc-blue to-kc-red text-white font-semibold text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-white/40"
                >
                  <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-kc-blue to-kc-red opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
                  <span className="relative">Explore Programs Near You</span>
                  <motion.div
                    className="relative"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.div>
                </motion.button>
                <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto">
                  Ready to start your STEM journey? Find programs, schedules, and opportunities in your city.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;