---
phase: 05-bug-fixes-and-wiring
plan: 01
subsystem: auth, ui
tags: [otp, redirect, formatPrice, supabase, next-auth]

requires:
  - phase: 03-authenticated-flows
    provides: OTP login flow, checkout flow, confirmation page
  - phase: 02-browsing-experience
    provides: Stay cards with price display, search functionality
provides:
  - Complete OTP redirect chain (proxy -> login -> emailRedirectTo -> callback -> original URL)
  - Formatted prices in stay cards using formatPrice()
  - "View my bookings" link on booking confirmation page
affects: []

tech-stack:
  added: []
  patterns:
    - "OTP redirect chain: proxy.ts sets ?redirect= -> login reads it -> emailRedirectTo forwards it -> callback redirects to original URL"

key-files:
  created: []
  modified:
    - app/auth/login/page.tsx
    - lib/actions/auth.ts
    - components/stay-card.tsx
    - app/(main)/stays/[slug]/book/confirmation/page.tsx

key-decisions:
  - "search-bar.tsx has no price display; the raw-cents issue was in stay-card.tsx — fixed formatPrice there instead"
  - "proxy.ts is the correct Next.js convention; middleware.ts must not be used"

patterns-established: []

requirements-completed: [CHKT-08, DISC-05]

duration: 4min
completed: 2026-03-17
---

# Phase 5 Plan 1: Bug Fixes & Wiring Summary

**OTP redirect chain verified end-to-end, stay card prices formatted with formatPrice(), and confirmation page linked to profile bookings**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-17T14:47:47Z
- **Completed:** 2026-03-17T14:51:53Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Verified and confirmed OTP redirect chain works end-to-end: proxy.ts -> login?redirect= -> emailRedirectTo?redirect= -> callback -> original URL
- Fixed stay card price display to use formatPrice() instead of manual Math.round calculation
- Added "View my bookings" link to booking confirmation page pointing to /profile
- Build passes cleanly with all changes

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix OTP redirect chain (CHKT-08)** - `3778c0b` (fix) + `c5a742f`, `9374c29` (fix proxy.ts restoration)
2. **Task 2: Fix search price display and add confirmation page profile link** - `4a46e3f` (fix)

## Files Created/Modified
- `app/auth/login/page.tsx` - Login page reads ?redirect= param and forwards to loginWithOtp via formData
- `lib/actions/auth.ts` - loginWithOtp reads redirect from formData, sets emailRedirectTo with redirect param
- `components/stay-card.tsx` - Uses formatPrice() for price display instead of manual Math.round/100
- `app/(main)/stays/[slug]/book/confirmation/page.tsx` - Added "View my bookings" link to /profile

## Decisions Made
- The plan referenced search-bar.tsx lines 169-171 for price formatting, but the actual search bar component is a pure text input with no price display. The raw-cents issue was in stay-card.tsx which used manual `Math.round(price/100)` instead of `formatPrice()`. Fixed there instead.
- proxy.ts is the correct Next.js convention for this project. A prior execution attempt incorrectly renamed it to middleware.ts, which was corrected.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed price formatting in stay-card.tsx instead of search-bar.tsx**
- **Found during:** Task 2 (Fix search price display)
- **Issue:** Plan referenced search-bar.tsx lines 169-171 with EUR price display, but search-bar.tsx is a pure text input (68 lines) with no price display. The actual raw-cents issue was in stay-card.tsx.
- **Fix:** Applied formatPrice() import and usage in stay-card.tsx instead
- **Files modified:** components/stay-card.tsx
- **Verification:** `grep formatPrice components/stay-card.tsx` confirms import and usage
- **Committed in:** `4a46e3f`

---

**Total deviations:** 1 auto-fixed (1 bug - wrong file in plan)
**Impact on plan:** Correct file targeted for the same fix. No scope creep.

## Issues Encountered
- A prior execution attempt incorrectly renamed proxy.ts to middleware.ts. This was detected and reverted in commits `c5a742f` and `9374c29`. The current state is correct with proxy.ts.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All v1.0 gap closure items are resolved
- CHKT-08 (auth guard redirect) and DISC-05 (search/price display) requirements now complete
- Project is fully complete for v1.0 milestone

## Self-Check: PASSED

All 4 modified files verified on disk. All 4 commit hashes verified in git log.

---
*Phase: 05-bug-fixes-and-wiring*
*Completed: 2026-03-17*
