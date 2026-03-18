# Lateral Challenge — 4-6h Build Plan

**Goal:** Build a Booking.com-like travel app focused on unique stays (treehouses, cabins, glamping, houseboats, yurts). Differentiator: vibe-first discovery ("Who's traveling?" + "What's the vibe?") instead of typical search-box UX.

**Stack:** Next.js 16 (App Router, RSC, Server Actions) · TypeScript · Supabase (Postgres + Auth) · Tailwind v4 · shadcn/ui · nuqs (URL state) · pnpm

**Local setup:** `supabase start` then `pnpm dev` — two commands, documented in README.

---

## Hour 0–0:30 — Scaffold & Foundation

- `pnpm create next-app` with TypeScript, Tailwind, App Router
- Init Supabase project (`supabase init`, `supabase start`)
- Write migration: `stays`, `collections`, `collection_stays`, `bookings`, `reviews`, `profiles` tables with RLS
- Seed 15 stays across 4 vibes (adventure/culture/disconnect/celebration), 5 collections, 20 reviews
- Install shadcn/ui (`pnpm dlx shadcn@latest init`) + core components (button, card, badge, dialog, drawer, input, separator, avatar, tabs)
- Set up Supabase client helpers (`lib/supabase/server.ts`, `client.ts`)
- Set up type generation with supabase
- **Commit: foundation**

## Hour 0:30–1:30 — Discovery Page (Home)

- Build VibePicker stepper: Step 1 "Who's traveling?" (solo/duo/family/group) → Step 2 "What's the vibe?"
- Wire nuqs for URL state (`?type=solo&vibe=adventure`)
- Server action `getStaysByVibe()` — fetch all stays, filter by collection vibe
- **Text search** — filter stays by title/location with a search input
- **Sort** — at least price low→high and high→low toggle
- StayCard component (image, title, location, price, max guests, type badge)
- StaysGrid (responsive 1/2/3 col)
- Warm organic theme: CSS custom properties in globals.css (`--warm-base: #faf7f2`, `--warm-accent: #c4956a`)
- Loading skeleton state
- **Commit: discovery**

## Hour 1:30–2:15 — Stay Detail Page

- Route: `/stays/[id]`
- Server action `getStayById()`, `getReviewsByStayId()`
- Photo gallery grid (hero + 3 thumbnails)
- Stay info: title, location, type badge, description, amenities as badges
- Reviews list with star ratings + timestamps
- **Availability display** — date picker showing available dates, "Unavailable" for booked ranges
- Price display (per night + estimated total for selected dates)
- "Book this stay" CTA (links to checkout)
- `notFound()` for missing stays
- **Commit: stay-detail**

## Hour 2:15–3:00 — Reviews + Auth

- Supabase magic link auth (email OTP)
- Auth pages: `/auth/login`, `/auth/callback`
- Header component: logo + conditional sign-in/sign-out
- Proxy for session refresh
- Review submission form (rating 1-5 stars + comment textarea)
- Server action `createReview()` — requires auth, validates with Zod
- Optimistic UI or toast confirmation
- **Commit: auth-and-reviews**

## Hour 3:00–4:00 — Checkout Flow

- Route: `/stays/[id]/book`
- Multi-step form: dates (react-day-picker) → guests → contact info → confirm
- Server action `createBooking()` — validates availability (date range exclusion constraint in DB), calculates total
- Mock payment step (just a "Pay now" button that confirms)
- Confirmation page with booking summary
- Guard: redirect to login if unauthenticated
- **Commit: checkout**

## Hour 4:00–4:45 — Polish, States & Observability

- `loading.tsx` files for each route (skeleton UI)
- `error.tsx` error boundaries
- Empty states (no stays found, no reviews yet)
- Responsive QA pass (mobile 375px, tablet, desktop)
- Accessibility: aria-labels, focus rings, keyboard nav on stepper
- **Observability:** structured `console.log` at server action boundaries (action name, params, duration, errors). Mention Sentry + Vercel Analytics as production next steps in README.
- **Commit: polish**

## Hour 4:45–5:30 — Tests + CI + Release

- Unit tests: Zod schemas, `formatPrice()`, utility functions
- Integration test: stay detail page renders correctly (RSC test or Playwright)
- E2E smoke: home → pick vibe → see stays → click card → see detail
- GitHub Actions workflow: `pnpm lint && pnpm test` on push/PR, production build step
- **Release:** tag `v1.0.0`, add CHANGELOG.md with initial feature list
- Deploy to Vercel, set env vars, verify production build, share URL
- **Commit: tests-ci-release**

## Hour 5:30–6:00 — README & Recording

- Write README: setup instructions (`supabase start && pnpm dev`), architecture notes, key decisions, tradeoffs, what's next
- Document LLM usage (Claude Code for scaffolding, component generation, Supabase queries)
- Record walkthrough: demo the full flow, talk through code, explain decisions

---

## Key Decisions to Document

| Decision | Why |
|---|---|
| Supabase over Express | Auth + DB + RLS in one tool, zero backend boilerplate |
| Server Actions as backend | Collocated data fetching, type-safe, no REST layer to maintain |
| nuqs for URL state | Shareable links, back/forward works, SSR-compatible |
| Vibe-first discovery | Differentiates from search-box pattern, shows product thinking |
| Price in cents (integer) | Avoids floating-point precision bugs |
| DB-level booking exclusion constraint | Prevents double-booking without app-level race conditions |
| shadcn/ui (copy-paste) | Full control, accessible defaults, no runtime dependency |
| Warm organic palette | Unique visual identity vs generic Material/corporate look |

## Corners to Cut (and say so)

- **No real payment** — mock confirmation, document Stripe integration plan
- **No image upload** — We have images in images folder generated by pencil we can use those
- **Basic moderation** — reviews go live immediately, mention content policy would come later (maybe we can add an ai clasification here)
- **No map view** — mention it as "next iteration" feature
- **No i18n / multi-currency** — out of scope for timebox
- **Auth is magic-link only** — no OAuth providers, document adding Google/GitHub. Show them in design but disable the buttons
- **Observability is console-level** — structured logs now, Sentry/Vercel Analytics in production

## If Time Permits (bonus)

- Favorites/wishlist (localStorage or Supabase)
- Stay comparison view
- Animated page transitions
