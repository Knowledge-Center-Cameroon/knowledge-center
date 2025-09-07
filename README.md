# Knowledge Center Website

A modern, responsive website for Knowledge Center Cameroon built with Vite + React + TypeScript and Tailwind CSS. It includes a hero carousel, projects showcase, blog, contact form (Web3Forms), and more.

## Tech Stack

- React + TypeScript (Vite)
- Tailwind CSS + shadcn/ui
- Framer Motion for animations
- React Router for routing
- Lucide icons

## Quick Start

1. Install dependencies

```
npm install
```

2. Configure environment variables

- Copy `.env.example` to `.env` and fill in values:

```
cp .env.example .env
```

The contact form uses Web3Forms for submissions. Obtain your access key from https://web3forms.com/ and set:

```
VITE_WEB3FORMS_ACCESS_KEY=your_access_key_here
```

3. Start the dev server

```
npm run dev
```

Open the URL printed in your terminal (usually http://localhost:5173).

## Environment Variables

- `VITE_WEB3FORMS_ACCESS_KEY` (required for Contact form)
  - Purpose: Enables form submissions in `src/components/Contact.tsx` via Web3Forms API.
  - Where used: Web3Forms `https://api.web3forms.com/submit` POST.
  - How to get: Sign up at Web3Forms and create a form to obtain an `access_key`.

Optionally, you can also add site metadata overrides, e.g. `VITE_SITE_NAME` and `VITE_SITE_URL` if you plan to use them in future.

## Notable Features

- Hero with autoplay slides and smooth CTA buttons.
- Projects section with responsive tabs (mobile scroll + snap, auto-center active tab).
- STEM Competition CTA linking to registration at `/stem-registration`.
- Contact form with validation, character counter, constrained width, and Web3Forms submission.
- Blog listing page that renders posts from `src/data/blogs.ts`, sorted by date (newest first).
- Team section integrated under the About page; the `/team` route redirects to About.

## Scripts

```
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview the production build locally
```

## Project Structure

```
src/
  assets/                # Images and static assets
  components/            # Reusable UI and sections (Hero, Projects, Contact, etc.)
  data/
    blogs.ts             # Blog posts seed data
    projects.ts          # Projects data
  pages/                 # Route pages
    Home.tsx
    AboutPage.tsx        # Includes Team section
    BlogPage.tsx
    ContactPage.tsx
    ProjectsPage.tsx
    ProjectDetailPage.tsx
  hooks/
  styles/
```

## Contact Form (Web3Forms)

- Component: `src/components/Contact.tsx`
- API: `POST https://api.web3forms.com/submit`
- Required payload:

```json
{
  "access_key": "YOUR_ACCESS_KEY",
  "name": "Your Name",
  "email": "you@example.com",
  "subject": "general | admissions | programs | stem-competition | partnership | support | other",
  "message": "Your message"
}
```

If `VITE_WEB3FORMS_ACCESS_KEY` is missing, the form will show a demo toast and not submit.

## Routing

- `/` Home
- `/about` About (includes Team)
- `/projects` Projects
- `/projects/:slug` Project details
- `/blog` Blog
- `/contact` Contact
- `/stem-registration` STEM registration

## Contributing

1. Create a new branch: `git checkout -b feature/your-change`
2. Make your changes and write clear commit messages
3. Push your branch and open a PR

## License

This project is licensed under the MIT License. See `LICENSE` for details.
