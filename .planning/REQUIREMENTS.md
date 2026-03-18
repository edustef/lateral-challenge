# Requirements: Lateral Challenge

**Defined:** 2026-03-17
**Core Value:** Users can discover unique stays through a vibe-first experience and complete a booking flow end-to-end

## v1 Requirements

### Foundation

- [ ] **FOUND-01**: Database schema with stays, collections, collection_stays, bookings, reviews, profiles tables with RLS
- [ ] **FOUND-02**: Seed data — 15 stays across 4 vibes (adventure/culture/disconnect/celebration), 5 collections, 20 reviews
- [ ] **FOUND-03**: Supabase client helpers (server + client)
- [ ] **FOUND-04**: Warm organic theme matching Pencil designs (CSS custom properties, Tailwind v4 config)
- [ ] **FOUND-05**: Supabase-generated types (supabase gen types) + colocated component types

### Discovery

- [ ] **DISC-01**: Vibe picker stepper — Step 1 "Who's traveling?" (solo/duo/family/group) → Step 2 "What's the vibe?" (adventure/culture/disconnect/celebration)
- [ ] **DISC-02**: URL state via nuqs (?type=solo&vibe=adventure) — shareable, SSR-compatible
- [ ] **DISC-03**: Stay cards with image, title, location, price/night, max guests, type badge
- [ ] **DISC-04**: Responsive stays grid (1/2/3 columns)
- [ ] **DISC-05**: Text search filter (by title/location)
- [ ] **DISC-06**: Price sort toggle (low→high, high→low)
- [ ] **DISC-07**: Loading skeleton state for stays grid
- [ ] **DISC-08**: Mobile-responsive vibe picker (compact picker + bottom sheet on mobile)

### Stay Detail

- [ ] **DETL-01**: Stay detail page at /stays/[id] with photo gallery (hero + thumbnails)
- [ ] **DETL-02**: Stay info display — title, location, type badge, description, amenities as badges
- [ ] **DETL-03**: Reviews list with star ratings, author, and timestamps
- [ ] **DETL-04**: Date availability display with date picker
- [ ] **DETL-05**: Price breakdown — per night rate, number of nights, cleaning fee, service fee, total
- [ ] **DETL-06**: "Book this stay" CTA linking to checkout
- [ ] **DETL-07**: notFound() for missing stays

### Authentication

- [ ] **AUTH-01**: Magic link (email OTP) login flow
- [ ] **AUTH-02**: Auth callback page (/auth/callback)
- [ ] **AUTH-03**: Session persistence across browser refresh (proxy middleware)
- [ ] **AUTH-04**: Header with conditional sign-in/sign-out and user avatar

### Reviews

- [ ] **REVW-01**: Review submission form (1-5 star rating + comment textarea)
- [ ] **REVW-02**: Server action createReview() with validation, requires auth
- [ ] **REVW-03**: Toast or optimistic UI confirmation after submission

### Checkout

- [ ] **CHKT-01**: Checkout page at /stays/[id]/book with multi-step form (dates → guests → contact → confirm)
- [ ] **CHKT-02**: Date selection with react-day-picker, availability validation
- [ ] **CHKT-03**: Guest count selector
- [ ] **CHKT-04**: Contact information form (name, email, phone)
- [ ] **CHKT-05**: Price calculation — per night × nights + cleaning fee + service fee = total
- [ ] **CHKT-06**: Mock payment step ("Confirm & pay" button)
- [ ] **CHKT-07**: Booking confirmation page with summary (stay name, dates, guests, total)
- [ ] **CHKT-08**: Auth guard — redirect to login if unauthenticated

### Profile

- [ ] **PROF-01**: Profile / My Bookings page showing user's booking history
- [ ] **PROF-02**: Booking cards with stay image, name, dates, status

### Polish

- [ ] **PLSH-01**: loading.tsx skeleton UI for each route
- [ ] **PLSH-02**: error.tsx error boundaries for each route
- [ ] **PLSH-03**: Empty states (no stays found, no reviews yet)
- [ ] **PLSH-04**: Responsive design — mobile (375px), tablet, desktop
- [ ] **PLSH-05**: Accessibility — aria-labels, focus rings, keyboard nav on stepper
- [ ] **PLSH-06**: Structured console.log at server action boundaries (action name, params, duration, errors)

### Testing & Deployment

- [ ] **TEST-01**: Unit tests for complex logic (price calculation, date utilities, availability checks)
- [ ] **TEST-02**: E2E test for checkout flow (home → select stay → book → confirmation)
- [ ] **DEPL-01**: GitHub Actions CI (lint + test + build)
- [ ] **DEPL-02**: Deploy to Vercel with environment variables
- [ ] **DEPL-03**: README with setup instructions, architecture notes, key decisions, tradeoffs

## v2 Requirements

### Authentication

- **AUTH-V2-01**: OAuth login (Google, GitHub)

### Discovery

- **DISC-V2-01**: Sticky filter bar with frosted glass effect on scroll
- **DISC-V2-02**: Favorites/wishlist
- **DISC-V2-03**: Stay comparison view
- **DISC-V2-04**: Map view for stay locations

### Polish

- **PLSH-V2-01**: Animated page transitions
- **PLSH-V2-02**: Sentry + Vercel Analytics integration

### Content

- **CONT-V2-01**: Image upload for reviews
- **CONT-V2-02**: Content moderation system

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real payment processing | Mock confirmation sufficient for demo — document Stripe plan |
| Image upload | Hardcoded Unsplash URLs in seed data |
| Content moderation | Reviews go live immediately for demo |
| Map view | Defer to v2 |
| i18n / multi-currency | Out of scope for timebox |
| Real-time chat | High complexity, not core to demo |
| Video posts | Storage/bandwidth costs, not needed |
| Walkthrough recording | Done manually by user, not a code deliverable |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| (populated during roadmap creation) | | |

**Coverage:**
- v1 requirements: 33 total
- Mapped to phases: 0
- Unmapped: 33

---
*Requirements defined: 2026-03-17*
*Last updated: 2026-03-17 after initial definition*
