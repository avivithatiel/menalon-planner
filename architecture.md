# Architecture — Menalon Trail Planner

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Vercel / Local Dev                   │
│  ┌───────────────────────────────────────────────────┐  │
│  │               Next.js 14+ (App Router)            │  │
│  │  ┌─────────────┐  ┌────────────┐  ┌───────────┐  │  │
│  │  │   Pages /    │  │    API     │  │  Static   │  │  │
│  │  │  Components  │  │   Routes   │  │   Data    │  │  │
│  │  │             │  │            │  │           │  │  │
│  │  │  Landing    │  │  /weather  │  │ sections  │  │  │
│  │  │  Day Detail │  │  /stories  │  │ accomm.   │  │  │
│  │  │  Planner   │  │  /generate │  │ stories   │  │  │
│  │  │  Map       │  │            │  │ GPX files │  │  │
│  │  └─────────────┘  └─────┬──────┘  └───────────┘  │  │
│  └──────────────────────────┼────────────────────────┘  │
│                             │                            │
└─────────────────────────────┼────────────────────────────┘
                              │
                   ┌──────────┴──────────┐
                   │   External APIs     │
                   │  ┌───────────────┐  │
                   │  │ OpenWeatherMap│  │
                   │  │ OpenAI API    │  │
                   │  │ OpenStreetMap │  │
                   │  └───────────────┘  │
                   └─────────────────────┘
```

## 2. Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14+ (App Router) | SSR, routing, API routes |
| Language | TypeScript (strict) | Type safety |
| Styling | TailwindCSS | Utility-first styling |
| Maps | react-leaflet + Leaflet | Interactive maps |
| Charts | Recharts | Elevation profiles |
| State | Zustand | Itinerary builder state |
| DnD | @dnd-kit/core + @dnd-kit/sortable | Drag-and-drop itinerary |
| MDX | next-mdx-remote | Road story rendering |
| Weather | OpenWeatherMap API | 5-day forecasts |
| AI | OpenAI API (GPT-4o) | Road story generation |
| Tiles | OpenStreetMap | Map tile layer |
| Deploy | Vercel | Hosting & serverless functions |

## 3. Project Structure

```
menalon-planner/
├── public/
│   ├── gpx/                    # GPX track files (1 per section)
│   │   ├── section-1.gpx
│   │   ├── section-2.gpx
│   │   └── ...
│   └── images/                 # Hero images, icons
│       └── hero.jpg
├── data/
│   ├── sections.json           # Trail section metadata
│   ├── accommodations.json     # Accommodation listings
│   └── stories/                # Road story MDX files
│       ├── section-1.mdx
│       ├── section-2.mdx
│       └── ...
├── scripts/
│   └── scrape.ts               # One-time data scraper
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (fonts, nav, footer)
│   │   ├── page.tsx            # Landing page
│   │   ├── globals.css         # Tailwind base + custom styles
│   │   ├── day/
│   │   │   └── [sectionId]/
│   │   │       └── page.tsx    # Day/section detail page
│   │   ├── planner/
│   │   │   └── page.tsx        # Itinerary builder page
│   │   └── api/
│   │       ├── weather/
│   │       │   └── route.ts    # Weather proxy endpoint
│   │       └── stories/
│   │           └── generate/
│   │               └── route.ts # AI story generation
│   ├── components/
│   │   ├── Map/
│   │   │   ├── TrailMap.tsx        # Full trail overview map
│   │   │   ├── SectionMap.tsx      # Single section map
│   │   │   ├── GpxLayer.tsx        # GPX track overlay
│   │   │   └── MapMarkers.tsx      # Village & accommodation markers
│   │   ├── Elevation/
│   │   │   └── ElevationChart.tsx  # Recharts elevation profile
│   │   ├── Itinerary/
│   │   │   ├── ItineraryBuilder.tsx   # Main drag-and-drop builder
│   │   │   ├── DayCard.tsx            # Single day in itinerary
│   │   │   ├── SectionChip.tsx        # Draggable section chip
│   │   │   ├── PaceSelector.tsx       # Relaxed/moderate/fast
│   │   │   └── TripSummary.tsx        # Summary dashboard
│   │   ├── Weather/
│   │   │   └── WeatherWidget.tsx      # Weather forecast display
│   │   ├── Accommodation/
│   │   │   ├── AccommodationCard.tsx  # Single accommodation
│   │   │   └── AccommodationList.tsx  # Filterable list
│   │   ├── Story/
│   │   │   └── RoadStory.tsx          # MDX story renderer
│   │   ├── Section/
│   │   │   ├── SectionCard.tsx        # Section overview card
│   │   │   └── DifficultyBadge.tsx    # Color-coded difficulty
│   │   └── Layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── lib/
│   │   ├── weather.ts          # OpenWeatherMap client
│   │   ├── openai.ts           # OpenAI client wrapper
│   │   ├── gpx.ts              # GPX file parser
│   │   ├── data.ts             # Load sections/accommodations JSON
│   │   └── utils.ts            # Shared utilities
│   ├── store/
│   │   └── itinerary.ts        # Zustand itinerary store
│   └── types/
│       └── index.ts            # Shared TypeScript types
├── .env.local                  # API keys (gitignored)
├── .env.example                # Template for env vars
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── agent.md                    # Development process tracker
├── requirements.md             # Product requirements
├── architecture.md             # This file
└── README.md
```

## 4. Data Flow

### 4.1 Static Data (Build Time)
```
menalontrail.eu  ──scrape──▶  data/sections.json
                              data/accommodations.json
                              
