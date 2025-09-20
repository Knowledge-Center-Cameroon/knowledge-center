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

export const projects: Project[] = [
  {
    slug: "stem-education",
    title: "National STEM Competition",
    summary:
      "Annual country‑wide contest that rewards clear thinking over memorization. Students tackle authentic, multi‑step STEM problems—testing ideas, defending methods, and connecting classroom theory to real‑world impact.",
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
      "Outcomes: Deeper STEM literacy and real‑world problem‑solving confidence"
    ]
  },
  {
    slug: "summer-education",
    title: "Summer Education Program",
    summary:
      "Intensive summer sessions designed to accelerate learning and provide enrichment and useful skills during school breaks.",
    images: [SummerImg, Summer, HeroImg],
    features: [
      "2-month intensive learning program",
      "Interactive audio-visual lectures",
      "Beyond classroom knowledge",
      "Mentorship and orientation",
      "Leadership masterclass",
      "Tech Boot Camp",
      "Club Activities",
      "Sports and recreation",
      "Global scholar program"
    ],
    details: [
      "Duration: 2 months (July–August)",
      "Format: Modern classrooms with audio-visual lectures",
      "Extras: Industry talks and campus tours",
      "Outcome: Portfolio-ready projects"
    ]
  },
  {
    slug: "weekend-school",
    title: "Weekend School",
    summary:
      "Flexible weekend classes for students who need additional support or want to advance their knowledge.",
    images: [WeekendImg, AboutImg, ExtraImg],
    features: [
      "Saturday and Sunday class options",
      "Flexible scheduling to accommodate regular school",
      "Academically distinguished students",
      "Audio-visual lectures from passionate tutors",
      "Supplementary materials and practice exercises",
      "Peer tutoring and collaborative learning",
      "Progress tracking and regular assessments"
    ],
    details: [
      "When: Sat–Sun blocks",
      "Focus: Reinforcement + revision + mock tests",
      "Support: 1:1 feedback and study plans",
      "Outcome: Consistent weekly progress"
    ]
  },
  {
    slug: "KC Prepa",
    title: "KC Prepa",
    summary:
      "The Knowledge Center Prepa for Competitive Entrance Exams",
    images: [Prepa, AboutImg, ExtraImg],
    features: [
      "Audio-visual lectures from passionate tutors",
      "Most distinguisehd scholarly community across the nation",
      "Ubbelievable success rates",
      "Career-defining experiences",
      "Engineering, Medicine, Agriculture",
      "Progress tracking and regular assessments"
    ],
    details: [
      "When: Summer before entarnce exams",
      "Focus: Reinforcement + revision + mock tests",
      "Support: 1:1 feedback and study plans",
      "Outcome: Consistent weekly progress"
    ]
  }
];
