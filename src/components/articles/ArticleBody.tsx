import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, FileText } from "lucide-react";
import type { ArticleBlock } from "@/data/articles";

const INLINE_PATTERN =
  /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

const isSafeUrl = (url: string): boolean =>
  /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(url.trim());

/**
 * Renders the small, safe subset of inline Markdown used in article copy:
 * **bold**, *italic*, `code` and [links](https://example.com).
 */
const renderInline = (text: string): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  INLINE_PATTERN.lastIndex = 0;

  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith("**")) {
      nodes.push(<strong key={`strong-${key++}`}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      nodes.push(<em key={`em-${key++}`}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith("`")) {
      nodes.push(<code key={`code-${key++}`}>{token.slice(1, -1)}</code>);
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const [, label, url] = link;
        if (!isSafeUrl(url)) {
          nodes.push(token);
        } else if (url.startsWith("/") && !url.startsWith("//")) {
          nodes.push(
            <Link key={`link-${key++}`} to={url}>
              {label}
            </Link>,
          );
        } else {
          const external = /^https?:\/\//i.test(url);
          nodes.push(
            <a
              key={`link-${key++}`}
              href={url}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {label}
            </a>,
          );
        }
      } else {
        nodes.push(token);
      }
    }

    lastIndex = INLINE_PATTERN.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
};

type ArticleBodyProps = {
  blocks: ArticleBlock[];
  /** Heading anchors keyed by the block index they belong to. */
  headingIds?: Map<number, string>;
};

const ArticleBody: React.FC<ArticleBodyProps> = ({ blocks, headingIds }) => (
  <div className="kc-article-prose">
    {blocks.map((block, index) => {
      switch (block.type) {
        case "paragraph":
          return (
            <p key={index} className={index === 0 ? "kc-opening" : undefined}>
              {renderInline(block.text)}
            </p>
          );

        case "heading": {
          const id = headingIds?.get(index);
          if (block.level === 3) {
            return (
              <h3 key={index} id={id}>
                {block.text}
              </h3>
            );
          }
          return (
            <h2 key={index} id={id}>
              {block.text}
            </h2>
          );
        }

        case "image":
          return (
            <figure key={index} className="my-10">
              <img
                src={block.src}
                alt={block.alt}
                loading="lazy"
                decoding="async"
                className="kc-inline-image"
              />
              {(block.caption || block.credit) && (
                <figcaption className="mt-3 flex flex-col gap-1 text-[0.78rem] leading-relaxed text-article-muted sm:flex-row sm:items-baseline sm:justify-between">
                  {block.caption ? <span>{block.caption}</span> : <span />}
                  {block.credit ? (
                    <span className="shrink-0 uppercase tracking-[0.14em]">
                      {block.credit}
                    </span>
                  ) : null}
                </figcaption>
              )}
            </figure>
          );

        case "quote":
          return (
            <blockquote key={index}>
              <p>&ldquo;{renderInline(block.text)}&rdquo;</p>
              {(block.attribution || block.role) && (
                <footer className="mt-4 font-article-ui text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-article-muted">
                  {block.attribution ? `— ${block.attribution}` : null}
                  {block.attribution && block.role ? ", " : null}
                  {block.role}
                </footer>
              )}
            </blockquote>
          );

        case "list": {
          const items = block.items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item)}</li>
          ));
          return block.ordered ? (
            <ol key={index}>{items}</ol>
          ) : (
            <ul key={index}>{items}</ul>
          );
        }

        case "callout":
          return (
            <aside
              key={index}
              className="my-10 border border-article-rule border-l-2 border-l-kc-blue bg-white px-5 py-5 sm:px-7 sm:py-6"
            >
              {block.title ? (
                <p className="font-article-ui text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-kc-blue">
                  {block.title}
                </p>
              ) : null}
              <p className="mt-2 font-article-body text-[1rem] leading-relaxed text-article-soft-ink sm:text-[1.0625rem]">
                {renderInline(block.text)}
              </p>
            </aside>
          );

        case "download":
          return (
            <aside key={index} className="kc-download">
              <p className="kc-download__label">
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                {block.label}
              </p>
              <p className="kc-download__title">{block.title}</p>
              {block.description ? (
                <p className="kc-download__desc">{block.description}</p>
              ) : null}
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a
                  href={block.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kc-download__action"
                >
                  Read the full report
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                {block.meta ? (
                  <span className="kc-download__meta">{block.meta}</span>
                ) : null}
              </div>
            </aside>
          );

        case "divider":
          return <hr key={index} />;

        default:
          return null;
      }
    })}
  </div>
);

export default ArticleBody;
