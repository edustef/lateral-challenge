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
app/                        # Next.js App Router (pages, layouts, loading/error states)
components/                 # React components grouped by feature
  search/                   #   AI search bar, mobile overlay, suggestions
  booking/                  #   Checkout form, date picker, price breakdown
  stays/                    #   Stay cards, grid, photo gallery, reviews
  layout/                   #   Header, navigation
  ui/                       #   Base UI primitives (shadcn)
lib/                        # Business logic, no UI
  actions/                  #   Server actions (data fetching, mutations)
  hooks/                    #   Custom React hooks (search state)
  supabase/                 #   DB client, auth, generated types
  utils/                    #   Pure helpers (price, date calculations)
supabase/                   # Database migrations + seed data
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
- **Auth** managed by a Supabase proxy that refreshes tokens on every request

### URL as State

All search and booking state lives in the URL, not in client-side state management or localStorage. This is a deliberate choice for a booking platform:

- **Shareable links**: A user can copy `?q=romantic+cabin&maxPrice=20000&tags=romantic&stayType=cabin` and send it to a travel partner. They see the exact same results.
- **Bookmarkable searches**: Save a search, come back later — the URL reconstructs the full filter state.
- **Back/forward works**: Browser navigation through search refinements works for free. No manual history management.
- **SSR-compatible**: Server Components can read search params directly and fetch data on the server — no loading spinners for initial results.
- **Booking flow prefill**: When a user clicks "Book" from a stay detail page, dates and guest count are passed via URL params (`/stays/alpine-treehouse/book?checkIn=2026-04-10&checkOut=2026-04-15&guests=2`). The checkout form reads these on the server and prefills — no client state to hydrate or lose on refresh.
- **No state library needed**: nuqs provides type-safe parsers for all 9 search params. React Context is only used for transient UI state (search overlay open/closed, pending transitions) that doesn't belong in the URL.

This means there's zero risk of stale state, lost filters on refresh, or broken back button — common issues with client-side state management in booking flows.

### Checkout & Availability

The booking flow has server-side availability checking at two levels:

1. **UI-level blocking**: The stay detail page and checkout form both call `getUnavailableDates(stayId)`, which runs a Supabase RPC (`get_unavailable_dates`) that returns all booked date ranges plus any manually blocked dates. The calendar disables these dates, and the form validates client-side that the selected range doesn't overlap any disabled dates before allowing submission.

2. **Database-level enforcement**: Even if a client bypasses the UI validation, the `bookings` table has a Postgres exclusion constraint that prevents overlapping date ranges for the same stay. If two users try to book the same dates simultaneously, the second insert fails with error code `23P01`, and the server action returns a clear error: "These dates are no longer available."

The checkout flow itself:
- **Stay detail page** → BookingSidebar with date picker, guest counter, and price preview → "Book" link passes selections via URL params
- **Checkout page** → Server Component fetches stay data, user session, and unavailable dates in parallel → CheckoutForm renders with prefilled dates/guests and disabled calendar dates
- **Form submission** → `createBooking` server action validates dates, inserts booking, and redirects to confirmation page
- **Confirmation page** → Fetches the created booking by ID and displays confirmation details

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
| URL as single source of truth | For a booking site, every search and booking state must survive refresh, back/forward, and link sharing. URL params handle all of this for free. No Redux/Zustand/localStorage needed — nuqs provides type-safe parsers, and Server Components read params directly. |
| Two-layer search hook architecture | `useSearchParamsState` (thin param wrapper) + `useSearchQuery` (AI submit logic). 4 components share params; only 2 need the full query logic. |
| Feature-folder components | `search/`, `booking/`, `stays/`, `layout/` — find files by what they do, not what they are. |
| proxy.ts for auth | Keeps Supabase token refresh isolated. Clean separation from route handlers. |
| OAuth (Google + GitHub) + magic link | No passwords to manage. Simpler UX for a demo. |
| Optimistic UI for favorites | `useOptimistic` makes wishlist toggling feel instant. Server syncs in the background. |
| AI review moderation | Reviews are classified by GPT-4o-mini at submission time (appropriate/inappropriate). Only approved reviews are visible. Fails open if the API is unavailable — availability over strictness for a demo. |
| Server-side rate limiting on AI search | In-memory sliding window (10 req/IP/min) prevents OpenAI API abuse. Falls back to text search when limited — no error shown to user. |
| oxlint over ESLint | 50-100x faster. Sufficient for project scope — no custom rule needs. |

---

## What Could Be Improved

### Code Quality

- **Test coverage**: Unit tests cover utilities but not components. Adding React Testing Library tests for key flows (search submission, checkout form validation) would catch regressions.
- **Error boundaries**: Each route has an `error.tsx`, but error recovery UX is generic. Could provide more contextual recovery actions.
- **SSR first load**: Currently each route has a `loading.tsx` skeleton that flashes before content renders. Since the app already uses Server Components for data fetching, the pages could stream fully-rendered HTML on first load — eliminating skeletons entirely for server-fetched data. This would mean moving away from the loading.tsx pattern toward inline `<Suspense>` boundaries only where genuinely needed (e.g., below-the-fold content), so users see real content immediately instead of placeholder shapes.

