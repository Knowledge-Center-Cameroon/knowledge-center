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

export const projects: Project[] = [
  {
    slug: "stem-education",
    title: "National STEM Competition",
    summary:
      "Our flagship program focusing on Science, Technology, Engineering, and Mathematics education for young Cameroonians.",
    images: [StemImg, SummerImg, WeekendImg],
    features: [
      "National exam, across the country",
      "Problem solving, innovation and creativity skills",
      "Mentorship and academic guidance",
      "Preparation for GCE examinations and beyond",
      "Project-based learning with real-world applications",
      "Global opportunities"
    ],
    details: [
      "Audience: Form 4–Upper Sixth (O/L & A/L)",
      "Schedule: Annually, every December",
      "Support: Mentorship + exam-prep clinics",
      "Outcomes: Improved GCE performance and deeper STEM literacy"
    ]
  },
  {
    slug: "summer-education",
    title: "Summer Education Program",
    summary:
      "Intensive summer sessions designed to accelerate learning and provide enrichment and useful skills during school breaks.",
    images: [SummerImg, AboutImg, HeroImg],
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
  }
];
