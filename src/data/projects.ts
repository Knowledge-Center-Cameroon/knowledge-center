export type Project = {
  slug: string;
  title: string;
  summary: string;
  images: string[];
  features: string[];
  details: string[];
  categories?: string[];
  featured?: boolean;
  externalUrl?: string;
};

import StemImg from "@/assets/stem.jpg";
import SummerImg from "@/assets/summer2.jpeg";
import WeekendImg from "@/assets/weekend.jpeg";
import weekend from "@/assets/weekend_school.jpeg"
import AboutImg from "@/assets/about.jpeg";
import HeroImg from "@/assets/hero-image.jpeg";
import ExtraImg from "@/assets/1747611530465.jpeg";
import Summer from "@/assets/summer5.jpeg"
import Prepa from "@/assets/prepa.jpeg"
import Prepa2 from "@/assets/prepa1.jpeg"
import Prepa3 from "@/assets/prepa3.jpeg"
import image from "@/assets/placeholder.svg";
import KC from "@/assets/logo.png";
import global from "@/assets/global.png"
import stem1 from "@/assets/stem3.jpeg"
import summer3 from "@/assets/summer3.jpg"

export const projects: Project[] = [
  {
    slug: "stem",
    title: "National STEM Olympiad",
    summary:
      "The Knowledge Center National STEM Olympiad is the nation’s most ambitious science education program, built to foster deep conceptual understanding, independent thinking, and creative problem-solving among young learners. It moves students beyond formulaic learning into scientific reasoning, experimentation, and real-world application. At the heart of the initiative is a structured system of challenges that push students to think critically, design solutions, and demonstrate mastery rather than memorize content. The program has consistently produced high-performing students who excel in national competitions and advanced academic pathways. The initiative culminates in the National STEM Convention, an annual, impact-heavy gathering that celebrates excellence and innovation in science education. All STEM laureates are transported on a fully funded trip to the host region, where they participate in a two-day convention designed around learning, recognition, and exposure. The convention brings together top educators, national dignitaries, KC scholars, alumni, and the country’s brightest students. It concludes with a national conference that connects talent, leadership, and opportunity—marking both a celebration and a launchpad for future innovators.",
    images: [StemImg, SummerImg, WeekendImg, stem1],
    features: [
      "Drive for problem solving critical thinking and innovation.",
      "Multi‑disciplinary problems (Math, Physics, Chemistry, Biology)",
      "Emphasis on reasoning, method, and communication",
      "Cerificates of participation to all participant",
      "Mentor clinics and exam‑prep sessions built into the calendar",
      "Cash Prizes, Awards, recognition, for top studens"
    ],
    details: [
      "Eligibility: Form 4 – Upper Sixth (O/L & A/L)",
      "Teams: 3–5 students (solo entries allowed where needed)",
      "Format: Every December",
      "Outcomes: Deeper STEM literacy, critical thinking, and real‑world problem‑solving"
    ]
  },
  {
    slug: "summer-education",
    title: "Summer Education Program",
    summary:
      "The KC Summer Education Program is a two-month, high-intensity learning experience designed to re-ignite curiosity and rebuild mastery in secondary school students. It reimagines what African education can be by replacing rote memorization with applied learning, experimentation, and creative exploration. Through hands-on STEM innovation projects, AI-assisted personalized learning, public speaking, creative writing, and immersive audio-visual lessons powered by simulations, students develop the critical competencies required for today’s globally connected economy. Learners do not just study concepts—they build, test, speak, write, and solve. The program directly responds to the failures of traditional schooling systems that reward recall over understanding and grades over growth. By creating a vibrant, experiential learning environment each summer, KC enables students to fall back in love with learning while acquiring real-world skills in problem-solving, collaboration, communication, and innovation.",
    images: [HeroImg, Summer, SummerImg, ExtraImg, summer3],
    features: [
      "2‑month intensive learning blocks (July–August)",
      "Interactive audio‑visual lectures from passionate educators",
      "Mentorship, orientation, and study planning",
      "Leadership masterclass and creative writing",
      "Tech Boot Camp (Python and AI)",
      "Clubs Activities: Music, Engineering, Creative writing",
      "Sports, recreation, and wellness days",
      "Global Scholars prep: essays, SATs, scholarships"
    ],
    details: [
      "Duration: 2 months (July–August)",
      "Format: Modern classrooms with audio-visual lectures",
      "Extras: Additional Tshirts for all registered students",
      "Outcomes: Academic excellence, Skill acquistion, global stage scholars"
    ]
  },
  {
    slug: "weekend-school",
    title: "KC Weekend School",
    summary:
      "The KC Weekend School is a research-driven remedial education program designed to rebuild academic foundations, close chronic learning gaps, and restore confidence in students. It delivers structured, individualized instruction through small-group learning, continuous assessment, and multi-sensory teaching methods. The program directly addresses the widespread lack of conceptual mastery in science subjects by replacing fragmented private tutoring with a coherent, accountable system. Students are guided to not only meet curriculum standards but exceed them—developing the ability",
    images: [weekend, WeekendImg, AboutImg, ExtraImg],
    features: [
      "Saturday and Sunday options that fit school schedules",
      "Audio‑visual lectures from passionate tutors",
      "Supplementary materials and practice drills",
      "Peer tutoring and collaborative learning",
      "Progress tracking and regular assessments",
      "Mock tests with feedback and improvement plans"
    ],
    details: [
      "When: Sat–Sun blocks",
      "Focus: Reinforcement, revision, and mock tests",
      "Support: 1:1 feedback and tailored study plans",
      "Outcomes: Consistent weekly progress and exam readiness"
    ]
  },
  {
    slug: "global-scholars-program",
    title: "Global Scholars Program",
    summary:
    "The KC Global Scholars Program connects Africa’s highest-potential students to world-class international education opportunities. Through SAT preparation, registration support, and personalized study-abroad consulting, the program levels the international playing field for students who would otherwise lack access, guidance, or exposure. The program is built on a fully integrated support system that helps students prepare, apply, and succeed globally. KC scholars have gone on to attend leading institutions across the United States, Europe, and Africa, including Ivy League universities and top global campuses. Rooted in the belief that talent is evenly distributed but opportunity is not, the Global Scholars Program transforms academic ambition into measurable outcomes. It has established a strong alumni mentorship ecosystem, partnerships with leading secondary schools, and a proven record of significant standardized test score improvements—positioning KC as a trusted bridge between African talent and global opportunity.",
    images: [global, KC, KC],
    features: [
      "Mentorship from seasoned staff and alumni",
      "Application strategy for global opportunities",
      "Career orientation and leadership projects",
      "Training on essays, statements, and interviews",
      "SAT/ACT/TOEFL prep and timelines",
      "Progress tracking across milestones"
    ],
    details: [
      "When: Year‑round with intensive summer bootcamps",
      "Focus: Essays, testing, recommendations, portfolios",
      "Support: 1:1 mentorship and peer reviews",
      "Outcomes: Competitive applications and global placement"
    ]
  },
  {
    slug: "kc-prepa",
    title: "KC Prepa",
    summary:
      "Focused preparation for competitive entrance exams with elite mentoring and proven results.",
    images: [Prepa, Prepa3, Prepa2],
    features: [
      "Audio‑visual lectures from expert tutors",
      "Distinguished scholarly community across the nation",
      "Exceptional success rates with alumni",
      "Career orientation",
      "Career‑defining experiences and field seminars",
      "Tracks: Engineering, Medicine, Agriculture, ICT",
      "Progress tracking and targeted assessments"
    ],
    details: [
      "When: Summer before entrance exams",
      "Focus: Concept mastery, revision, and timed mocks",
      "Support: 1:1 feedback and adaptive study plans",
      "Outcomes: Competitive scores and university readiness"
    ]
  }
];
