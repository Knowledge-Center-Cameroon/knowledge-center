# Knowledge Center Frontend

Knowledge Center is a modern React frontend for the Knowledge Center Cameroon public website, program pages, blog, STEM registration flow, and Global Scholars Programme portal. The project is built with Vite, TypeScript, Tailwind CSS, shadcn/ui-style components, Clerk authentication, and a small service layer for backend integrations.

The application is designed as a responsive education platform: it presents Knowledge Center programs, lets visitors explore projects and blog content, handles contact submissions, supports STEM competition registration, and provides authenticated GSP application workflows for students and administrators.

## Table of Contents

- [Project Overview](#project-overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Routing Map](#routing-map)
- [Application Architecture](#application-architecture)
- [Data and API Integrations](#data-and-api-integrations)
- [Styling and UI System](#styling-and-ui-system)
- [Authentication](#authentication)
- [SEO and Performance Notes](#seo-and-performance-notes)
- [Deployment](#deployment)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Project Overview

This frontend powers the public and portal-facing experiences for Knowledge Center Cameroon.

It includes:

- A public marketing and information site for Knowledge Center programs.
- Program detail pages for STEM, Summer Education, Weekend School, KC Prepa, and the Global Scholars Program.
- A blog system with local seed content and API-backed reactions/comments.
- A contact form wired through EmailJS.
- STEM competition registration and payment initiation scaffolding.
- A Global Scholars Programme portal with authentication, dashboard, application form, decision view, and admin pages.

The codebase is intentionally lightweight on global state. React Router handles navigation, React Query provides request infrastructure, Clerk handles identity entry points, and the app's domain-specific API calls live in service modules under `src/services`.

## Core Features

- **Responsive public website**: Home, About, Projects, Events, Blog, Donate, Contact, Privacy, and Terms pages.
- **Project showcase**: Program cards and detail pages powered by `src/data/projects.ts`.
- **Blog experience**: Blog listing and detail pages powered by seed content in `src/data/blogs.ts`, with optional backend-powered likes and comments.
- **Contact form**: EmailJS integration with validation and toast feedback.
- **STEM competition flow**: Landing page, registration page, success page, and management page.
- **GSP portal**: Auth, dashboard, multi-section application page, decision page, and admin page.
- **Lazy-loaded routes**: Pages are imported lazily to reduce the initial JavaScript payload.
- **Route prefetching helpers**: `src/route-prefetch.ts` can warm up route chunks.
- **Reusable UI components**: Radix-based components under `src/components/ui`.
- **Global error boundary**: `src/ErrorBoundary.tsx` wraps the root app.
- **SEO hook**: `src/hooks/useSeo.ts` sets page titles and descriptions.

## Tech Stack

- **Runtime and build tool**: Vite 5
- **Framework**: React 18
- **Language**: TypeScript
- **Routing**: React Router DOM 6
- **Server state utilities**: TanStack React Query
- **Authentication**: Clerk plus a GSP token layer stored in localStorage
- **Styling**: Tailwind CSS, custom theme tokens, CSS modules in `src/index.css` and `src/App.css`
- **UI primitives**: Radix UI components, shadcn/ui conventions, class-variance-authority, tailwind-merge
- **Forms and validation**: React Hook Form, Zod, Radix form controls
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Email delivery**: EmailJS
- **Linting**: ESLint 9 with TypeScript ESLint and React Hooks rules
- **Testing dependency available**: Playwright

## Repository Structure

```text
.
├── public/
│   ├── fonts/                  # Local font files and font notes
│   ├── logo*.png|svg|jpeg       # Public logo assets
│   ├── robots.txt
│   └── ...
├── src/
│   ├── assets/                  # Imported images used by React components
│   ├── components/              # Layout, page sections, loaders, reusable components
│   │   └── ui/                  # shadcn/Radix-style UI primitives
│   ├── contexts/                # User and GSP auth contexts
│   ├── data/                    # Local seed data for projects and blog posts
│   ├── hooks/                   # Reusable hooks such as SEO, toast, mobile, parallax
│   ├── lib/                     # Shared utilities and GSP progress helpers
│   ├── pages/                   # Route-level page components
│   ├── services/                # API client modules
│   ├── App.tsx                  # Route tree and global providers
│   ├── ErrorBoundary.tsx        # Root error boundary
│   ├── main.tsx                 # React root and Clerk provider
│   ├── route-prefetch.ts        # Lazy route prefetch helpers
│   └── vite-env.d.ts
├── .env.example                 # Environment variable template
├── components.json              # shadcn/ui component config
├── eslint.config.js             # ESLint configuration
├── tailwind.config.ts           # Tailwind theme and plugin configuration
├── tsconfig*.json               # TypeScript configuration
├── vercel.json                  # Vercel framework metadata
└── vite.config.ts               # Vite configuration
```

## Getting Started

### Prerequisites

Use a recent Node.js version that supports the project dependencies. Node 18 or newer is recommended.

The repository includes both `pnpm-lock.yaml` and `bun.lockb`. Because `pnpm-lock.yaml` is present and current, `pnpm` is a good default for local development. `npm` also works if you prefer it.

### Installation

```bash
pnpm install
```

Or with npm:

```bash
npm install
```

### Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Fill in the values needed for the features you plan to run locally. At minimum, the app requires `VITE_CLERK_PUBLISHABLE_KEY`, because `src/main.tsx` throws during boot if that key is missing.

### Start Development Server

```bash
pnpm dev
```

The Vite dev server is configured to run on port `5173` and bind to `::`.

Open:

```text
http://localhost:5173
```

## Environment Variables

All browser-exposed variables must use Vite's `VITE_` prefix.

| Variable | Required | Used By | Description |
| --- | --- | --- | --- |
| `VITE_CLERK_PUBLISHABLE_KEY` | Yes | `src/main.tsx`, `src/pages/AuthPage.tsx` | Clerk publishable key used to initialize authentication. |
| `VITE_API_BASE_URL` | Recommended | `src/services/api.ts`, `src/services/blogApi.ts`, `src/services/gspApi.ts` | Backend API base URL for newsletter, timeline, STEM registration, blog interactions, auth, and GSP endpoints. |
| `VITE_EMAILJS_SERVICE_ID` | Required for real contact submissions | `src/components/Contact.tsx` | EmailJS service identifier. |
| `VITE_EMAILJS_TEMPLATE_ID` | Required for real contact submissions | `src/components/Contact.tsx` | EmailJS template identifier. |
| `VITE_EMAILJS_PUBLIC_KEY` | Required for real contact submissions | `src/components/Contact.tsx` | EmailJS public browser key. |
| `VITE_SITE_NAME` | Optional | Future metadata use | Optional site-name override. |
| `VITE_SITE_URL` | Optional | Future metadata use | Optional canonical site URL override. |

Example:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
VITE_API_BASE_URL=http://localhost:8080
VITE_EMAILJS_SERVICE_ID=service_xxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxx
VITE_EMAILJS_PUBLIC_KEY=public_xxxxx
```

### API Base URL Defaults

There are service-level fallbacks in the code:

- `src/services/api.ts` falls back to `http://localhost:8080`.
- `src/services/blogApi.ts` falls back to `http://localhost:8080`.
- `src/services/gspApi.ts` falls back to the configured production Railway URL for most GSP API requests, while some Google login calls read `import.meta.env.VITE_API_BASE_URL` directly.

For predictable local development, set `VITE_API_BASE_URL` explicitly.

## Available Scripts

```bash
pnpm dev
```

Starts the Vite development server.

```bash
pnpm build
```

Creates a production build in `dist/`.

```bash
pnpm build:dev
```

Creates a Vite build using development mode.

```bash
pnpm lint
```

Runs ESLint across the repository.

```bash
pnpm preview
```

Serves the production build locally for inspection.

The same scripts are available through `npm run <script>` if you installed with npm.

## Routing Map

Routes are defined in `src/App.tsx`.

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | `Home` | Main public homepage. |
| `/about` | `AboutPage` | Organization story and related content. |
| `/projects` | `ProjectsPage` | Program and project listing. |
| `/projects/:slug` | `ProjectDetailPage` | Detail page for a project from `src/data/projects.ts`. |
| `/events` | `EventsPage` | Events and timeline content. |
| `/blog` | `BlogPage` | Blog listing. |
| `/blog/:slug` | `BlogDetailPage` | Blog post detail page. |
| `/contact` | `ContactPage` | Contact form and location details. |
| `/donate` | `DonatePage` | Donation page. |
| `/stem` | `StemRegistrationPage` | STEM competition landing page. |
| `/stem/register` | `StemRegistrationApplyPage` | STEM registration form. |
| `/stem/success` | `StemRegistrationSuccessPage` | Registration success state. |
| `/stem/manage` | `StemRegistrationManagePage` | STEM registration management page. |
| `/gsp` | Redirect | Redirects to `/gsp/dashboard`. |
| `/auth` | `AuthPage` | Portal sign-in and Clerk/GSP auth handoff. |
| `/auth/callback` | `AuthCallbackPage` | Auth callback handling. |
| `/gsp/dashboard` | `GspDashboardPage` | Authenticated GSP dashboard. |
| `/gsp/application` | `GspApplicationPage` | GSP application form. |
| `/gsp/decision` | `GspDecisionPage` | GSP decision page. |
| `/gsp/admin` | `GspAdminPage` | Admin tooling for GSP applications. |
| `/privacy` | `PrivacyPage` | Privacy policy. |
| `/terms` | `TermsPage` | Terms page. |
| `*` | `NotFound` | Catch-all 404 page. |

## Application Architecture

### Root Composition

`src/main.tsx` creates the React root, verifies that `VITE_CLERK_PUBLISHABLE_KEY` exists, and wraps the app in:

- `ErrorBoundary`
- `ClerkProvider`

`src/App.tsx` adds the app-level runtime providers:

- `QueryClientProvider`
- `UserProvider`
- `GspAuthProvider`
- `TooltipProvider`
- Toast renderers
- `BrowserRouter`
- Lazy route suspense boundary

The app also shows `EngagingLoader` during the initial browser load and enforces a minimum boot-loader duration.

### Route Layout

Most routes render inside `Layout`, which centralizes navigation and shared page framing. The catch-all 404 route lives outside the layout route tree.

### Lazy Loading

Every route page is loaded with `React.lazy`. This keeps the initial bundle smaller and defers page code until the route is visited.

`src/route-prefetch.ts` exposes helpers for preloading route chunks when a navigation element wants to warm up a route before the user clicks it.

## Data and API Integrations

### Local Data

`src/data/projects.ts` contains the public program catalog:

- STEM National Project
- Summer Education Program
- KC Weekend School
- Global Scholars Program
- KC Prepa

`src/data/blogs.ts` contains seed blog posts with HTML content, metadata, tags, authors, and covers.

### General API Service

`src/services/api.ts` provides lightweight helpers for:

- Newsletter subscriptions
- Timeline events
- STEM registration payment initiation

Several methods include localStorage fallbacks for development so the UI can remain usable when the backend is unavailable.

### Blog API Service

`src/services/blogApi.ts` handles:

- Blog like/unlike requests
- Like status lookup
- Comment listing
- Comment creation
- Comment updates
- Comment deletion

When some read requests fail, the service returns empty/default values to keep the page stable.

### GSP API Service

`src/services/gspApi.ts` handles:

- Auth token persistence
- Google login/registration handoff
- Current-user lookup
- Email verification and password reset helpers
- GSP application load/save/submit
- GSP decision lookup
- Document upload
- Admin application and decision actions
- Admin release controls

The GSP token is stored in localStorage under `kc_gsp_token`.

## Styling and UI System

The project uses Tailwind CSS with a custom theme in `tailwind.config.ts`.

Important styling locations:

- `src/index.css`: global Tailwind layers, base styles, custom utilities, and theme variables.
- `src/App.css`: app-level styles.
- `src/components/ui`: reusable UI primitives based on shadcn/ui and Radix conventions.
- `components.json`: shadcn/ui configuration, including aliases.

The `@` alias maps to `src`, so imports like this are supported:

```ts
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

## Authentication

Authentication has two layers:

1. **Clerk identity layer**
   - Initialized in `src/main.tsx`.
   - Used in `src/pages/AuthPage.tsx` for Google/Clerk sign-in state.

2. **GSP backend token layer**
   - Managed by `src/contexts/GspAuthContext.tsx`.
   - Stores backend access tokens in localStorage.
   - Provides `user`, `loading`, `refreshUser`, `signIn`, and `signOut`.
   - Protects GSP dashboard access by redirecting unauthenticated visitors to `/auth?redirect=/gsp/dashboard`.

The public website does not require authentication.

## SEO and Performance Notes

- `src/hooks/useSeo.ts` is used by route pages to set document titles and meta descriptions.
- Route components are lazy-loaded through `React.lazy`.
- `EngagingLoader` provides a controlled loading experience at boot and during suspense fallbacks.
- Images used inside React are imported from `src/assets`; static public assets live in `public`.
- Vite handles asset hashing and production bundling.

## Deployment

The project is configured as a Vite frontend and includes `vercel.json` metadata:

```json
{
  "experimentalServices": {
    "frontend": {
      "routePrefix": "/",
      "framework": "vite"
    }
  }
}
```

For a typical Vercel deployment:

- Build command: `pnpm build`
- Output directory: `dist`
- Development command: `pnpm dev`

Before deploying, configure the required environment variables in the hosting provider:

- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_API_BASE_URL`
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

Because this is a single-page application, the host should serve `index.html` for client-side routes.

## Development Workflow

1. Create a feature branch.

```bash
git checkout -b feature/your-change
```

2. Install dependencies.

```bash
pnpm install
```

3. Add or update environment variables in `.env`.

4. Run the dev server.

```bash
pnpm dev
```

5. Lint before opening a pull request.

```bash
pnpm lint
```

6. Build before deployment-sensitive changes.

```bash
pnpm build
```

## Content Updates

### Add or Edit a Project

Update `src/data/projects.ts`.

Each project uses:

- `slug`
- `title`
- `summary`
- `images`
- `features`
- `details`
- optional `sections`
- optional `categories`
- optional `featured`
- optional `externalUrl`

The `slug` controls the detail URL:

```text
/projects/<slug>
```

### Add or Edit a Blog Post

Update `src/data/blogs.ts`.

Each post uses:

- `id`
- `title`
- `excerpt`
- `content`
- `date`
- optional `author`
- optional `cover`
- optional `dp`
- optional `tags`

Blog detail routes use the post id as the URL slug.

### Update Contact Details

Contact page content lives primarily in `src/components/Contact.tsx`.

Update that file to change:

- Phone numbers
- Email address
- Location text
- Subject options
- Embedded Google Map

## Troubleshooting

### The app crashes immediately with a Clerk error

Make sure `.env` contains:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_key_here
```

Then restart the dev server. Vite only injects environment variables at server start.

### Contact form shows demo toast instead of sending

The EmailJS variables are missing. Add:

```env
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```

Restart the dev server after updating `.env`.

### API-backed pages fail locally

Set `VITE_API_BASE_URL` to the backend you want to use:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Some public features have localStorage fallbacks, but GSP portal flows generally expect the backend API to be available.

### A route works in development but 404s after deployment

The deployment host must be configured for SPA fallback routing so direct visits to routes such as `/blog/example-post` or `/gsp/dashboard` return `index.html`.

### Environment variable changes do not appear

Stop and restart Vite. `.env` values are read when the dev server starts.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
