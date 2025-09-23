export type Project = {
  slug: string;
  title: string;
  summary: string;
  images: string[];
  features: string[];
  details: string[];
};

import StemImg from "@/assets/stem.jpg";
import SummerImg from "@/assets/summer2.jpeg";
import WeekendImg from "@/assets/weekend.jpeg";
import AboutImg from "@/assets/about.jpeg";
import HeroImg from "@/assets/hero-image.jpeg";
import ExtraImg from "@/assets/1747611530465.jpeg";
import Summer from "@/assets/summer5.jpeg"
import Prepa from "@/assets/prepa.jpeg"
import Prepa2 from "@/assets/prepa2.jpeg"
import image from "@/assets/placeholder.svg";
import KC from "@/assets/logo.png";

export const projects: Project[] = [
  {
    slug: "stem-education",
    title: "National STEM Competition",
    summary:
      "A country‑wide contest that rewards clear thinking over memorization. Students tackle authentic, multi‑step STEM problems—testing ideas, defending methods, and connecting classroom theory to real‑world impact.",
    images: [StemImg, SummerImg, WeekendImg],
    features: [
      "National qualifiers leading to a December grand final",
      "Multi‑disciplinary problems (Math, Physics, Chemistry, Biology, Computing)",
      "Emphasis on reasoning, method, and communication",
      "Team challenges that reward collaboration and creativity",
      "Mentor clinics and exam‑prep sessions built into the calendar",
      "Prizes, recognition, and follow‑on mentorship opportunities"
    ],
    details: [
      "Eligibility: Form 4 – Upper Sixth (O/L & A/L)",
      "Teams: 3–5 students (solo entries allowed where needed)",
      "Format: Regional qualifiers (Oct–Nov), National finals (December)",
      "Judging: Clarity of thought, defensible methods, teamwork, innovation",
      "Outcomes: Deeper STEM literacy, presentation confidence, and real‑world problem‑solving"
    ]
  },
  {
    slug: "summer-education",
    title: "Summer Education Program",
    summary:
      "Intensive summer sessions designed to accelerate learning, build portfolios, and grow practical skills during school breaks.",
    images: [SummerImg, Summer, HeroImg],
    features: [
      "2‑month intensive learning blocks (July–August)",
      "Interactive audio‑visual lectures with hands‑on labs",
      "Mentorship, orientation, and study planning",
      "Leadership masterclass and public speaking",
      "Tech Boot Camp (coding, data, engineering demos)",
      "Clubs, hack‑days, and project showcases",
      "Sports, recreation, and wellness days",
      "Global Scholars prep: essays, SATs, scholarships"
    ],
    details: [
      "Duration: 2 months (July–August)",
      "Format: Modern classrooms with audio-visual lectures",
      "Extras: Industry talks and campus tours",
      "Outcomes: Portfolio‑ready projects, confidence, and networks"
    ]
  },
  {
    slug: "weekend-school",
    title: "Weekend School",
    summary:
      "Flexible weekend classes for reinforcement, acceleration, and exam mastery with personalized coaching.",
    images: [WeekendImg, AboutImg, ExtraImg],
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
    slug: "kc-prepa",
    title: "KC Prepa",
    summary:
      "Focused preparation for competitive entrance exams with elite mentoring and proven results.",
    images: [Prepa, AboutImg, ExtraImg],
    features: [
      "Audio‑visual lectures from expert tutors",
      "Distinguished scholarly community across the nation",
      "Exceptional success rates with alumni mentorship",
      "Career orientation and interview prep",
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
  },
  {
    slug: "global-scholars-program",
    title: "Global Scholars Program",
    summary:
      "We prepare scholars for opportunities beyond borders—competitive scholarships, exchange programs, and global leadership.",
    images: [image, KC, KC],
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
  }
];
