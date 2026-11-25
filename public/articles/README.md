# KC Articles — media & authoring guide

This folder holds the images used by the KC Articles section at
`kcedu.org/articles`. Article text lives in `src/data/articles.ts`.

## Folders

| Folder | Use | Recommended size |
| --- | --- | --- |
| `authors/` | Square portraits of scholars | 600 × 600 px, JPG/PNG/WebP |
| `covers/` | Lead image for each article | 1600 × 1000 px, JPG/WebP |
| `inline/` | Images used inside the article body | 1600 px wide, JPG/WebP |

Use lowercase, hyphenated filenames, for example:

```
authors/ama-ndip.jpg
covers/why-stem-matters-in-cameroon.jpg
inline/why-stem-matters-figure-1.jpg
```

Then reference them as public URLs in `src/data/articles.ts`:

```ts
author: {
  name: "Ama Ndip",
  role: "KC Scholar",
  avatar: "/articles/authors/ama-ndip.jpg",
}
```

If a portrait has not been uploaded yet, leave `avatar` out. The page will
show the author's initials in a circle instead, using the KC blue.

## Publishing an article

1. Add the author portrait to `authors/`.
2. Add the cover image to `covers/` (optional but recommended).
3. Add any in-article images to `inline/`.
4. Add an object to the `articles` array in `src/data/articles.ts`.

A minimal article:

```ts
{
  slug: "my-article-slug",
  title: "My article title",
  summary: "One or two sentences that appear under the title.",
  category: "Research notes",
  tags: ["STEM", "Education"],
  author: {
    name: "Ama Ndip",
    role: "KC Scholar",
    avatar: "/articles/authors/ama-ndip.jpg",
    bio: "A short biography of the author.",
  },
  publishedAt: "2026-11-10T09:00:00.000Z",
  cover: {
    src: "/articles/covers/my-article-slug.jpg",
    alt: "Describe the image for screen readers.",
    caption: "Shown under the cover image.",
    credit: "Knowledge Center",
  },
  content: [
    { type: "paragraph", text: "The opening paragraph." },
    { type: "heading", level: 2, text: "A section heading" },
    { type: "paragraph", text: "More text with a [link](https://example.com)." },
  ],
}
```

## Supported content blocks

```ts
{ type: "paragraph", text: "Text with **bold**, *italic*, `code` and [links](https://example.com)." }
{ type: "heading", level: 2, text: "Section heading" }        // level 2 or 3
{ type: "image", src: "/articles/inline/figure.jpg", alt: "…", caption: "…", credit: "…" }
{ type: "quote", text: "A pull quote.", attribution: "Ama Ndip", role: "KC Scholar" }
{ type: "list", ordered: false, items: ["First point", "Second point"] }
{ type: "callout", title: "Note", text: "A highlighted note." }
{ type: "divider" }
```

References are added as a separate array:

```ts
references: [
  {
    title: "Title of the source",
    authors: "Author names",
    publication: "Journal or publisher",
    year: 2025,
    url: "https://example.com/source",
  },
]
```

## Image checklist

- Use the author's own portrait and make sure you have permission to publish it.
- Crop portraits to a square so the circular frame looks right.
- Compress images before uploading (aim for under 400 KB each).
- Write real `alt` text for every image.
- Keep cover images wide (16:10 works best).
