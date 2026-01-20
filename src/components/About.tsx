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

const CameroonMap = () => {
  const hubs = [
    { name: "Yaoundé", x: 42.0, y: 78.5 },
    { name: "Douala", x: 18.5, y: 81.5 },
    { name: "Buea", x: 11.5, y: 80.5 },
    { name: "Bafoussam", x: 27.5, y: 66.5 },
    { name: "Garoua", x: 55.0, y: 25.5 },
    { name: "Bamenda", x: 22.5, y: 60.5 },
    { name: "Ngaoundéré", x: 53.0, y: 48.5 },
    { name: "Maroua", x: 73.0, y: 10.5 },
    { name: "Bertoua", x: 65.0, y: 75.5 },
    { name: "Ebolowa", x: 32.5, y: 88.5 },
    { name: "Limbe", x: 10.5, y: 82.5 },
    { name: "Dschang", x: 21.5, y: 67.5 },
    { name: "Foumban", x: 33.5, y: 62.5 },
  ];

  return (
    <div className="relative w-full aspect-[992/1429] max-w-md mx-auto bg-slate-50/30 rounded-2xl border border-slate-100 p-2 shadow-inner overflow-hidden group">
      {/* Actual Cameroon Map Image */}
      <img
        src="/cameroon.svg"
        alt="Map of Cameroon"
        className="w-full h-full object-contain opacity-80"
      />

      {/* Hub locations overlay */}
      <div className="absolute inset-0">
        {hubs.map((hub, i) => (
          <div
            key={hub.name}
            className="absolute"
            style={{ left: `${hub.x}%`, top: `${hub.y}%` }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }}
              className="relative"
            >
              {/* Core pulse dot */}
              <div className="w-2 h-2 bg-kc-red rounded-full shadow-sm z-20" />

              {/* Pulsing ring animation */}
              <motion.div
                animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 bg-kc-red rounded-full -z-10"
              />

              {/* Tooltip-style label on hover or key hubs */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-1.5 py-0.5 bg-white/95 border border-slate-200 rounded shadow-md text-[8px] font-bold text-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${i % 3 === 0 ? 'opacity-100' : ''}`}
              >
                {hub.name}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

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

  const hubsList = [
    "Yaoundé",
    "Douala",
    "Buea",
    "Bafoussam",
    "Garoua",
    "Bamenda",
    "Ngaoundéré",
    "Maroua",
    "Bertoua",
    "Ebolowa",
    "Limbe",
    "Dschang",
    "Foumban",
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
        "KC was founded in resistance to rote learning, blind syllabus coverage, and unexamined traditions. We lead by questioning first principles of education, assessment, success, and relevance. A KCian is trained to interrogate ideas, decode unfamiliar problems, and think beyond precedent. Organizational decisions at KC prioritize depth of reasoning over convention, even when that path is harder or slower."
    },
    {
      icon: RefreshCw,
      title: "Continuous Learning",
      description:
        "KC is built on the belief that relevance is earned daily. From educators to leadership, we operate as active learners, constantly refining methods, integrating new tools, and evolving our models in response to a changing world. A KCian never “arrives”; growth, reinvention, and intellectual humility are non-negotiable parts of our identity."
    },
    {
      icon: MessageSquare,
      title: "Quality Feedback",
      description:
        "KC treats assessment as a mirror, not a verdict. Feedback at every level - student, educator, program, or system - is designed to reveal thinking, sharpen judgment, and guide improvement. We value honest evaluation over praise, and clarity over comfort, because transformation requires knowing precisely where we stand."
    },
    {
      icon: ShieldCheck,
      title: "Practice What You Preach",
      description:
        "KC leadership is not theoretical. We teach curiosity, rigor, discipline, and innovation because we live them. Our educators are practitioners, our leaders are learners, and our programs reflect the standards we demand. A KCian understands that credibility is built through action, not declaration."
    },
    {
      icon: Target,
      title: "Resist Lowering Standards",
      description:
        "KC was born in crisis, scarcity, and constraint but never compromise. Whether in tutoring, national exams, or global scholar preparation, we reject dilution for convenience. A KCian believes excellence is not contextual; it is cultivated. We hold high standards because they are the gateway to confidence, competence, and global competitiveness "
    },
    {
      icon: Rocket,
      title: "Innovativeness",
      description:
        "Innovation is the operating logic of KC. From reimagined assessments and hands-on STEM projects to AI-assisted learning and interdisciplinary programs, we lead by building what does not yet exist. A KCian is not satisfied with inherited systems, they design better ones, guided by purpose, creativity, and real-world relevance. "
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
                Knowledge Center (KC) is a <b>non-profit, community-serving education and STEM
                advocacy organization</b> based in Cameroon. We exist to inspire young people to
                explore the full depth of their intellectual potential and to use learning as a tool for 
                <b>service, innovation, and human progress.</b>
              </motion.p>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-muted-foreground leading-relaxed"
              >
                KC began as a <b>small act of community service</b> - helping students understand difficult
                science concepts during a time of national crisis - but has grown into a <b>national
                movement</b> redefining what meaningful education can look like. Through tutoring
                programs, national STEM initiatives, mentorship, hands-on projects, and 
                scholarships, we nurture learners who are not only academically excellent, but 
                <b>deeply curious, resilient, collaborative, and driven to change their communities.</b>
                <br />
                At Knowledge Center, education is not the memorization of facts or a race through 
                syllabi. It is the training of minds to <b>question, to build, to imagine, and to keep
                learning long after school is out.</b>
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
              <h3 className="text-2xl md:text-3xl font-heading font-bold mb-3 md:mb-4">Why we are different</h3>
                <div className="prose md:prose-lg max-w-none">
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-muted-foreground leading-relaxed"
                  >
                    We do more than prepare students for exams - we prepare them for <b>life in a rapidly
                    changing world.</b> While traditional systems often reward <b>rote memorization and grade
                    accumulation,</b> KC prioritizes <b>conceptual understanding, creativity, and critical
                    thinking.</b> Our students are encouraged to ask <b>why</b> and <b>how</b>, not just <b>what</b>.
                    <br />
                    Learning at KC is <b>immersive and practical.</b> Students build devices, conduct
                    experiments, analyze unfamiliar problems, and apply classroom knowledge to 
                    real-world challenges. We use audio-visual tools, simulations, mentorship, 
                    collaborative learning, and national projects like the KC National STEM Project to 
                    push learners beyond comfort and into discovery.
                    <br /> 
                    Most importantly, we see <b>academic excellence as a byproduct</b> - not the sole goal.
                    What defines a KC scholar is <b>curiosity, ambition, integrity, and a genuine love for
                    learning.</b> We graduate not just high performers, but thoughtful humans ready to
                    contribute meaningfully to society.
                  </motion.p>
                </div>
            </div>

            <div className="lg:col-span-2">
              <div className="h-1 w-20 mb-3 bg-kc-blue rounded-full" />
              <h3 className="text-2xl md:text-3xl font-heading font-bold mb-3 md:mb-4">Why this matters now</h3>
              <div className="prose md:prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  We are living in an <b>innovation-driven, globally connected era</b> where information is
                  abundant and routine skills are increasingly automated. The real advantage today 
                  lies in the ability to <b>think critically, adapt quickly, collaborate across disciplines, and
                  creatively solve complex problems.</b> Unfortunately, many education systems are still
                  preparing students for a world that no longer exists.
                  <br /> 
                  At the same time, Africa - and Cameroon in particular - has an <b>immense reserve of
                  untapped intellectual talent.</b> When learners are confined to narrow career paths,
                  exam-focused learning, and creativity-stifling systems, societies lose innovators, 
                  problem-solvers, and leaders the world urgently needs. 
                  <br />
                  Knowledge Center exists because this moment demands a <b>different approach to
                  education.</b> One that reconnects learning to purpose, equips young people with skills
                  that matter, and empowers them to see themselves as capable contributors to local 
                  and global progress. What we build today in our classrooms shapes the future of our 
                  communities, our nation, and our place in the world.
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
                To deliver <b>world-class education programs</b> that strengthen academic excellence,
                unlock global opportunities, and develop leaders capable of solving Africa's most 
                pressing challenges.
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
                Re-imagining education to cultivate <b>critical 21st century competencies</b> that empower
                and equip our local learners to compete with their global peers and to become the 
                new drivers of Africa's exponential growth. 
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

        {/* KC STEM Hubs - solid accent colors */}
        <div className="mt-16 md:mt-24">
          <div className="relative overflow-hidden rounded-3xl shadow-xl border border-slate-200 bg-white">
            <div className="relative p-6 md:p-8 lg:p-10">

              {/* Enhanced header with better typography hierarchy */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-kc-blue/40 mb-4"
                >
                  <MapPin className="h-4 w-4 text-kc-blue" />
                  <span className="text-sm font-semibold text-kc-blue">Locations Across Cameroon</span>
                </motion.div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-3">
                  <span className="text-kc-blue">KC STEM Hubs</span> <span className="text-foreground">Across Cameroon</span>
                </h3>

                <p className="text-foreground/80 max-w-2xl mx-auto text-lg leading-relaxed">
                  Discover inquiry-driven learning centers nationwide. Find the hub closest to you and join our community of innovators.
                </p>
              </div>

              {/* Map and Enhanced city chips */}
              <div className="mt-8 grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <CameroonMap />
                </div>

                <div className="order-1 lg:order-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                    {hubsList.map((city, i) => (
                      <motion.div
                        key={city}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        whileHover={{ x: 5 }}
                        className="group flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-kc-blue/30 hover:bg-white transition-all duration-200"
                      >
                        <span className="flex-shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-kc-blue/10 text-kc-blue group-hover:bg-kc-blue group-hover:text-white transition-colors">
                          <MapPin className="h-4 w-4" />
                        </span>
                        <span className="text-sm md:text-base font-semibold text-slate-700 group-hover:text-kc-blue transition-colors">{city}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 rounded-2xl bg-kc-blue/5 border border-kc-blue/10">
                    <h4 className="font-bold text-kc-blue mb-2 flex items-center gap-2">
                      <Rocket className="h-4 w-4" />
                      Expansion in Progress
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      We are rapidly expanding our reach across Cameroon. Our goal is to ensure every young Cameroonian has access to a KC STEM Hub within their region.
                    </p>
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
                  className="group relative inline-flex items-center gap-3 rounded-full px-6 md:px-8 py-3 md:py-3.5 bg-kc-blue text-white font-semibold text-base md:text-lg shadow-md hover:shadow-lg transition-all duration-200 border border-kc-blue/70 hover:bg-kc-red hover:border-kc-red"
                >
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
