import { useEffect } from "react";

interface SeoOptions {
  title?: string;
  description?: string;
}

const DEFAULT_TITLE = "Knowledge Center Cameroon";
const TITLE_SUFFIX = " | Knowledge Center";

export const useSeo = ({ title, description }: SeoOptions) => {
  useEffect(() => {
    const previousTitle = document.title;
    const previousDescription = document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content") || "";

    const nextTitle = title
      ? title.includes("Knowledge Center")
        ? title
        : `${title}${TITLE_SUFFIX}`
      : DEFAULT_TITLE;

    document.title = nextTitle;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }

    return () => {
      document.title = previousTitle || DEFAULT_TITLE;
      if (description) {
        const meta = document.querySelector('meta[name="description"]');
        if (meta) {
          meta.setAttribute("content", previousDescription);
        }
      }
    };
  }, [title, description]);
};
