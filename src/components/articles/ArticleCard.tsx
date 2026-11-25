import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { AuthorAvatar } from "@/components/articles/ArticleByline";
import {
  estimateReadingTime,
  formatArticleDate,
  type Article,
} from "@/data/articles";
import { cn } from "@/lib/utils";

type ArticleCardProps = {
  article: Article;
  className?: string;
  /** Hide the summary on tighter layouts such as the related-articles rail. */
  compact?: boolean;
};

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  className,
  compact = false,
}) => (
  <article className={cn("group", className)}>
    <Link
      to={`/articles/${article.slug}`}
      className="block text-article-ink no-underline focus-visible:outline-none"
    >
      <div className="relative mb-5 aspect-[16/10] overflow-hidden border border-article-rule bg-article-cream">
        {article.cover ? (
          <div className="kc-image-zoom h-full w-full">
            <img
              src={article.cover.src}
              alt={article.cover.alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-end bg-article-cream p-5">
            <span className="font-article-display text-3xl italic leading-none text-kc-blue/35">
              {article.category}
            </span>
          </div>
        )}
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-article-paper/95 text-article-ink shadow-sm transition-all duration-300 group-hover:bg-kc-blue group-hover:text-white">
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="font-article-ui text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-kc-blue">
          {article.category}
        </span>
        <span aria-hidden="true" className="text-article-rule-strong">
          ·
        </span>
        <time
          dateTime={article.publishedAt}
          className="font-article-ui text-[0.68rem] text-article-muted"
        >
          {formatArticleDate(article.publishedAt)}
        </time>
      </div>

      <h3 className="kc-card-title mt-3 transition-colors duration-300 group-hover:text-kc-blue">
        {article.title}
      </h3>

      {!compact ? (
        <p className="mt-3 line-clamp-3 font-article-body text-[0.98rem] leading-relaxed text-article-muted">
          {article.summary}
        </p>
      ) : null}

      <div className="mt-5 flex items-center gap-3 border-t border-article-rule pt-4">
        <AuthorAvatar author={article.author} size="sm" />
        <span className="min-w-0 truncate font-article-ui text-xs font-medium text-article-ink">
          {article.author.name}
        </span>
        <span className="ml-auto shrink-0 font-article-ui text-[0.68rem] text-article-muted">
          {estimateReadingTime(article)} min
        </span>
      </div>
    </Link>
  </article>
);

export default ArticleCard;
