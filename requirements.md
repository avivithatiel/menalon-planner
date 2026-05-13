# Requirements — Menalon Trail Planner

## 1. Product Vision
A personal web tool to plan a hiking trip on the Menalon Trail in Greece. The app provides everything needed to plan the route: interactive maps, daily trail descriptions ("road stories"), weather forecasts, accommodation info with booking links, and a flexible itinerary builder.

## 2. User Profile
- **Primary user**: Solo hiker planning a multi-day trek on the Menalon Trail
- **Usage context**: Desktop for planning, mobile for on-trail reference
- **Language**: English only

## 3. Functional Requirements

### 3.1 Trail Overview (Landing Page)
| ID | Requirement | Priority |
|----|------------|----------|
| F-01 | Display trail summary: total distance (~75km), 8 sections, 9 villages | Must |
| F-02 | Show hero image/banner with Menalon Trail branding | Must |
| F-03 | Quick-link cards to each of the 8 sections | Must |
| F-04 | Full trail map overview with all sections visible | Must |

### 3.2 Interactive Maps
| ID | Requirement | Priority |
|----|------------|----------|
| F-10 | Full trail map with all 8 GPX tracks rendered | Must |
| F-11 | Per-section map with GPX track overlay | Must |
| F-12 | Village markers with names on map | Must |
| F-13 | Accommodation pins on map (clickable) | Should |
| F-14 | Elevation profile chart per section (from GPX data) | Must |
| F-15 | Zoom to section on click/selection | Should |

### 3.3 Day/Section Detail Page
| ID | Requirement | Priority |
|----|------------|----------|
| F-20 | Section map with GPX overlay | Must |
| F-21 | Trail stats: distance, duration, elevation gain/loss | Must |
| F-22 | Difficulty level badge (color-coded) | Must |
| F-23 | Elevation profile chart | Must |
| F-24 | Road story (narrative description) | Must |
| F-25 | Weather forecast for section area | Must |
| F-26 | Accommodation listings for start/end villages | Must |
| F-27 | Trail highlights and points of interest | Should |

### 3.4 Itinerary Builder
| ID | Requirement | Priority |
|----|------------|----------|
| F-30 | Select trip start date | Must |
| F-31 | Drag-and-drop sections to assign to days | Must |
| F-32 | Merge multiple sections into a single day | Must |
| F-33 | Split planning across rest days | Should |
| F-34 | Pace selector: relaxed / moderate / fast | Must |
| F-35 | Auto-suggest day groupings based on pace | Should |
| F-36 | Trip summary: total days, total distance, difficulty progression | Must |
| F-37 | Per-day summary cards in the itinerary view | Must |
| F-38 | When marking a day as rest day, forward its sections to the next day (not discard) | Must |
| F-39 | Undo last action in the itinerary planner (supports all operations) | Must |
| F-40a | Insert a new day at any position (not just at the end) | Must |
| F-40b | Free text description/notes field per day | Must |
| F-40c | Manually assign sections to any day via dropdown (multiple sections per day) | Must |
| F-40d | Export itinerary plan to Excel (.xlsx) with all day/section data and summary | Must |
| F-40e | Export itinerary plan to Doc (.doc) with formatted tables and summary | Must |
| F-40f | Sections sorted by number within each day | Must |
| F-40g | Export includes elevation gain/loss per section and day totals | Must |
| F-40h | Import from exported Excel file to restore/continue planning | Must |

### 3.5 Weather Integration
| ID | Requirement | Priority |
|----|------------|----------|
| F-40 | 5-day weather forecast per village/section | Must |
| F-41 | Temperature, precipitation %, wind speed, condition icons | Must |
| F-42 | Cache weather data (1-hour TTL) | Must |
| F-43 | Show forecast on day detail page | Must |
| F-44 | Show forecast summary in itinerary view | Should |

### 3.6 Road Stories
| ID | Requirement | Priority |
|----|------------|----------|
| F-50 | Narrative "road story" per section | Must |
| F-51 | Stories include: highlights, what to expect, tips | Must |
| F-52 | AI-generated initial drafts via OpenAI | Must |
| F-53 | Manually editable as MDX files | Must |
| F-54 | Historical/cultural context where relevant | Should |
| F-55 | Photo-op spot suggestions | Could |

### 3.7 Accommodations
| ID | Requirement | Priority |
|----|------------|----------|
| F-60 | Accommodation cards per village | Must |
| F-61 | Card info: name, type, contact, location | Must |
| F-62 | Booking links to Booking.com or Google Maps | Must |
| F-63 | Filter accommodations by village/section | Should |
| F-64 | Show accommodations on map as pins | Should |
| F-65 | Photo/thumbnail per accommodation | Could |

## 4. Non-Functional Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| NF-01 | Responsive design (desktop + mobile) | Must |
| NF-02 | Page load < 3 seconds on broadband | Should |
| NF-03 | Accessible color contrast (WCAG AA) | Should |
| NF-04 | Works on Chrome, Firefox, Safari, Edge | Must |
| NF-05 | Deployable to Vercel | Must |
| NF-06 | Runnable locally with `npm run dev` | Must |
| NF-07 | Environment variables for API keys (not hardcoded) | Must |
| NF-08 | TypeScript strict mode | Must |

## 5. Data Requirements

### 5.1 Trail Sections (8 sections)
Each section needs:
- Section number and name (e.g., "Section 1: Stemnitsa → Dimitsana")
- Start/end village names and coordinates
- Distance (km), estimated walking time
- Difficulty level (1-5 scale)
- Elevation gain and loss (meters)
- Key highlights / points of interest
- GPX track file

### 5.2 Villages (9 villages)
- Name, coordinates (lat/lng)
- Brief description
- Available services (tavernas, shops, transport)

### 5.3 Accommodations
- Name, type (hotel, guesthouse, rooms)
- Village association
- Contact (phone, email, website)
- Coordinates for map pin
- Booking link (Booking.com or Google Maps)

### 5.4 Road Stories
- One per section (MDX format)
- Sections: narrative, highlights, tips, difficulty notes
- Generated via AI, manually polished

### 5.5 Weather
- Real-time from OpenWeatherMap API
- Cached server-side (1-hour TTL)

## 6. Trail Reference Data

| Section | From → To | Distance | Time | Difficulty |
|---------|-----------|----------|------|------------|
| 1 | Stemnitsa → Dimitsana | 12.5 km | 5 hrs | 4/5 |
| 2 | Dimitsana → Zigovisti | 4.2 km | 2 hrs | 2/5 |
| 3 | Zigovisti → Elati | 14.9 km | 5 hrs | 4/5 |
| 4 | Elati → Vytina | 8.5 km | 2.5 hrs | 2/5 |
| 5 | Vytina → Nymfasia | 5.6 km | 2 hrs | 2/5 |
| 6 | Nymfasia → Magouliana | 8.9 km | 3.5 hrs | 4/5 |
| 7 | Magouliana → Valtesiniko | 6.6 km | 2.5 hrs | 2/5 |
| 8 | Valtesiniko → Lagkadia | 13.9 km | 5 hrs | 2/5 |

**Villages in order**: Stemnitsa, Dimitsana, Zigovisti, Elati, Vytina, Nymfasia, Magouliana, Valtesiniko, Lagkadia

## 7. Out of Scope (v1)
- User accounts / authentication
- Multi-language support
- Offline/PWA support
- Real-time availability checking for accommodations
- Social features (sharing, reviews)
- Packing list / gear checklist (future consideration)
- Emergency contacts / hospital info (future consideration)
