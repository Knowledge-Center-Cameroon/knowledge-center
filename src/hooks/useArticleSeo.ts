import { useEffect } from "react";

type ArticleSeoOptions = {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: "article" | "website";
};

type Restore = () => void;

const upsertMeta = (
  selector: string,
  attribute: "name" | "property",
  key: string,
  content: string,
): Restore => {
  const existing = document.head.querySelector<HTMLMetaElement>(selector);
  const previous = existing?.getAttribute("content") ?? null;

  const element =
    existing ??
    (() => {
      const meta = document.createElement("meta");
      meta.setAttribute(attribute, key);
      document.head.appendChild(meta);
      return meta;
    })();

  element.setAttribute("content", content);

  return () => {
    if (existing) {
      if (previous !== null) element.setAttribute("content", previous);
    } else {
      element.remove();
    }
  };
};

/**
 * Article-specific metadata. Keeps the title, canonical URL, and social
 * preview tags in sync with the piece being read, and restores them when the
 * reader leaves the article.
 */
export const useArticleSeo = ({
  title,
  description,
  url,
  image,
  type = "article",
}: ArticleSeoOptions) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const canonicalSelector = 'link[rel="canonical"]';
    const existingCanonical =
      document.head.querySelector<HTMLLinkElement>(canonicalSelector);
    const previousCanonical = existingCanonical?.getAttribute("href") ?? null;

    const canonical =
      existingCanonical ??
      (() => {
        const link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
        return link;
      })();
    canonical.setAttribute("href", url);

    const restores: Restore[] = [
      upsertMeta('meta[name="description"]', "name", "description", description),
      upsertMeta('meta[property="og:type"]', "property", "og:type", type),
      upsertMeta('meta[property="og:title"]', "property", "og:title", title),
      upsertMeta(
        'meta[property="og:description"]',
        "property",
        "og:description",
        description,
      ),
      upsertMeta('meta[property="og:url"]', "property", "og:url", url),
      upsertMeta(
        'meta[name="twitter:title"]',
        "name",
        "twitter:title",
        title,
      ),
      upsertMeta(
        'meta[name="twitter:description"]',
        "name",
        "twitter:description",
        description,
      ),
      upsertMeta(
        'meta[name="twitter:card"]',
        "name",
        "twitter:card",
        "summary_large_image",
      ),
    ];

    if (image) {
      restores.push(
        upsertMeta(
          'meta[property="og:image"]',
          "property",
          "og:image",
          image,
        ),
        upsertMeta(
          'meta[name="twitter:image"]',
          "name",
          "twitter:image",
          image,
        ),
      );
    }

    return () => {
      document.title = previousTitle;
      restores.forEach((restore) => restore());
      if (existingCanonical) {
        if (previousCanonical !== null) {
          canonical.setAttribute("href", previousCanonical);
        }
      } else {
        canonical.remove();
      }
    };
  }, [title, description, url, image, type]);
};