### Performance

- **Bundle size**: The `motion` library (~30KB) is used for simple fade/slide animations. Could be replaced with CSS transitions for most cases, keeping `AnimatePresence` only where exit animations are truly needed.
- **Image optimization**: Stay images are external Unsplash URLs. A proper setup would proxy through Next.js Image Optimization or use a CDN with transformations.
- **Search debouncing**: AI calls are throttled at 1s but there's no debounce on the input itself. Rapid typing before hitting Enter is fine (submit-on-Enter), but could benefit from input validation.

### Architecture

- **In-memory rate limiting**: The AI search rate limiter is per-process. In a multi-instance deployment, this should be replaced with Redis or Upstash Rate Limit for shared state.
- **No API layer**: Server actions are called directly from components. For a larger app, an API route layer would provide better caching and monitoring.
- **No real-time**: Supabase supports real-time subscriptions. Booking availability could update live without polling.
- **No caching strategy**: Server Components re-fetch on every navigation. Adding `unstable_cache` or ISR for stay listings would reduce database load.
- **Basic AI moderation**: Reviews are moderated at submission time via GPT-4o-mini classification (appropriate/inappropriate), and only approved reviews are shown. However, the system fails open — if the OpenAI call fails, the review is auto-approved. A production app would add a review queue for edge cases and a manual override for false positives.

### UX

- **No map view**: Location-based discovery would benefit from a Mapbox/Leaflet integration.
- **No image upload**: Stay images are hardcoded Unsplash URLs. A CMS or admin panel would manage real content.
- **Payment is mocked**: The checkout flow captures all data but doesn't process payment. Stripe integration is the obvious next step.
- **No i18n**: Single language (English). `next-intl` would be the path forward.
- **No sort UI**: The backend supports sorting by price (asc/desc) and rating, and the AI parser can extract sort intent from natural language queries ("cheapest cabins"), but there's no explicit sort dropdown in the UI. Users should be able to sort results without relying on the AI to infer it.
- **Mobile search popover**: The desktop search uses a base-ui Popover for suggestions, but the positioning strategy could be refined for edge cases.

---

## What I'd Do Next

1. **Sort UI** — Add a sort dropdown (price low/high, top rated, newest) to the discovery page. The backend already supports all sort modes via the `sort` URL param — this is purely a UI addition.
2. **Stripe integration** — Wire the checkout form to Stripe Payment Intents. The form already captures all necessary data.
3. **Map view** — Add a split-view discovery page with Mapbox GL. Stays already have location data.
4. **Component tests** — Add React Testing Library tests for SearchBar, CheckoutForm, and BookingSidebar.
5. **Real-time availability** — Use Supabase real-time to update blocked dates when another user books.
6. **Admin panel** — CRUD for stays, review moderation queue, booking management.
7. **Image pipeline** — Upload to Supabase Storage, serve through Next.js Image Optimization.
8. **Caching** — Add ISR for stay listings, `unstable_cache` for frequently-accessed queries.

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

**Unit tests** cover price calculations, date utilities, date range overlap detection, and AI search parser schema validation.

```bash
pnpm test
```

**E2E tests** cover the browsing-to-checkout flow (discovery → stay detail → checkout). Requires a running dev server.

```bash
pnpm dev &
pnpm test:e2e
```

## CI / CD

A GitHub Actions pipeline runs **lint + tests + build** on every push to `main` and on PRs targeting `main`. This catches issues that Vercel's build step alone wouldn't — linting violations, test failures, and type errors that don't break the build.

Vercel handles deployment: every push gets a preview deploy, and merges to `main` trigger production. The CI pipeline and Vercel serve complementary roles — CI gates code quality, Vercel handles hosting and preview environments.

## Release Process

Releases follow a simple tag-based approach:

1. Update `version` in `package.json`
2. Update `CHANGELOG.md` with the new version and changes
3. Commit: `git commit -m "release: v0.2.0"`
4. Tag: `git tag v0.2.0`
5. Push: `git push origin main --tags`

The changelog follows [Keep a Changelog](https://keepachangelog.com/) format. Versioning follows [SemVer](https://semver.org/) — patch for fixes, minor for features, major for breaking changes.

## Deployment

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy — Vercel auto-detects Next.js

## Observability

Server actions use a structured logger (`lib/logger.ts`) that outputs consistent `[scope] event {data}` lines with duration tracking. Every server action logs:

- **start** — action name and key parameters
- **ok** — duration and result summary
- **error** — duration, error type, and message

This provides request tracing in Vercel's function logs without adding a third-party dependency. For production at scale, this could be extended with a service like Sentry (error tracking) or Axiom (log aggregation) — the structured format makes integration straightforward.
