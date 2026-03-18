# Lateral Challenge

## What This Is

A Booking.com-like travel app focused on unique stays (treehouses, cabins, glamping, houseboats, yurts) with a vibe-first discovery UX. Instead of a traditional search box, users choose "Who's traveling?" and "What's the vibe?" to browse curated stays. Built as an interview take-home challenge.

## Core Value

Users can discover unique stays through a vibe-first experience and complete a booking flow end-to-end — the full journey from inspiration to confirmation must work seamlessly.

## Requirements

### Validated

- ✓ Vibe-first discovery flow (who's traveling + what's the vibe) — v1.0
- ✓ Stay listing with search and sort — v1.0
- ✓ Stay detail page with photos, amenities, reviews, and availability — v1.0
- ✓ User authentication (magic link OTP) — v1.0
- ✓ Review submission (authenticated users) — v1.0
- ✓ Multi-step checkout flow with date/guest/contact selection — v1.0
- ✓ Booking confirmation page — v1.0
- ✓ Profile / My Bookings page — v1.0
- ✓ Responsive design (mobile, tablet, desktop) — v1.0
- ✓ Loading skeletons and error boundaries — v1.0
- ✓ Warm organic visual theme matching Pencil designs — v1.0
- ✓ Seed data (15 stays, 5 collections, 20 reviews) — v1.0
- ✓ Tests (unit + E2E) — v1.0
- ✓ CI pipeline (GitHub Actions) — v1.0
- ✓ Deploy to Vercel with README — v1.0

### Active

- [ ] OAuth login (Google, GitHub)
- [ ] Sticky filter bar
- [ ] Favorites/wishlist
- [ ] Stay comparison view
- [ ] Map view for stay locations
- [ ] Animated page transitions
- [ ] Sentry + Vercel Analytics integration
- [ ] Image upload for reviews
- [ ] Content moderation system

### Out of Scope

- Real payment processing — mock confirmation, document Stripe plan
- Image upload — hardcoded Unsplash URLs in seed data
- Content moderation — reviews go live immediately
- i18n / multi-currency — out of scope for timebox
- Real-time chat or messaging
- Video posts or media beyond images

## Context

Shipped v1.0 with 4,688 LOC TypeScript across 118 files.
Tech stack: Next.js 16 (App Router, RSC, Server Actions), TypeScript, Supabase, Tailwind v4, shadcn/ui, nuqs, pnpm.
Full Pencil design file exists (`lateral-design.pen`) with screens for all major pages.

## Constraints

- **Tech stack**: Next.js 16 (App Router, RSC, Server Actions), TypeScript, Supabase, Tailwind v4, shadcn/ui, nuqs, pnpm
- **Design**: Must match the Pencil design file (`lateral-design.pen`) for visual fidelity
- **Auth**: proxy.ts is the correct Next.js convention (NOT middleware.ts), getClaims() not getUser(), PUBLISHABLE_KEY not ANON_KEY
- **Pricing**: Stored in cents (integer) to avoid floating-point bugs

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Supabase over Express | Auth + DB + RLS in one tool, zero backend boilerplate | ✓ Good |
| Server Actions as backend | Collocated data fetching, type-safe, no REST layer | ✓ Good |
| nuqs for URL state | Shareable links, back/forward works, SSR-compatible | ✓ Good |
| Vibe-first discovery | Differentiates from search-box pattern, shows product thinking | ✓ Good |
| Price in cents (integer) | Avoids floating-point precision bugs | ✓ Good |
| shadcn/ui (copy-paste) | Full control, accessible defaults, no runtime dependency | ✓ Good |
| Warm organic palette | Unique visual identity matching Pencil designs | ✓ Good |
| proxy.ts convention | Correct Next.js pattern (replaces deprecated middleware.ts) | ✓ Good |
| react-day-picker for dates | Better UX than native date inputs, range mode support | ✓ Good |
| Vitest + Playwright | Fast unit tests + reliable E2E, both ESM-native | ✓ Good |
| Shared RouteError component | DRY error boundaries across all routes | ✓ Good |

---
*Last updated: 2026-03-17 after v1.0 milestone*
