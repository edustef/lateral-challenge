# Roadmap: Lateral Challenge

## Milestones

- ✅ **v1.0 MVP** -- Phases 1-5 (shipped 2026-03-17)
- 🚧 **v2.0 Polish & Features** -- Phases 6-8 (in progress)

## Phases

<details>
<summary>v1.0 MVP (Phases 1-5) -- SHIPPED 2026-03-17</summary>

- [x] Phase 1: Foundation (2/2 plans) -- completed 2026-03-17
- [x] Phase 2: Browsing Experience (3/3 plans) -- completed 2026-03-17
- [x] Phase 3: Authenticated Flows (3/3 plans) -- completed 2026-03-17
- [x] Phase 4: Ship It (3/3 plans) -- completed 2026-03-17
- [x] Phase 5: Bug Fixes & Wiring (1/1 plan) -- completed 2026-03-17

</details>

### v2.0 Polish & Features

- [ ] **Phase 6: OAuth & Discovery Controls** - Social login and persistent browsing controls
- [ ] **Phase 7: Favorites & Moderation** - Save stays and AI-powered review quality
- [ ] **Phase 8: Motion & Polish** - Animated transitions and micro-interactions

## Phase Details

### Phase 6: OAuth & Discovery Controls
**Goal**: Users can sign in faster via social accounts and browse with persistent filter controls
**Depends on**: Phase 5 (v1.0 complete)
**Requirements**: AUTH-V2-01, AUTH-V2-02, AUTH-V2-03, DISC-V2-01
**Success Criteria** (what must be TRUE):
  1. User can sign in with Google and land on their profile with existing bookings/reviews intact
  2. User can sign in with GitHub and land on their profile with existing bookings/reviews intact
  3. User who previously used magic link can sign in via OAuth and see their same account
  4. Filter bar stays visible at top of screen while scrolling through the stays grid
**Plans**: 2 (06-01 OAuth buttons + action, 06-02 Sticky filter bar)

### Phase 7: Favorites & Moderation
**Goal**: Users can save stays for later and submitted reviews are automatically checked for quality
**Depends on**: Phase 6
**Requirements**: DISC-V2-02, DISC-V2-03, DISC-V2-04, MODR-01, MODR-02, MODR-03
**Success Criteria** (what must be TRUE):
  1. User can tap a heart icon on any stay card to favorite it, and tap again to unfavorite
  2. User can navigate to a wishlist page and see all their favorited stays
  3. Favorites persist across sessions (stored in database for authenticated users)
  4. A submitted review with inappropriate content is hidden from the listing and flagged as moderated
  5. A submitted review with appropriate content appears on the listing normally
**Plans**: 2 plans
- [ ] 07-01-PLAN.md — Favorites: heart toggle on stay cards, wishlist page, favorites server actions
- [ ] 07-02-PLAN.md — Moderation: OpenAI review classification, is_approved filter, moderation utility

### Phase 8: Motion & Polish
**Goal**: The app feels premium with smooth transitions and responsive interactive feedback
**Depends on**: Phase 6 (no dependency on Phase 7)
**Requirements**: PLSH-V2-01, PLSH-V2-02
**Success Criteria** (what must be TRUE):
  1. Navigating between pages shows a smooth fade/slide transition instead of hard cuts
  2. Buttons, cards, and toggles respond to hover/tap with subtle animations
**Plans**: TBD

## Progress

**Execution Order:** 6 -> 7 -> 8 (Phase 8 can run in parallel with Phase 7)

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 2/2 | Complete | 2026-03-17 |
| 2. Browsing Experience | v1.0 | 3/3 | Complete | 2026-03-17 |
| 3. Authenticated Flows | v1.0 | 3/3 | Complete | 2026-03-17 |
| 4. Ship It | v1.0 | 3/3 | Complete | 2026-03-17 |
| 5. Bug Fixes & Wiring | v1.0 | 1/1 | Complete | 2026-03-17 |
| 6. OAuth & Discovery Controls | v2.0 | 0/2 | Planned | - |
| 7. Favorites & Moderation | v2.0 | 0/2 | Planned | - |
| 8. Motion & Polish | v2.0 | 0/? | Not started | - |
