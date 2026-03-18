# Wanderly

A search-first unique stays discovery and booking app. Users find treehouses, cabins, glamping sites, yurts, and houseboats through an AI-powered natural language search, then book through a multi-step checkout with date selection, guest configuration, and confirmation.

Built as a technical interview challenge to demonstrate full-stack product thinking, clean architecture, and attention to craft.

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+

### Setup

```bash
git clone <repo-url>
cd lateral-challenge
pnpm install

# Set up environment
cp .env.example .env.local
# Add your OpenAI API key to .env.local (required for AI search)

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

The `.env.example` ships with a hosted Supabase project pre-configured — no local database setup needed.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL (pre-configured) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Yes | Supabase publishable key (pre-configured) |
| `OPENAI_API_KEY` | Yes | OpenAI API key for AI-powered search parsing |

> Without an OpenAI key, search still works — it falls back to plain text matching instead of AI-structured filters.

---

## Tech Stack & Rationale

| Technology | What it does | Why this choice |
|------------|-------------|-----------------|
| **Next.js 16** (App Router) | Framework, routing, SSR | Server Components eliminate client-side data waterfalls. App Router provides clean file-based routing with layouts, loading states, and error boundaries. |
| **React 19** | UI rendering | Server Components + `useActionState` + `useOptimistic` for forms without client-side state management libraries. |
| **Supabase** (Postgres + Auth + RLS) | Database, authentication, row-level security | Full Postgres with RLS policies — auth and data in one place. OAuth (Google, GitHub) and magic link built in. |
| **Tailwind CSS v4** | Styling | Utility-first CSS with a custom design token system (CSS variables for colors, radii, fonts). Fast iteration, no CSS-in-JS runtime. |
| **shadcn/ui** (base-ui) | Component primitives | Unstyled, accessible primitives (Dialog, Popover, Dropdown) that we own and customize — not a locked-in library. |
| **nuqs v2** | URL search params state | Type-safe, SSR-compatible URL state. Search filters (`?q=cabin&maxPrice=20000&tags=romantic`) are shareable and bookmarkable. |
| **OpenAI** (GPT-4o-mini) | Natural language search | Parses queries like "cozy cabin for 2 under $200" into structured filters (location, price, tags, stay type). Function calling ensures typed output. |
| **Vitest** | Unit testing | Fast, native ESM, excellent Next.js compatibility. Tests cover price calculations, date utilities, and AI schema validation. |
| **Playwright** | E2E testing | Real browser testing for the browsing-to-checkout flow. |
| **oxlint** | Linting | 50-100x faster than ESLint, sufficient for project scope. |
| **Zod** | Runtime validation | Validates server environment variables and AI function call schemas at the boundary. |

---

## Architecture

### Project Structure

```
app/
  (main)/                    # Main layout (header, search overlay, mobile FAB)
    page.tsx                 # Discovery — AI search + stays grid
    stays/[slug]/            # Stay detail page
    stays/[slug]/book/       # Checkout form + confirmation
    profile/                 # User bookings
    wishlist/                # Saved stays
  auth/                      # Login + OAuth callback (no header)

components/
  search/                    # SearchBar, SearchOverlay, SearchHero, MobileSearchFab, ConciergeSummary
  booking/                   # CheckoutForm, CheckoutSummary, BookingSidebar, BookingCard, DatePicker
  stays/                     # StayCard, StayInfo, StaysGrid, PhotoGallery, ReviewForm, ReviewsList
  layout/                    # Header, HeaderBar
  ui/                        # Base UI primitives (shadcn — Dialog, Popover, Calendar, etc.)
  filter-transition-context.tsx  # App-wide search state (React Context)
  guest-counter.tsx          # Shared +/- stepper
  favorite-button.tsx        # Wishlist toggle with optimistic UI
  ...                        # Other shared components

lib/
  actions/                   # Server actions (stays, bookings, reviews, favorites, auth, concierge)
  hooks/                     # Custom hooks (useSearchParamsState, useSearchQuery)
  supabase/                  # Client helpers, auth proxy, generated types
  utils/                     # Price calculation, date utilities
  concierge-schema.ts        # OpenAI function calling schema

supabase/
  migrations/                # 5 SQL migrations (tables, favorites, blocked dates, countries, tags)
  seed.sql                   # Seed data (15 stays across 5 countries, reviews, blocked dates)
```

### Data Flow

```
User types "romantic cabin near mountains under $300"
  → useSearchQuery hook (client)
  → parseNaturalQuery server action
  → OpenAI function calling → structured filters
  → nuqs updates URL params (?q=...&tags=romantic&maxPrice=30000&stayType=cabin)
  → Server Component re-renders with filtered getStays() query
  → Supabase Postgres with full-text search + tag/price/location filters
