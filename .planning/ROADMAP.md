# Roadmap: Lateral Challenge

## Overview

Deliver a vibe-first unique stays booking app in 4 phases: lay the database and design foundation, build the browsing experience (discovery + detail), wire up all authenticated flows (auth, checkout, reviews, profile), then polish and ship. Each phase delivers a verifiable slice of the full user journey.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Database schema, seed data, Supabase helpers, types, and warm organic theme
- [ ] **Phase 2: Browsing Experience** - Vibe-first discovery flow and stay detail pages
- [x] **Phase 3: Authenticated Flows** - Auth, checkout, reviews, and profile (completed 2026-03-17)
- [ ] **Phase 4: Ship It** - Polish, testing, CI, and deployment

## Phase Details

### Phase 1: Foundation
**Goal**: The project scaffolding, database, seed data, and visual theme are in place so all subsequent features build on a working base
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05
**Success Criteria** (what must be TRUE):
  1. Running `supabase start` and applying migrations creates all tables (stays, collections, collection_stays, bookings, reviews, profiles) with RLS policies
  2. Seed data loads 15 stays across 4 vibes, 5 collections, and 20 reviews into the local database
  3. The app renders with the warm organic palette (#faf7f2 base, #c4956a accent) matching the Pencil designs
  4. Supabase client helpers work for both server components and client components
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md — Database schema, seed data, Supabase helpers & types
- [ ] 01-02-PLAN.md — Warm organic theme & design system setup

### Phase 2: Browsing Experience
**Goal**: Users can discover unique stays through the vibe picker and explore detailed stay pages
**Depends on**: Phase 1
**Requirements**: DISC-01, DISC-02, DISC-03, DISC-04, DISC-05, DISC-06, DISC-07, DISC-08, DETL-01, DETL-02, DETL-03, DETL-04, DETL-05, DETL-06, DETL-07
**Success Criteria** (what must be TRUE):
  1. User lands on the home page and picks "Who's traveling?" then "What's the vibe?" to see filtered stays
  2. URL updates with query params (?type=solo&vibe=adventure) that are shareable and survive page refresh
  3. User can search stays by text, sort by price, and see a responsive grid (1/2/3 columns by viewport)
  4. User can open a stay detail page showing photos, amenities, reviews, date availability, and price breakdown
  5. Navigating to a non-existent stay shows a proper 404 page
**Plans**: 3 plans

Plans:
- [ ] 02-01-PLAN.md — Shared layout, header, nuqs URL state, vibe picker (desktop + mobile), data fetching
- [ ] 02-02-PLAN.md — Stay cards, responsive grid, search bar, sort toggle, loading skeletons
- [ ] 02-03-PLAN.md — Stay detail page: photo gallery, stay info, reviews, date picker, price breakdown, 404

### Phase 3: Authenticated Flows
**Goal**: Users can sign in, book stays through a multi-step checkout, leave reviews, and view their bookings
**Depends on**: Phase 2
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, CHKT-01, CHKT-02, CHKT-03, CHKT-04, CHKT-05, CHKT-06, CHKT-07, CHKT-08, REVW-01, REVW-02, REVW-03, PROF-01, PROF-02
**Success Criteria** (what must be TRUE):
  1. User can sign in via magic link (email OTP), session persists across browser refresh, and header shows avatar with sign-out option
  2. Authenticated user can complete the full checkout flow: select dates, set guest count, enter contact info, confirm booking, and see a confirmation page
  3. Unauthenticated user attempting checkout is redirected to login
  4. Authenticated user can submit a star rating and comment on a stay and sees confirmation feedback
  5. User can view their booking history on the Profile / My Bookings page
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD
- [ ] 03-03: TBD

### Phase 4: Ship It
**Goal**: The app is polished, tested, and deployed as a complete interview deliverable
**Depends on**: Phase 3
**Requirements**: PLSH-01, PLSH-02, PLSH-03, PLSH-04, PLSH-05, PLSH-06, TEST-01, TEST-02, DEPL-01, DEPL-02, DEPL-03
**Success Criteria** (what must be TRUE):
  1. Every route shows a loading skeleton while data loads and an error boundary on failure
  2. The app is fully responsive across mobile (375px), tablet, and desktop with proper accessibility (keyboard nav, focus rings, aria-labels)
  3. Unit tests pass for price calculation, date utilities, and availability checks
  4. E2E test runs the full checkout flow (home to confirmation) successfully
  5. The app is deployed to Vercel, CI runs on push, and README documents setup, architecture, and key decisions
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/2 | Not started | - |
| 2. Browsing Experience | 0/3 | Not started | - |
| 3. Authenticated Flows | 0/3 | Complete    | 2026-03-17 |
| 4. Ship It | 0/2 | Not started | - |
