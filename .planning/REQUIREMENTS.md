# Requirements: Lateral Challenge

**Defined:** 2026-03-17
**Core Value:** Users can discover unique stays through a vibe-first experience and complete a booking flow end-to-end

## v2 Requirements

### Authentication

- [x] **AUTH-V2-01**: User can sign in via Google OAuth
- [x] **AUTH-V2-02**: User can sign in via GitHub OAuth
- [x] **AUTH-V2-03**: OAuth sessions integrate with existing magic link auth (same user profile)

### Discovery UX

- [ ] **DISC-V2-01**: Sticky filter bar that remains visible while scrolling stays grid
- [ ] **DISC-V2-02**: User can favorite/unfavorite a stay from the stay card
- [ ] **DISC-V2-03**: User can view their favorited stays on a wishlist page
- [ ] **DISC-V2-04**: Favorites persist in database for authenticated users

### Polish

- [ ] **PLSH-V2-01**: Animated page transitions between routes (fade/slide)
- [ ] **PLSH-V2-02**: Micro-interactions on interactive elements (buttons, cards, toggles)

### Content Moderation

- [ ] **MODR-01**: Reviews are classified by OpenAI before display (approve/reject)
- [ ] **MODR-02**: Rejected reviews are stored but hidden with a "moderated" flag
- [ ] **MODR-03**: Classification runs as part of createReview server action

## Out of Scope

| Feature | Reason |
|---------|--------|
| Stay comparison view | Defer to v3 |
| Map view | Defer to v3 |
| Sentry / Vercel Analytics | Defer to v3 |
| Image upload for reviews | Defer to v3 |
| Admin moderation dashboard | Simple auto-classification sufficient for demo |
| Real payment processing | Mock confirmation sufficient |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-V2-01 | Phase 6 | Complete |
| AUTH-V2-02 | Phase 6 | Complete |
| AUTH-V2-03 | Phase 6 | Complete |
| DISC-V2-01 | Phase 6 | Pending |
| DISC-V2-02 | Phase 7 | Pending |
| DISC-V2-03 | Phase 7 | Pending |
| DISC-V2-04 | Phase 7 | Pending |
| PLSH-V2-01 | Phase 8 | Pending |
| PLSH-V2-02 | Phase 8 | Pending |
| MODR-01 | Phase 7 | Pending |
| MODR-02 | Phase 7 | Pending |
| MODR-03 | Phase 7 | Pending |

**Coverage:**
- v2 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0

---
*Requirements defined: 2026-03-17*
*Last updated: 2026-03-17 after v2.0 roadmap creation*
