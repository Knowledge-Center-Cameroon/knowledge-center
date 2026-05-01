A polished front-end for the Knowledge Center's multi-program portal (initially supporting the Global Scholars Programme, with future programs). It provides a user-facing application flow, administration dashboards, authentication, document uploads, and offline draft saving to ensure a seamless user experience even with intermittent connectivity.

# Knowledge Center Frontend (KC Portal)

<img src="./public/logo.png" alt="Knowledge Center Logo" width="200" />

---

## Overview

- The Knowledge Center frontend is the client-side interface for the Knowledge Center platform. It enables applicants to complete multi-program applications, staff to review and manage applications, and users to authenticate and interact with KC services.
- Key capabilities include:
  - Multi-program application flow with autosave drafts
  - Admin dashboard for managing applications, releases, and program data
  - Google-based authentication flow and token management
  - File uploads (documents such as reports, slips, etc.)
  - Local storage-based offline draft persistence and recovery

---

## Tech stack & integrations

- Frontend framework and language: React with TypeScript, Vite for build/dev server
- Styling and UI: Tailwind CSS, Framer Motion for animations, React Quill for rich text inputs
- Routing & state: React Router, custom React Contexts for auth and user state
- API layer: Centralized API client (src/services/gspApi.ts) and backend endpoints for program registrations, authentication, admin operations, and uploads
- Data handling: LocalStorage-based drafts (gsp_draft_<email>), domain helpers in src/lib/gspUtils.ts
- Runtime validation/types: Zod (types alongside runtime checks in the API layer)

- Environment: Backend base URL configured via VITE_API_BASE_URL
- Token management: kc_gsp_token in localStorage

Note: All code is designed to be type-safe and maintainable, with clear boundaries between UI, state, and server interactions.

---

## Folder structure (top level)

```
src/
  pages/          # Route-driven pages (GspApplicationPage.tsx, GspAdminPage.tsx, AuthPage.tsx, etc.)
  services/       # API clients and service wrappers (gspApi.ts)
  contexts/       # React Contexts (authentication, user data)
  lib/            # Utilities and domain helpers (gspUtils.ts)
  components/     # Reusable UI components
  components/ui/  # UI primitives (Card, Button, Input, Label, Select, Textarea, etc.)
  assets/         # Static assets (logos, icons)
dist/             # Build output (generated)
.env.local        # Local environment overrides (not committed)
.env              # Shared environment variables
package.json      # Project dependencies and scripts
```

For a quick map of files, see the repository tree and the comments in each module.

---

## Setup and running locally

Prerequisites
- Node.js (LTS, e.g., 18+)
- npm or yarn

Quick start
   - npm install
   - or yarn install
2. Configure environment
   - Copy or create a local environment file:
     - cp .env.example .env.local
   - Update VITE_API_BASE_URL to point to the backend API
3. Run the development server
   - npm run dev
   - The app will be available at http://localhost:5173 (port may vary)
4. Build for production
   - npm run build
   - npm run preview (to serve the built app locally)

Environment notes
- VITE_API_BASE_URL is read by the API client to construct requests.
- Authentication tokens are stored in localStorage under kc_gsp_token.
- Drafts are persisted in localStorage under keys like gsp_draft_<email>.

---

## How to use the frontend

- Authentication
  - Google-based login endpoints and token management are used for session handling.
- KC Program Application flow
  - Multi-section form with autosave drafts to the backend via saveGspDraft.
  - The application uses r_id when editing an existing submission; if a new draft is created, the backend returns an r_id which is stored locally.
- Admin features
  - Admin dashboard for reviewing applications, managing release states, and exporting data (CSV).
- File uploads
  - Users can upload documents (report cards, slips, etc.) via the backend uploads endpoint.

---

## Environment & configuration

- VITE_API_BASE_URL: Base URL for the backend API. Set in .env.local.
- kc_gsp_token: Token stored in localStorage for authenticated requests.
- gsp_draft_<email>: Local draft persistence key for offline edits.

---

## Contributors Guide

This project welcomes contributions from engineers of all levels. Follow these guidelines to ensure clean, fast, and maintainable changes.

Onboarding
- Fork the repository if contributing from a fork.
- Create a feature branch: git checkout -b feature/your-change
- Install dependencies: npm install
- Run linters and tests (if configured): npm run lint, npm test
- Run the app locally: npm run dev
- Open a pull request with a clear description of the changes and the rationale.

PR & Code Standards
- Commit messages should be concise and describe the intent (feat:, fix:, docs:, refactor:).
- Include a brief rationale in the PR description: what was changed, why, and any risks or follow-ups.
- Provide minimal tests or validation notes when introducing new behavior or breaking changes.

Code Quality
- Type-safe data handling with clear types for API payloads.
- Clear component boundaries and small, testable units.
- Avoid unnecessary re-renders; prefer minimal, explicit state updates.

On-boarding Checklist
- [ ] Install dependencies
- [ ] Validate environment config (VITE_API_BASE_URL)
- [ ] Run the app and verify core flows (auth, application draft, admin flow if applicable)
- [ ] Add or update tests if you touch logic heavily used by the app

Contributors
- Please add your name to a CONTRIBUTORS.md file in a future PR to be listed here.

---

## Intellectual Property

- This frontend is copyright Knowledge Center. All rights reserved.
- Any external usage should comply with Knowledge Center licensing and attribution requirements.

---

## Troubleshooting

- Backend not reachable
  - Verify VITE_API_BASE_URL in .env.local
- Frontend errors on startup
  - Ensure dependencies are installed and environment variables are set
- Drafts not syncing
  - Check localStorage availability and network requests for saveGspDraft

---

## License

- This project is distributed under the Knowledge Center license. See LICENSE for details.
