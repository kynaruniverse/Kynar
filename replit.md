# 4 Worlds Ecosystem

## Overview
A React + Vite single-page application for browsing four themed "worlds" (Home Haven, Tools Realm, Lifestyle Oasis, Creative Nexus). Uses Supabase for backend data.

## Stack
- **Frontend**: React 18, Vite 5, React Router 6
- **Styling**: Tailwind CSS with `@tailwindcss/typography` and `tailwind-scrollbar-hide`
- **Backend**: Supabase (configured via `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`)

## Project Structure
- `src/pages` – route components
- `src/components` – shared UI
- `src/services` – Supabase data services
- `src/lib`, `src/contexts`, `src/constants` – utilities and shared state

Path aliases (configured in `vite.config.js`): `@`, `@components`, `@lib`, `@pages`, `@constants`, `@contexts`, `@services`.

## Replit Setup
- Dev server runs on port `5000`, host `0.0.0.0`, with `allowedHosts: true` so the Replit proxy can serve the preview.
- Workflow: `Start application` runs `npm run dev`.
- Deployment: static target. Build command `npm run build`, public dir `dist`.

## Environment Variables
Defined in `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
