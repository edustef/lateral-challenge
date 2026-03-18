# Wanderly

A vibe-first unique stays booking app built as an interview challenge. Users discover treehouses, cabins, glamping sites, and houseboats through a "Who's traveling?" + "What's the vibe?" flow, then book through a multi-step checkout with date selection, guest configuration, and booking confirmation.

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

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

The `.env.example` ships with a hosted Supabase project pre-configured — no local database setup needed.

## Architecture

### Tech Stack

- **Framework:** Next.js 16 (App Router, React 19, Server Components)
- **Database:** Supabase (Postgres + Auth + RLS)
- **Styling:** Tailwind CSS v4 + shadcn/ui (base-nova style)
- **State:** nuqs v2 for URL search params, Server Components for data
- **Testing:** Vitest (unit) + Playwright (E2E)
- **CI/CD:** GitHub Actions + Vercel

### Project Structure

```
app/
  (main)/             # Shared layout with header
    page.tsx           # Discovery — vibe picker + stays grid
    stays/[slug]/      # Stay detail, checkout, confirmation
    profile/           # My bookings
  auth/               # Login + callback (no header)
components/           # Shared components (UI + domain)
lib/
  actions/            # Server actions (stays, bookings, reviews, auth)
  supabase/           # Client helpers, proxy, types
  utils/              # Price calculation, date utilities
supabase/
  migrations/         # SQL migrations
  seed.sql            # Seed data (15 stays, 5 collections, 20 reviews)
```

### Data Flow

- Server Components fetch data via server actions (no client-side API calls)
- Client Components only where interactivity is needed (forms, pickers, dropdowns)
- URL state managed by nuqs — filter params (`?type=solo&vibe=adventure`) are shareable and SSR-compatible
- Auth session managed by Supabase proxy (refreshes tokens on every request)

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Vibe-first discovery over search box | Matches the product vision — users explore by mood, not destination |
| Server Components for data fetching | No client-side loading waterfalls, SEO-friendly, simpler data flow |
| nuqs for URL state | Shareable filter URLs, SSR-compatible, type-safe search params |
| proxy.ts for auth | Keeps auth token refresh in its own module, clean separation |
| Magic link auth (no password) | Simpler UX for demo, no password reset flow needed |
| react-day-picker for dates | Better UX than native date inputs, range selection built-in |
| shadcn/ui base-nova style | Warm organic aesthetic matching the brand direction |
| Fixed UUIDs in seed data | Enables reliable cross-references between stays, collections, reviews |
| oxlint over ESLint | 50-100x faster, sufficient for project scope |
| Vitest over Jest | Faster, native ESM support, better Next.js compatibility |

## Tradeoffs

| What | Alternative considered | Why this choice |
|------|----------------------|----------------|
| Mock payment | Stripe integration | Demo scope — document Stripe plan instead |
| Hardcoded Unsplash images | Image upload | Avoids storage complexity, consistent seed data |
| No content moderation | Review approval workflow | Reviews go live immediately, acceptable for demo |
| No map view | Mapbox/Leaflet integration | Deferred to v2, core flow works without it |
| No i18n | next-intl | Out of scope for timebox |

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

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase publishable key |

## Testing

**Unit tests** cover price calculation (`calculateNights`, `calculateTotal`, `formatPrice`) and date utilities (`isValidDateRange`, `isDateInFuture`, `formatDateRange`).

```bash
pnpm test
```

**E2E tests** cover the browsing-to-checkout flow (home → stay detail → checkout redirect). Requires a running dev server.

```bash
pnpm test:e2e
```

## Deployment

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy — Vercel auto-detects Next.js

CI runs lint + test + build on every push to `main` and on PRs.