```

- **Server Components** fetch data via server actions — no client-side API calls, no loading waterfalls
- **Client Components** only where interactivity is needed (search input, forms, date pickers)
- **URL state** via nuqs — every filter combination is a shareable, bookmarkable URL
- **Auth** managed by a Supabase proxy that refreshes tokens on every request

### Design System

Custom design tokens in CSS variables (not Tailwind defaults):

- **Colors**: Warm earth-tone palette — sage green accent (`#7C9082`), tan backgrounds (`#FAF8F5`), semantic status/error/success tokens
- **Typography**: Fraunces (serif headings) + Inter (body) + IBM Plex Mono (mono)
- **Radii**: Card (20px), button (24px), input (28px), badge (16px) — rounded but not bubbly
- **Components**: Feature-folder organization with shared primitives at root

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| AI-powered natural language search | Users describe what they want in plain English. The AI extracts structured filters — no need to learn a filter UI. Falls back to text search when AI is unavailable. |
| Server Components for data fetching | Zero client-side loading states for initial data. SEO-friendly. Simpler mental model — data flows top-down. |
| nuqs for URL state | Shareable filter URLs, SSR-compatible, type-safe. No Redux/Zustand needed. |
| Two-layer search hook architecture | `useSearchParamsState` (thin param wrapper) + `useSearchQuery` (AI submit logic). 4 components share params; only 2 need the full query logic. |
| Feature-folder components | `search/`, `booking/`, `stays/`, `layout/` — find files by what they do, not what they are. |
| proxy.ts for auth | Keeps Supabase token refresh isolated. Clean separation from route handlers. |
| OAuth (Google + GitHub) + magic link | No passwords to manage. Simpler UX for a demo. |
| Optimistic UI for favorites | `useOptimistic` makes wishlist toggling feel instant. Server syncs in the background. |
| Server-side rate limiting on AI search | In-memory sliding window (10 req/IP/min) prevents OpenAI API abuse. Falls back to text search when limited — no error shown to user. |
| oxlint over ESLint | 50-100x faster. Sufficient for project scope — no custom rule needs. |

---

## What Could Be Improved

### Code Quality

- **Test coverage**: Unit tests cover utilities but not components. Adding React Testing Library tests for key flows (search submission, checkout form validation) would catch regressions.
- **Error boundaries**: Each route has an `error.tsx`, but error recovery UX is generic. Could provide more contextual recovery actions.
- **Loading skeletons**: Each route has a `loading.tsx` but they're not perfectly matched to the actual layout — some visual shift on hydration.

### Performance

- **Bundle size**: The `motion` library (~30KB) is used for simple fade/slide animations. Could be replaced with CSS transitions for most cases, keeping `AnimatePresence` only where exit animations are truly needed.
- **Image optimization**: Stay images are external Unsplash URLs. A proper setup would proxy through Next.js Image Optimization or use a CDN with transformations.
- **Search debouncing**: AI calls are throttled at 1s but there's no debounce on the input itself. Rapid typing before hitting Enter is fine (submit-on-Enter), but could benefit from input validation.

### Architecture

- **In-memory rate limiting**: The AI search rate limiter is per-process. In a multi-instance deployment, this should be replaced with Redis or Upstash Rate Limit for shared state.
- **No API layer**: Server actions are called directly from components. For a larger app, an API route layer would provide better caching and monitoring.
- **No real-time**: Supabase supports real-time subscriptions. Booking availability could update live without polling.
- **No caching strategy**: Server Components re-fetch on every navigation. Adding `unstable_cache` or ISR for stay listings would reduce database load.
- **No content moderation pipeline**: Reviews go live immediately. A production app would need moderation (the schema and utilities exist but aren't wired into a workflow).

### UX

- **No map view**: Location-based discovery would benefit from a Mapbox/Leaflet integration.
- **No image upload**: Stay images are hardcoded Unsplash URLs. A CMS or admin panel would manage real content.
- **Payment is mocked**: The checkout flow captures all data but doesn't process payment. Stripe integration is the obvious next step.
- **No i18n**: Single language (English). `next-intl` would be the path forward.
- **Mobile search popover**: The desktop search uses a base-ui Popover for suggestions, but the positioning strategy could be refined for edge cases.

---

## What I'd Do Next

1. **Stripe integration** — Wire the checkout form to Stripe Payment Intents. The form already captures all necessary data.
2. **Map view** — Add a split-view discovery page with Mapbox GL. Stays already have location data.
3. **Component tests** — Add React Testing Library tests for SearchBar, CheckoutForm, and BookingSidebar.
4. **Real-time availability** — Use Supabase real-time to update blocked dates when another user books.
5. **Admin panel** — CRUD for stays, review moderation queue, booking management.
6. **Image pipeline** — Upload to Supabase Storage, serve through Next.js Image Optimization.
7. **Caching** — Add ISR for stay listings, `unstable_cache` for frequently-accessed queries.

---

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm lint` | Run oxlint |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:watch` | Run unit tests in watch mode |
| `pnpm test:e2e` | Run E2E tests (Playwright, requires dev server) |
| `pnpm db:types` | Regenerate Supabase TypeScript types |

## Testing

**Unit tests** cover price calculations, date utilities, date range overlap detection, and AI concierge schema validation.

```bash
pnpm test
```

**E2E tests** cover the browsing-to-checkout flow (discovery → stay detail → checkout). Requires a running dev server.

```bash
pnpm dev &
pnpm test:e2e
```

## Deployment

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy — Vercel auto-detects Next.js

CI runs lint + test + build on every push to `main` and on PRs.
