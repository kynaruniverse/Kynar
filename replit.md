# 4 Worlds — Identity Engine

## Overview
A React + Vite SPA that doubles as a **personal identity product**. Users take an alignment quiz to discover their primary "world" (Home Haven, Tools Realm, Lifestyle Oasis, Creative Nexus) and receive a premium, shareable Identity Card. Backed by Supabase.

## Stack
- **Frontend**: React 18, Vite 5, React Router 6, Framer Motion
- **Styling**: Tailwind CSS (`@tailwindcss/typography`, `tailwind-scrollbar-hide`)
- **Backend**: Supabase (auth + Postgres + RLS); env vars in `.env`

## Project Structure
- `src/pages` — route components (HubPage, Quiz, Profile, SharePage, NotFound)
- `src/components` — UI (IdentityCard, WorldCard, Navbar, AuthModal, ShareActions, EditProfileModal, ErrorBoundary)
- `src/services` — Supabase data layer (`alignmentService`, `userService`)
- `src/lib` — small utilities (`supabase`, `useDocumentMeta`)
- `src/contexts/AuthContext.jsx` — auth + auto-flush of pending anonymous quiz
- `src/constants/worlds.js` — world theme tokens
- `src/constants/quiz.js` — quiz questions, options, weights
- `public/` — favicon + default Open Graph image

Path aliases: `@`, `@components`, `@lib`, `@pages`, `@constants`, `@contexts`, `@services`.

## Phase 1 — Identity System (shipped)

**Architecture**
- `users` extended with `primary_world`, `quiz_completed_at`, `display_name`, `bio`
- `world_alignment` (1 row/user, sums to 100 across 4 worlds, public read)
- `quiz_responses` (append-only audit log keyed by `attempt_id`)

**Flow**
1. Anyone can take `/quiz` (no auth required)
2. Pure-function `calculateAlignment()` produces normalized percentages + primary world
3. If signed in → persist immediately via `submitQuiz()`
4. If anonymous → stash in `localStorage` (`fw.pending_alignment`); AuthContext flushes on next sign-in
5. Result screen shows the **IdentityCard** (animated, world-tinted)
6. `/me` (private) and `/u/:username` (public) render the profile + card

**Routes added**: `/quiz`, `/me`, `/u/:username`, `/card/:username`

## Phase 1.1 — Identity Card V2 + Sharing (shipped)

**IdentityCard** redesigned as a "shareable artifact" (Spotify-Wrapped feel):
- Primary world dominates with giant ghost glyph + bold stacked-word headline
- Single dominance-percent stat (e.g. "62%") replaces 4 equal bars
- Stacked single-bar **spectrum** + legend shows the full alignment at a glance
- Issued-on date + handle as footer "passport" details
- `forwardRef` so the DOM node can be captured by `html-to-image`
- New `size="share"` variant: poster-sized 4:5 aspect ratio used on the share page

**ShareActions** (`src/components/ShareActions.jsx`):
- Copy share link (`/card/:username`) — uses Clipboard API with textarea fallback
- Download as PNG — client-side capture via `html-to-image` at 2x pixel ratio
- `variant="light"` (profile) and `variant="dark"` (quiz, share page)

**SharePage** (`/card/:username`):
- Distraction-free dark page; navbar hidden via Navbar's pathname guard
- Background tinted by user's primary world
- CTA at the bottom invites visitors to take the quiz themselves

**Entry points**:
- `/me` profile shows ShareActions + "Open share page" link
- Quiz result screen shows ShareActions once user has signed in (has a username)

**Dependency added**: `html-to-image`

### REQUIRED database migration
Run `supabase_phase1_identity.sql` in the Supabase Dashboard → SQL Editor before signing in. Idempotent. Without it, quiz submission for signed-in users will fail (anonymous flow still works for previewing the UX). **No new SQL is required for Phase 2.**

## Phase 2 — Production Polish (shipped)

**What's in**
- **Brand chrome**: SVG favicon, default `og-default.svg` (1200×630), `theme-color #0b0b14`, full Open Graph + Twitter Card defaults baked into `index.html`
- **Per-page meta**: `useDocumentMeta` hook updates `<title>`, OG, and Twitter tags per route and restores on unmount. SharePage emits per-user titles like *"@user belongs to Tools Realm"*
- **404**: Real `NotFound` page replaces the silent redirect-to-Hub catch-all
- **ErrorBoundary**: Top-level boundary in `main.jsx` so render errors never blank the app; prints stack in dev only
- **EditProfileModal**: Wired into `/me` only; updates `display_name` + `bio` via RLS-safe `userService.updateProfile()`; calls `refreshProfile()` on save
- **Routing hygiene**: Removed routes for `/social`, `/library`, `/worlds/*`, `/worlds/*/products/*`, `/worlds/*/guides/*`. Removed orphan pages (`SocialFeed`, `UserLibrary`, `WorldPage`, `ProductDetails`, `GuideDetails`) and components (`PostCard`, `GuideCard`, `CreatePostModal`, `ProductCard`) that referenced unbuilt tables
- **Service hygiene**: Trimmed `userService` down to `getUserProfile` + `updateProfile`. Deleted `contentService` and `socialService`
- **Navbar**: Community + Vault links removed (subsystems not built)
- **WorldCard**: No longer routes to broken `/worlds/:slug`; routes to `/me` (if aligned) or `/quiz` (if not). Adds `isPrimary` ring to highlight the user's primary world on the Hub

**Known limitations (by design)**
- **OG previews in iMessage / Slack / Facebook**: These crawlers don't run JS, so per-user OG tags only apply to JS-aware unfurlers (Twitter, Discord, Telegram). For true per-user previews everywhere we need server-rendering — Vercel Edge Function or full SSR. The `index.html` defaults handle the fallback gracefully.
- **OG default is SVG**: SVG OG works on Discord but is unreliable elsewhere. For best results, regenerate `public/og-default.svg` as `og-default.png` (1200×630) and update the four `<meta>` references in `index.html`.

## Replit Setup
- Dev server: port `5000`, host `0.0.0.0`, `allowedHosts: true` for the proxy
- Workflow: `Start application` runs `npm run dev`
- Deployment: static target, `npm run build`, public dir `dist`

## Environment Variables (`.env`)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
