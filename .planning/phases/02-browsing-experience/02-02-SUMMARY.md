---
phase: 02-browsing-experience
plan: 02
subsystem: ui
tags: [stay-cards, responsive-grid, search, sort, nuqs, next-image, lucide-react]

# Dependency graph
requires:
  - phase: 02-browsing-experience
    plan: 01
    provides: "nuqs search params, getStays() server action, VibePicker components, shared layout"
provides:
  - "StayCard component with desktop (vertical) and mobile (horizontal) responsive variants"
  - "StaysGrid responsive grid wrapper with empty state"
  - "SearchBar with debounced text search via nuqs"
  - "SortToggle cycling price-asc/price-desc/none via nuqs"
  - "Fully wired discovery page with vibe picker, search, sort, and stay card grid"
affects: [02-03-collections, 03-auth, 04-bookings]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Dual responsive card rendering via hidden/md:hidden classes", "nuqs throttleMs for debounced search input", "Sort toggle with 3-state cycle (null/asc/desc)"]

key-files:
  created:
    - "components/stay-card.tsx"
    - "components/stays-grid.tsx"
    - "components/search-bar.tsx"
    - "components/sort-toggle.tsx"
  modified:
    - "app/(main)/page.tsx"

key-decisions:
  - "Dual card rendering (desktop vertical + mobile horizontal) via responsive visibility classes rather than single adaptive layout"
  - "Sort toggle uses 3-state cycle (none -> low-high -> high-low -> none) for intuitive UX"

patterns-established:
  - "Card responsive pattern: render both desktop and mobile variants, toggle visibility with hidden/md:hidden"
  - "Price display: divide cents by 100, format with font-mono font-semibold"

requirements-completed: [DISC-03, DISC-04, DISC-05, DISC-06, DISC-07, DISC-08]

# Metrics
duration: 3min
completed: 2026-03-17
---

# Plan 02-02: Stay Cards, Grid, Search, and Sort Summary

**Responsive stay cards with image/title/price/badge, search bar with debounced nuqs filtering, and sort toggle for price ordering on discovery page**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-17T12:14:10Z
- **Completed:** 2026-03-17T12:17:22Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- StayCard with desktop vertical layout (image top, content below) and mobile horizontal layout (image left, info right)
- StaysGrid responsive grid (1 col mobile, 2 col tablet, 3 col desktop) with empty state
- SearchBar with debounced input (nuqs throttleMs: 300ms) and clear button
- SortToggle cycling through none/price-asc/price-desc with URL state
- Discovery page fully wired with VibePicker + SearchBar + SortToggle + StaysGrid

## Task Commits

Each task was committed atomically:

1. **Task 1: Create StayCard component with desktop and mobile variants** - `17a62f3` (feat)
2. **Task 2: Build search bar, sort toggle, wire everything into the discovery page** - `abc095b` (feat)

## Files Created/Modified
- `components/stay-card.tsx` - Dual-layout stay card with image, title, location, price/night, type badge, guest count
- `components/stays-grid.tsx` - Responsive grid wrapper with SearchX empty state
- `components/search-bar.tsx` - Debounced search input with clear button wired to nuqs
- `components/sort-toggle.tsx` - 3-state price sort toggle wired to nuqs
- `app/(main)/page.tsx` - Discovery page wiring toolbar, title row, and stays grid

## Decisions Made
- Rendered both desktop and mobile card variants in same component with responsive visibility (hidden/md:hidden) rather than using CSS-only adaptive layout, for cleaner markup per breakpoint
- Sort toggle uses 3-state cycle (null -> price-asc -> price-desc -> null) so users can remove sorting entirely

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Stay cards and grid ready for collection pages (plan 02-03)
- All browsing filters (vibe, type, search, sort) fully functional via URL state
- StayCard links to /stays/[slug] ready for detail page implementation

## Self-Check: PASSED

All 5 created/modified files verified present. Both task commits (17a62f3, abc095b) verified in git log.

---
*Phase: 02-browsing-experience*
*Completed: 2026-03-17*
