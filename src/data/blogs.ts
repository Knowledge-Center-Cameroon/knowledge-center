import coverStem from "@/assets/stem.jpg";
import coverSummer from "@/assets/summer2.jpeg";
import coverWhy from "@/assets/hero-image.jpeg";
import  logo from "@/assets/kc_round_trans.png"
export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string; // ISO string
  author?: string;
  cover?: string;
  dp?: string;
  tags?: string[];
};

// Temporary seed data. Replace or extend with real content.
export const blogPosts: BlogPost[] = [
  {
    id: "kc-stem-competition-2024",
    title: "KC STEM Competition 2024: Highlights and Winners",
    excerpt:
      "A recap of the KC STEM Competition 2024: projects, winners, and lessons learned.",
    date: "2024-12-20T10:00:00.000Z",
    author: "KC Editorial Team",
    cover: coverStem,
    tags: ["STEM", "Competition", "Education"],
    dp: logo,
  },
  {
    id: "summer-program-2024-wrap",
    title: "Summer Program 2024: Building Skills Beyond the Classroom",
    excerpt:
      "Hands-on learning, leadership classes, and tech bootcamps—here's what students achieved this summer.",
    date: "2024-09-01T09:00:00.000Z",
    author: "KC Editorial Team",
    cover: coverSummer,
    tags: ["Summer Program", "Skills", "Bootcamp"],
    dp: logo,
  },
  {
    id: "why-stem-matters",
    title: "Why STEM Education Matters for Cameroon",
    excerpt:
      "How STEM education empowers youth, fosters innovation, and drives national development.",
    date: "2024-05-12T08:30:00.000Z",
    author: "KC Editorial Team",
    cover: coverWhy,
    tags: ["STEM", "Cameroon", "Innovation"],
    dp: logo,
  },
];
