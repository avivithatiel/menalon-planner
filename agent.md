# Agent Development Guide — Menalon Trail Planner

## Project Overview
Personal-use web app for planning a hiking trip on the Menalon Trail in Greece.
8 trail sections, ~75km, 9 villages. Interactive maps, itinerary builder, weather, road stories, accommodations.

## Tech Stack
- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: TailwindCSS with earthy/outdoors aesthetic
- **Maps**: Leaflet + OpenStreetMap via `react-leaflet`
- **Charts**: Recharts (elevation profiles)
- **State**: Zustand (itinerary builder)
- **Drag & Drop**: @dnd-kit/core
- **MDX**: next-mdx-remote (road stories)
- **APIs**: OpenWeatherMap (weather), OpenAI (story generation)
- **Deployment**: Vercel + local dev

## Development Phases

### Phase 1: Foundation & Data ✅
- [x] Create planning documents (agent.md, requirements.md, architecture.md)
- [x] Scaffold Next.js project with TailwindCSS, TypeScript, ESLint
- [x] Static trail data (sections.json, accommodations.json)
- [x] Define TypeScript types and data models
- [ ] Build one-time scraping script for menalontrail.eu (deferred — using curated data)
- [ ] Acquire GPX tracks from OpenStreetMap uMap instances (deferred)

### Phase 2: Core UI & Maps ✅
- [x] Landing page with trail overview and hero section
- [x] Interactive Leaflet map component (full trail + per-section)
- [x] Day/section detail page (`/day/[sectionId]`)
- [ ] Elevation profile chart component (requires GPX data)

### Phase 3: Itinerary Builder ✅
- [x] Zustand store for itinerary state
- [x] Pace selector and auto-grouping
- [x] Date picker and trip summary dashboard
- [x] Add/remove days, rest day toggle
- [x] Insert day at any position (not just at the end)
- [x] Free text description/notes per day
- [x] Manual section assignment via dropdown (multiple sections per day)
- [ ] Drag-and-drop section assignment

### Phase 4: Weather Integration ✅
- [x] Weather proxy API route (`/api/weather`)
- [x] Weather widget component
- [x] 1-hour cache TTL for responses
- [x] Mock data fallback when no API key configured

### Phase 5: Road Stories ✅
- [x] AI story generation API route (`/api/stories/generate`)
- [ ] MDX file storage for generated/edited stories
- [ ] Story renderer component with next-mdx-remote

### Phase 6: Accommodations ✅
- [x] Accommodation card component
- [x] Booking.com link integration
- [x] Filter by village/section
- [x] Map pin integration

### Phase 7: Polish & Deploy ⬜
- [x] Responsive design (Tailwind responsive classes)
- [x] Loading states (map placeholders)
- [ ] Vercel deployment configuration
- [ ] README with setup instructions

## Conventions
- Use absolute imports via `@/` prefix
- Components in `src/components/{Feature}/`
- API routes in `src/app/api/{resource}/route.ts`
- Static data in `data/` at project root
- GPX files in `public/gpx/`
- Road stories in `data/stories/`
- Scripts in `scripts/`

## Environment Variables
```
OPENWEATHERMAP_API_KEY=   # OpenWeatherMap API key
OPENAI_API_KEY=           # OpenAI API key for story generation
```

## Commands
- `npm run dev` — local development server
- `npm run build` — production build
- `npm run scrape` — run data scraping script
- `npm run generate-stories` — generate road stories via AI

## Current Status
**Phase**: 7 — Polish & Deploy (core app functional)
**Last Updated**: 2026-05-13
**Build**: ✅ Passes with zero errors
**Dev Server**: http://localhost:3000
