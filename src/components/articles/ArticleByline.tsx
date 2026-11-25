import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  formatArticleDate,
  type ArticleAuthor,
} from "@/data/articles";

const avatarSizes = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-16 w-16",
  xl: "h-20 w-20 sm:h-24 sm:w-24",
} as const;

const fallbackTextSizes = {
  sm: "text-[11px]",
  md: "text-xs",
  lg: "text-base",
  xl: "text-lg",
} as const;

const authorInitials = (author: ArticleAuthor): string => {
  if (author.initials) return author.initials;
  return author.name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export const AuthorAvatar: React.FC<{
  author: ArticleAuthor;
  size?: keyof typeof avatarSizes;
  className?: string;
}> = ({ author, size = "md", className }) => (
  <Avatar
    className={cn(
      "shrink-0 ring-1 ring-article-rule ring-offset-2 ring-offset-article-paper",
      avatarSizes[size],
      className,
    )}
  >
    {author.avatar ? (
      <AvatarImage
        src={author.avatar}
        alt={`Portrait of ${author.name}`}
        className="object-cover"
      />
    ) : null}
    <AvatarFallback
      className={cn(
        "bg-kc-blue font-article-ui font-semibold text-white",
        fallbackTextSizes[size],
      )}
    >
      {authorInitials(author)}
    </AvatarFallback>
  </Avatar>
);

type ArticleBylineProps = {
  author: ArticleAuthor;
  publishedAt?: string;
  readingTime?: number;
  size?: keyof typeof avatarSizes;
  showRole?: boolean;
  className?: string;
};

const ArticleByline: React.FC<ArticleBylineProps> = ({
  author,
  publishedAt,
  readingTime,
  size = "md",
  showRole = true,
  className,
}) => (
  <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-3", className)}>
    <div className="flex items-center gap-3">
      <AuthorAvatar author={author} size={size} />
      <div className="min-w-0">
        <p className="font-article-ui text-sm font-semibold leading-snug text-article-ink">
          {author.name}
        </p>
        {showRole && author.role ? (
          <p className="mt-0.5 font-article-ui text-xs leading-snug text-article-muted">
            {author.role}
          </p>
        ) : null}
      </div>
    </div>

    {(publishedAt || readingTime) && (
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-article-ui text-xs text-article-muted sm:ml-auto">
        {publishedAt ? (
          <time dateTime={publishedAt}>{formatArticleDate(publishedAt)}</time>
        ) : null}
        {publishedAt && readingTime ? (
          <span aria-hidden="true" className="text-article-rule-strong">
            ·
          </span>
        ) : null}
        {readingTime ? <span>{readingTime} min read</span> : null}
      </div>
    )}
  </div>
);

export default ArticleByline;
