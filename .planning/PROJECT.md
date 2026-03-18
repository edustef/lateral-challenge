# Lateral Challenge

## What This Is

A Booking.com-like travel app focused on unique stays (treehouses, cabins, glamping, houseboats, yurts) with a vibe-first discovery UX. Instead of a traditional search box, users choose "Who's traveling?" and "What's the vibe?" to browse curated stays. Built as an interview take-home challenge within a 4-6 hour timebox to demonstrate product thinking and full-stack execution.

## Core Value

Users can discover unique stays through a vibe-first experience and complete a booking flow end-to-end — the full journey from inspiration to confirmation must work seamlessly.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Vibe-first discovery flow (who's traveling + what's the vibe)
- [ ] Stay listing with search and sort
- [ ] Stay detail page with photos, amenities, reviews, and availability
- [ ] User authentication (magic link + OAuth)
- [ ] Review submission (authenticated users)
- [ ] Multi-step checkout flow with date/guest/contact selection
- [ ] Booking confirmation page
- [ ] Profile / My Bookings page
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading skeletons and error boundaries
- [ ] Warm organic visual theme matching Pencil designs
- [ ] Seed data (15 stays, 5 collections, 20 reviews)
- [ ] Tests (unit, integration, E2E smoke)
- [ ] CI pipeline (GitHub Actions)
- [ ] Deploy to Vercel with README and walkthrough recording

### Out of Scope

- Real payment processing — mock confirmation, document Stripe plan
- Image upload — hardcoded Unsplash URLs in seed data
- Content moderation — reviews go live immediately
- Map view — mentioned as next iteration
- i18n / multi-currency — out of scope for timebox
- Real-time chat or messaging
- Video posts or media beyond images

## Context

- This is an interview take-home challenge. Polish, product thinking, and completeness of the user flow matter more than feature breadth.
- Full Pencil design file exists (`lateral-design.pen`) with screens for all major pages: Discovery/Home, Stay Detail, Checkout, Auth/Login, Booking Confirmation, Vibe Picker (compact + expanded, desktop + mobile), and Profile/Bookings.
- The design uses a warm organic palette (#faf7f2 base, #c4956a accent, muted greens) with nature photography and clean typography.
- Supabase runs locally via `supabase start` for development — Postgres + Auth + RLS in one tool.
- Server Actions serve as the backend layer — no separate REST API needed.
- URL state managed via nuqs for shareable, SSR-compatible links.

## Constraints

- **Timebox**: 4-6 hours total build time — scope decisions must favor shipping the full flow over polishing individual features
- **Tech stack**: Next.js 16 (App Router, RSC, Server Actions), TypeScript, Supabase, Tailwind v4, shadcn/ui, nuqs, pnpm
- **Design**: Must match the Pencil design file (`lateral-design.pen`) for visual fidelity
- **Deliverable**: Working deployed demo + walkthrough recording + README with setup instructions and decision documentation
- **Auth**: Magic link (email OTP) primary, OAuth (Google/GitHub) secondary — per Pencil design
- **Pricing**: Stored in cents (integer) to avoid floating-point bugs
- **Booking integrity**: DB-level date exclusion constraint to prevent double-booking

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Supabase over Express | Auth + DB + RLS in one tool, zero backend boilerplate | — Pending |
| Server Actions as backend | Collocated data fetching, type-safe, no REST layer | — Pending |
| nuqs for URL state | Shareable links, back/forward works, SSR-compatible | — Pending |
| Vibe-first discovery | Differentiates from search-box pattern, shows product thinking | — Pending |
| Price in cents (integer) | Avoids floating-point precision bugs | — Pending |
| DB-level booking exclusion | Prevents double-booking without app-level race conditions | — Pending |
| shadcn/ui (copy-paste) | Full control, accessible defaults, no runtime dependency | — Pending |
| Warm organic palette | Unique visual identity matching Pencil designs | — Pending |
| Pencil for design | Pre-built design reference for implementation fidelity | — Pending |

---
*Last updated: 2026-03-17 after initialization*
