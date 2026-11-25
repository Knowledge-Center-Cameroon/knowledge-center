import React from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Link2,
  Linkedin,
  Share2,
} from "lucide-react";
import "@/styles/articles.css";
import ArticleBody from "@/components/articles/ArticleBody";
import ArticleByline, { AuthorAvatar } from "@/components/articles/ArticleByline";
import ArticleCard from "@/components/articles/ArticleCard";
import {
  collectHeadings,
  estimateReadingTime,
  formatArticleDate,
  getArticleBySlug,
  getRelatedArticles,
  type Article,
} from "@/data/articles";
import { useArticleSeo } from "@/hooks/useArticleSeo";
import { useToast } from "@/components/ui/use-toast";

const SITE_URL = "https://kcedu.org";

const buildArticleJsonLd = (article: Article) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.summary,
  author: {
    "@type": "Person",
    name: article.author.name,
    ...(article.author.role ? { jobTitle: article.author.role } : {}),
  },
  datePublished: article.publishedAt,
  dateModified: article.updatedAt ?? article.publishedAt,
  ...(article.cover
    ? { image: [`${SITE_URL}${article.cover.src}`] }
    : {}),
  publisher: {
    "@type": "Organization",
    name: "Knowledge Center Cameroon",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${SITE_URL}/articles/${article.slug}`,
  },
});

const NotFoundArticle: React.FC = () => (
  <div className="kc-articles flex min-h-[70vh] items-center justify-center px-5">
    <div className="max-w-md text-center">
      <p className="kc-eyebrow text-kc-blue">KC Articles</p>
      <h1 className="mt-4 font-article-display text-3xl font-medium tracking-[-0.03em] text-article-ink md:text-4xl">
        This article could not be found.
      </h1>
      <p className="mt-4 font-article-body text-base leading-relaxed text-article-muted">
        The piece may have moved, or it may not be published yet. Return to the
        journal to see what is available.
      </p>
      <Link
        to="/articles"
        className="mt-7 inline-flex items-center gap-2 border-b border-kc-blue pb-1 font-article-ui text-sm font-semibold text-kc-blue no-underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to KC Articles
      </Link>
    </div>
  </div>
);

const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();

  const article = React.useMemo(
    () => (slug ? getArticleBySlug(slug) : undefined),
    [slug],
  );

  const headings = React.useMemo(
    () => (article ? collectHeadings(article.content) : []),
    [article],
  );

  const headingIds = React.useMemo(
    () => new Map(headings.map((heading) => [heading.blockIndex, heading.id])),
    [headings],
  );

  const related = React.useMemo(
    () => (article ? getRelatedArticles(article, 3) : []),
    [article],
  );

  const readingTime = article ? estimateReadingTime(article) : 0;

  useArticleSeo({
    title: article
      ? `${article.title} — KC Articles | Knowledge Center`
      : "KC Articles | Knowledge Center",
    description:
      article?.summary ??
      "Research, reflection, and ideas from Knowledge Center scholars in Cameroon.",
    url: article
      ? `${SITE_URL}/articles/${article.slug}`
      : `${SITE_URL}/articles`,
    image: article?.cover
      ? `${SITE_URL}${article.cover.src}`
      : `${SITE_URL}/logo.jpeg`,
  });

  if (!article) return <NotFoundArticle />;

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `${SITE_URL}/articles/${article.slug}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied",
        description: "The article link is ready to share.",
      });
    } catch {
      toast({
        title: "Could not copy link",
        description: "Please copy the address from your browser instead.",
        variant: "destructive",
      });
    }
  };

  const nativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") await copyLink();
      }
      return;
    }
    await copyLink();
  };

  const xShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    article.title,
  )}&url=${encodeURIComponent(shareUrl)}`;
  const linkedInShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareUrl,
  )}`;

  return (
    <div className="kc-articles min-h-screen pt-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildArticleJsonLd(article)),
        }}
      />

      {/* Journal rule */}
      <div className="border-b border-article-rule">
        <div className="container mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
          <Link
            to="/articles"
            className="kc-eyebrow inline-flex items-center gap-2 text-kc-blue no-underline transition-colors hover:text-kc-blue-dark"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            KC Articles
          </Link>
          <span className="kc-eyebrow">{article.category}</span>
        </div>
      </div>

      {/* Header */}
      <header className="container mx-auto max-w-4xl px-5 pt-12 md:pt-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="kc-eyebrow text-kc-blue">{article.category}</span>
            {article.featured ? (
              <>
                <span aria-hidden="true" className="text-article-rule-strong">
                  ·
                </span>
                <span className="kc-eyebrow">Featured</span>
              </>
            ) : null}
          </div>

          <h1 className="kc-article-title mt-5">{article.title}</h1>

          <p className="kc-dek mt-6 max-w-3xl">{article.summary}</p>

          <div className="mt-8 border-y border-article-rule py-5">
            <ArticleByline
              author={article.author}
              publishedAt={article.publishedAt}
              readingTime={readingTime}
              size="lg"
            />
            {article.mentor ? (
              <p className="mt-4 border-t border-article-rule pt-3 font-article-ui text-[0.7rem] uppercase tracking-[0.14em] text-article-muted">
                Research mentor · {article.mentor}
              </p>
            ) : null}
          </div>
        </motion.div>
      </header>

      {/* Cover */}
      {article.cover ? (
        <motion.figure
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="container mx-auto mt-10 max-w-6xl px-5 lg:px-8"
        >
          <img
            src={article.cover.src}
            alt={article.cover.alt}
            className="max-h-[640px] w-full border border-article-rule bg-article-cream object-cover"
            decoding="async"
          />
          {article.cover.caption || article.cover.credit ? (
            <figcaption className="mt-3 flex flex-col gap-1 font-article-ui text-[0.78rem] leading-relaxed text-article-muted sm:flex-row sm:items-baseline sm:justify-between">
              <span className="max-w-3xl">
                {article.cover.caption ?? article.cover.alt}
              </span>
              {article.cover.credit ? (
                <span className="shrink-0 uppercase tracking-[0.14em]">
                  {article.cover.credit}
                </span>
              ) : null}
            </figcaption>
          ) : null}
        </motion.figure>
      ) : null}

      {/* Body + table of contents */}
      <div className="container mx-auto max-w-6xl px-5 pb-16 pt-12 md:pt-16 lg:px-8">
        <div className="grid gap-12 xl:mx-auto xl:max-w-[1010px] xl:grid-cols-[200px_minmax(0,760px)]">
          <aside className="hidden xl:block" aria-label="Article navigation">
            <div className="sticky top-28">
              {headings.length > 1 ? (
                <>
                  <p className="kc-eyebrow">In this article</p>
                  <nav className="kc-toc mt-4" aria-label="Table of contents">
                    {headings.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        data-level={heading.level}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </>
              ) : null}

              <div className="mt-9 border-t border-article-rule pt-5">
                <p className="kc-eyebrow">Share</p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copyLink}
                    aria-label="Copy article link"
                    className="flex h-8 w-8 items-center justify-center border border-article-rule text-article-muted transition-colors hover:border-kc-blue hover:text-kc-blue"
                  >
                    <Link2 className="h-3.5 w-3.5" />
                  </button>
                  <a
                    href={xShare}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on X"
                    className="flex h-8 w-8 items-center justify-center border border-article-rule font-article-ui text-[0.7rem] font-semibold text-article-muted no-underline transition-colors hover:border-kc-blue hover:text-kc-blue"
                  >
                    X
                  </a>
                  <a
                    href={linkedInShare}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on LinkedIn"
                    className="flex h-8 w-8 items-center justify-center border border-article-rule text-article-muted no-underline transition-colors hover:border-kc-blue hover:text-kc-blue"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </aside>

          <article>
            <ArticleBody blocks={article.content} headingIds={headingIds} />

            {/* References */}
            {article.references && article.references.length > 0 ? (
              <section
                aria-labelledby="article-references"
                className="mt-14 border-t border-article-rule pt-8"
              >
                <h2
                  id="article-references"
                  className="font-article-ui text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-article-muted"
                >
                  References &amp; further reading
                </h2>
                <ol className="mt-5 space-y-4">
                  {article.references.map((reference, index) => (
                    <li
                      key={`${reference.title}-${index}`}
                      className="grid grid-cols-[2rem_1fr] gap-2"
                    >
                      <span className="pt-0.5 font-article-ui text-[0.62rem] font-semibold tracking-[0.08em] text-article-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="font-article-body text-[0.9rem] leading-relaxed text-article-muted">
                        {reference.url ? (
                          <a
                            href={reference.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-article-ink underline decoration-article-rule-strong underline-offset-2 transition-colors hover:text-kc-blue"
                          >
                            {reference.title}
                          </a>
                        ) : (
                          <span className="font-medium text-article-ink">
                            {reference.title}
                          </span>
                        )}
                        {reference.authors ? <span>. {reference.authors}</span> : null}
                        {reference.publication ? (
                          <span className="italic">. {reference.publication}</span>
                        ) : null}
                        {reference.year ? <span>, {reference.year}</span> : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            {/* Tags */}
            {article.tags && article.tags.length > 0 ? (
              <div className="mt-10 flex flex-wrap items-center gap-2">
                <span className="kc-eyebrow mr-1">Filed under</span>
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-article-rule px-2.5 py-1 font-article-ui text-[0.68rem] font-medium uppercase tracking-[0.12em] text-article-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {/* Share row */}
            <div className="mt-10 flex flex-wrap items-center gap-3 border-y border-article-rule py-5">
              <span className="kc-eyebrow mr-1">Share this article</span>
              <button
                type="button"
                onClick={nativeShare}
                className="inline-flex items-center gap-2 font-article-ui text-xs font-medium text-article-ink transition-colors hover:text-kc-blue"
              >
                <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                Share
              </button>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-2 font-article-ui text-xs font-medium text-article-ink transition-colors hover:text-kc-blue"
              >
                <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                Copy link
              </button>
              <a
                href={xShare}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-article-ui text-xs font-medium text-article-ink no-underline transition-colors hover:text-kc-blue"
              >
                Post on X
              </a>
              <a
                href={linkedInShare}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-article-ui text-xs font-medium text-article-ink no-underline transition-colors hover:text-kc-blue"
              >
                <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
                LinkedIn
              </a>
            </div>

            {/* Author */}
            <section className="mt-14 border-t border-article-rule pt-9">
              <p className="kc-eyebrow text-kc-blue">About the author</p>
              <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-start">
                <AuthorAvatar author={article.author} size="xl" />
                <div className="min-w-0">
                  <h2 className="font-article-display text-2xl font-semibold tracking-[-0.02em] text-article-ink">
                    {article.author.name}
                  </h2>
                  {article.author.role ? (
                    <p className="mt-1 font-article-ui text-xs uppercase tracking-[0.14em] text-article-muted">
                      {article.author.role}
                    </p>
                  ) : null}
                  {article.author.bio ? (
                    <p className="mt-4 font-article-body text-[1rem] leading-relaxed text-article-muted">
                      {article.author.bio}
                    </p>
                  ) : null}
                  {article.author.links && article.author.links.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                      {article.author.links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          className="inline-flex items-center gap-1 font-article-ui text-xs font-semibold text-kc-blue no-underline transition-colors hover:text-kc-blue-dark"
                        >
                          {link.label}
                          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </section>

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/articles"
                className="inline-flex items-center gap-2 font-article-ui text-sm font-semibold text-kc-blue no-underline"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                All articles
              </Link>
              <span className="font-article-ui text-[0.68rem] text-article-muted">
                Published {formatArticleDate(article.publishedAt)}
              </span>
            </div>
          </article>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 ? (
        <section className="border-t border-article-rule bg-article-cream/50">
          <div className="container mx-auto max-w-6xl px-5 py-14 md:py-16 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-article-rule pb-4">
              <div>
                <p className="kc-eyebrow text-kc-blue">Keep reading</p>
                <h2 className="mt-2 font-article-display text-3xl font-medium tracking-[-0.03em] text-article-ink">
                  More from KC Articles
                </h2>
              </div>
              <Link
                to="/articles"
                className="inline-flex items-center gap-2 font-article-ui text-xs font-semibold uppercase tracking-[0.14em] text-kc-blue no-underline"
              >
                All articles
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-9 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ArticleCard key={item.slug} article={item} compact />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default ArticleDetailPage;
