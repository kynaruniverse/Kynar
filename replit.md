# 4 Worlds — Identity Engine

## Overview
A React + Vite SPA that doubles as a **personal identity product**. Users take an alignment quiz to discover their primary "world" (Home Haven, Tools Realm, Lifestyle Oasis, Creative Nexus) and receive a premium, shareable Identity Card. Backed by Supabase.

## Stack
- **Frontend**: React 18, Vite 5, React Router 6, Framer Motion
- **Styling**: Tailwind CSS (`@tailwindcss/typography`, `tailwind-scrollbar-hide`)
- **Backend**: Supabase (auth + Postgres + RLS); env vars in `.env`

## Project Structure
- `src/pages` — route components (HubPage, Quiz, Profile, WorldPage, ProductDetails, GuideDetails, SocialFeed, UserLibrary)
- `src/components` — UI building blocks (IdentityCard, WorldCard, Navbar, AuthModal, …)
- `src/services` — Supabase data layer (`alignmentService`, `userService`, `contentService`, `socialService`)
- `src/contexts/AuthContext.jsx` — auth + auto-flush of pending anonymous quiz
- `src/constants/worlds.js` — world theme tokens
- `src/constants/quiz.js` — quiz questions, options, weights

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

**Routes added**: `/quiz`, `/me`, `/u/:username`

### REQUIRED database migration
Run `supabase_phase1_identity.sql` in the Supabase Dashboard → SQL Editor before signing in. Idempotent. Without it, quiz submission for signed-in users will fail (anonymous flow still works for previewing the UX).

## Replit Setup
- Dev server: port `5000`, host `0.0.0.0`, `allowedHosts: true` for the proxy
- Workflow: `Start application` runs `npm run dev`
- Deployment: static target, `npm run build`, public dir `dist`

## Environment Variables (`.env`)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