OpenStreetMap    ──download──▶ public/gpx/section-{1-8}.gpx

OpenAI API       ──generate──▶ data/stories/section-{1-8}.mdx
                                (then manually edited)
```
All static data is committed to the repo. No runtime database.

### 4.2 Runtime Data
```
Client (browser)
  │
  ├── GET /api/weather?lat=X&lon=X
  │     └── Server checks cache (Map<string, {data, timestamp}>)
  │           ├── Cache HIT (< 1hr old) → return cached
  │           └── Cache MISS → fetch OpenWeatherMap → cache → return
  │
  └── POST /api/stories/generate  (one-time use during development)
        └── Server calls OpenAI API → returns markdown text
```

### 4.3 Client State (Zustand)
```typescript
interface ItineraryState {
  startDate: Date | null;
  pace: 'relaxed' | 'moderate' | 'fast';
  days: {
    dayNumber: number;
    date: Date;
    sectionIds: number[];    // which sections are assigned to this day
    isRestDay: boolean;
    description: string;     // free text notes per day
  }[];
  // Actions
  setStartDate: (date: Date) => void;
  setPace: (pace: string) => void;
  assignSection: (sectionId: number, dayIndex: number) => void;
  moveSection: (fromDay: number, toDay: number, sectionId: number) => void;
  addDay: (afterIndex?: number) => void;  // insert at any position
  removeDay: (dayIndex: number) => void;
  toggleRestDay: (dayIndex: number) => void;
  setDayDescription: (dayIndex: number, description: string) => void;
  autoGroup: () => void;   // auto-assign based on pace
}
```

## 5. API Routes

### GET `/api/weather`
- **Query params**: `lat`, `lon`
- **Response**: OpenWeatherMap 5-day forecast (filtered fields)
- **Caching**: In-memory Map with 1-hour TTL
- **Error handling**: Returns 500 with error message on API failure
- **Rate limiting**: Not needed (personal use)

### POST `/api/stories/generate`
- **Body**: `{ sectionId: number }`
- **Response**: `{ story: string }` (markdown text)
- **Uses**: OpenAI GPT-4o with trail section context as system prompt
- **Intended use**: One-time generation during development, not runtime

## 6. Component Architecture

```
RootLayout
├── Header (nav: Home, Planner)
├── Pages
│   ├── LandingPage
│   │   ├── HeroSection
│   │   ├── TrailMap (full overview)
│   │   └── SectionCard[] (8 cards grid)
│   │
│   ├── DayDetailPage [sectionId]
│   │   ├── SectionMap (single section GPX)
│   │   ├── DifficultyBadge
│   │   ├── ElevationChart
│   │   ├── RoadStory (MDX rendered)
│   │   ├── WeatherWidget
│   │   └── AccommodationList
│   │
│   └── PlannerPage
│       ├── PaceSelector
│       ├── DatePicker
│       ├── ItineraryBuilder
│       │   ├── UnassignedSections (SectionChip[])
│       │   └── DayCard[] (droppable zones)
│       │       └── SectionChip[] (draggable)
│       └── TripSummary
│
└── Footer
```

## 7. Styling System

### Color Palette (Earthy / Outdoors)
| Token | Hex | Usage |
|-------|-----|-------|
| `forest` | `#2D5016` | Primary, headers, CTA |
| `moss` | `#5B7C3D` | Secondary, accents |
| `earth` | `#8B6914` | Warm accent |
| `stone` | `#6B7280` | Muted text |
| `sand` | `#F5F0E8` | Background |
| `cream` | `#FEFCF6` | Card backgrounds |
| `trail-red` | `#DC2626` | Difficult (4-5/5) |
| `trail-yellow` | `#D97706` | Moderate (3/5) |
| `trail-green` | `#16A34A` | Easy (1-2/5) |

### Tailwind Config Extensions
Custom colors, font (Inter + serif for stories), container widths.

## 8. Map Architecture

### Tile Source
OpenStreetMap default tiles: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`

### GPX Rendering
- Parse GPX files client-side using a lightweight XML parser
- Extract track points as `[lat, lng, elevation][]`
- Render as Leaflet Polyline with section-specific colors
- Extract elevation data for Recharts chart

### Map Interactions
- Click village marker → popup with village info
- Click accommodation pin → popup with card + booking link
- Click section track → navigate to day detail page
- Zoom controls + fit-to-bounds per section

## 9. Deployment

### Vercel
- Auto-deploy from main branch
- Environment variables set in Vercel dashboard
- Serverless functions for API routes (weather, stories)
- Static assets served via Vercel CDN

### Local Development
- `npm run dev` starts Next.js dev server on port 3000
- `.env.local` for API keys
- No external dependencies (no database, no Redis)

## 10. Security Considerations
- API keys stored in environment variables, never client-side
- Weather API route acts as proxy (key never exposed to browser)
- OpenAI route is development-only (could be disabled in production)
- No user input stored server-side
- No authentication needed (personal use)
- CSP headers for map tile domains

## 11. Performance Considerations
- GPX files loaded on-demand per section (not all at once on landing)
- Landing page map loads simplified track overview
- Weather responses cached in-memory (1-hour TTL)
- Images optimized via Next.js Image component
- Lazy-load map components (dynamic import with `ssr: false` — Leaflet requires window)
