import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Globe2, PenLine } from "lucide-react";
import "@/styles/articles.css";
import ArticleCard from "@/components/articles/ArticleCard";
import {
  getArticleCategories,
  getPublishedArticles,
} from "@/data/articles";
import { useArticleSeo } from "@/hooks/useArticleSeo";
import { cn } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

const editorialPillars = [
  {
    icon: BookOpen,
    label: "Research & inquiry",
    text:
      "Short, accessible accounts of the questions KC scholars are investigating — and what they are finding.",
  },
  {
    icon: PenLine,
    label: "Scholar voices",
    text:
      "First-person writing about learning, ambition, difficulty, and discovery from inside the KC community.",
  },
  {
    icon: Globe2,
    label: "Local to global",
    text:
      "Perspectives from Cameroon and beyond, connecting classroom work to the wider world of ideas.",
  },
];

const ArticlesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState<string>("All");
  const publishedArticles = React.useMemo(() => getPublishedArticles(), []);
  const categories = React.useMemo(() => getArticleCategories(), []);

  const filtered =
    activeCategory === "All"
      ? publishedArticles
      : publishedArticles.filter(
          (article) => article.category === activeCategory,
        );

  const monthYear = new Date().toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  useArticleSeo({
    title: "KC Articles | Knowledge Center",
    description:
      "Research, reflection, and ideas from Knowledge Center scholars in Cameroon — essays, research notes, and student voices from the KC community.",
    url: "https://kcedu.org/articles",
    image: "https://kcedu.org/logo.jpeg",
    type: "website",
  });

  return (
    <div className="kc-articles min-h-screen pt-6">
      {/* Masthead rule */}
      <div className="border-b border-article-rule">
        <div className="container mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
          <span className="kc-eyebrow text-kc-blue">
            Knowledge Center · Editorial
          </span>
          <span className="kc-eyebrow">{monthYear}</span>
        </div>
      </div>

      {/* Masthead */}
      <section className="kc-masthead-wash border-b border-article-rule">
        <div className="container mx-auto max-w-6xl px-5 py-14 md:py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-end">
            <div>
              <p className="kc-eyebrow text-kc-blue">
                Ideas · Research · Reflection
              </p>
              <h1 className="kc-masthead-title mt-4">KC Articles</h1>
              <p className="kc-dek mt-6 max-w-2xl">
                A journal for the Knowledge Center community — essays, research
                notes, and reflections written by KC scholars in Cameroon and
                around the world.
              </p>
            </div>

            <div className="hidden border-l border-article-rule pl-6 lg:block">
              <p className="kc-eyebrow">Published by</p>
              <p className="mt-2 font-article-display text-xl leading-snug text-article-ink">
                Knowledge Center
              </p>
              <p className="mt-1 font-article-ui text-xs text-article-muted">
                Buea, Cameroon
              </p>
              <div className="mt-5 h-px w-12 bg-kc-blue" />
              <p className="mt-5 font-article-body text-sm italic leading-relaxed text-article-muted">
                “Ideas become contributions when they are shared.”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* All articles — every piece is displayed with equal weight */}
      <motion.section
        {...fadeUp}
        className="container mx-auto max-w-6xl px-5 pt-12 pb-14 md:pt-16 md:pb-20 lg:px-8"
      >
        <div className="flex flex-col gap-6 border-b border-article-rule pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="kc-eyebrow text-kc-blue">The journal</p>
              <h2 className="mt-2 font-article-display text-3xl font-medium tracking-[-0.03em] text-article-ink md:text-4xl">
                All articles
              </h2>
            </div>

            {publishedArticles.length > 0 ? (
              <div className="flex flex-wrap gap-x-5 gap-y-2" role="group" aria-label="Filter articles by topic">
                {["All", ...categories].map((category) => {
                  const active = activeCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      aria-pressed={active}
                      className={cn(
                        "border-b-2 pb-1 font-article-ui text-[0.68rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-200",
                        active
                          ? "border-kc-blue text-kc-blue"
                          : "border-transparent text-article-muted hover:border-article-rule-strong hover:text-article-ink",
                      )}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          {publishedArticles.length === 0 ? (
            <div className="mt-10 border border-dashed border-article-rule px-6 py-16 text-center md:py-20">
              <p className="font-article-display text-2xl font-medium text-article-ink md:text-3xl">
                The next articles are being prepared.
              </p>
              <p className="mx-auto mt-3 max-w-xl font-article-body text-base leading-relaxed text-article-muted">
                KC Articles is new. The first scholar pieces are in editing now —
                check back soon, or send us a pitch if you have something to say.
              </p>
              <a
                href="mailto:info@kcedu.org?subject=KC%20Articles%20pitch"
                className="mt-6 inline-flex items-center gap-2 font-article-ui text-sm font-semibold text-kc-blue no-underline"
              >
                Submit a pitch
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          ) : filtered.length === 0 ? (
            <p className="mt-10 font-article-body text-base text-article-muted">
              No articles in this topic yet.
            </p>
          ) : (
            <div className="mt-9 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </motion.section>

      {/* Editorial pillars */}
      <section className="border-y border-article-rule bg-article-cream/60">
        <div className="container mx-auto max-w-6xl px-5 py-14 md:py-16 lg:px-8">
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {editorialPillars.map((pillar) => (
              <div key={pillar.label}>
                <span className="flex h-10 w-10 items-center justify-center border border-article-rule-strong bg-article-paper text-kc-blue">
                  <pillar.icon className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <h2 className="mt-5 font-article-display text-xl font-semibold tracking-[-0.02em] text-article-ink">
                  {pillar.label}
                </h2>
                <p className="mt-2 font-article-body text-[0.97rem] leading-relaxed text-article-muted">
                  {pillar.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contribute */}
      <section className="container mx-auto max-w-6xl px-5 py-14 md:py-20 lg:px-8">
        <div className="grid gap-8 border-l-2 border-kc-blue pl-6 md:grid-cols-[1fr_auto] md:items-end md:pl-10">
          <div>
            <p className="kc-eyebrow text-kc-blue">Contribute</p>
            <h2 className="mt-3 font-article-display text-3xl font-medium tracking-[-0.03em] text-article-ink md:text-[2.6rem]">
              Have an idea worth sharing?
            </h2>
            <p className="mt-4 max-w-2xl font-article-body text-base leading-relaxed text-article-muted md:text-lg">
              KC Articles is written by KC scholars, alumni, mentors, and
              partners. Send a short pitch to the editors and we will help you
              shape it into a finished piece.
            </p>
          </div>

          <a
            href="mailto:info@kcedu.org?subject=KC%20Articles%20pitch"
            className="inline-flex w-fit items-center gap-2 border-b border-kc-blue pb-1 font-article-ui text-sm font-semibold text-kc-blue no-underline transition-colors hover:text-kc-blue-dark"
          >
            Submit a pitch
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default ArticlesPage;
