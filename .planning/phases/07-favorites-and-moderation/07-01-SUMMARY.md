---
phase: 07-favorites-and-moderation
plan: 01
subsystem: ui
tags: [favorites, wishlist, optimistic-ui, server-actions, supabase]

requires:
  - phase: 03-authenticated-flows
    provides: "Auth session and getClaims for user identification"
provides:
  - "toggleFavorite server action for heart toggle"
  - "getFavoriteStayIds and getFavoriteStays queries"
  - "FavoriteButton client component with optimistic updates"
  - "/wishlist page showing favorited stays"
affects: [08-motion-and-polish]

tech-stack:
  added: []
  patterns: [optimistic-ui-with-useOptimistic, server-action-toggle-pattern]

key-files:
  created:
    - lib/actions/favorites.ts
    - components/favorite-button.tsx
    - app/(main)/wishlist/page.tsx
    - app/(main)/wishlist/loading.tsx
  modified:
    - lib/supabase/types.ts
    - components/stay-card.tsx
    - components/stays-grid.tsx
    - components/header.tsx
    - app/(main)/page.tsx

key-decisions:
  - "Used useOptimistic + useTransition for instant heart toggle feedback"
  - "Favorites table type added to Database types (actual Supabase table must be created manually)"

patterns-established:
  - "Optimistic toggle: useOptimistic for instant UI, server action for persistence"
  - "Server component data fetching with parallel Promise.all for stays + favorites"

requirements-completed: [DISC-V2-02, DISC-V2-03, DISC-V2-04]

duration: 5min
completed: 2026-03-17
---

# Phase 7 Plan 1: Favorites & Wishlist Summary

**Heart toggle on stay cards with optimistic UI and /wishlist page using Supabase favorites table**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-17T15:15:23Z
- **Completed:** 2026-03-17T15:20:32Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- Favorites server actions (toggle, get IDs, get stays with ratings) following existing pattern
- FavoriteButton with useOptimistic for instant heart toggle without waiting for server
- /wishlist page with empty state and grid of favorited stays
- Header nav updated with Wishlist link

## Task Commits

Each task was committed atomically:

1. **Task 1: Add favorites table types and server actions** - `766c6af` (feat)
2. **Task 2: Add heart button to stay cards and create wishlist page** - `875961a` (feat)

## Files Created/Modified
- `lib/supabase/types.ts` - Added favorites table type definition
- `lib/actions/favorites.ts` - toggleFavorite, getFavoriteStayIds, getFavoriteStays server actions
- `components/favorite-button.tsx` - Client component with heart icon and optimistic toggle
- `components/stay-card.tsx` - Integrated FavoriteButton in desktop and mobile card variants
- `components/stays-grid.tsx` - Accepts and passes favoriteIds Set to StayCard
- `app/(main)/page.tsx` - Fetches favorite IDs in parallel with stays
- `app/(main)/wishlist/page.tsx` - Wishlist page with empty state
- `app/(main)/wishlist/loading.tsx` - Skeleton loading state
- `components/header.tsx` - Changed /saved to /wishlist nav link

## Decisions Made
- Used useOptimistic + useTransition for instant heart toggle feedback without waiting for server round-trip
- Favorites table type added to Database types (actual Supabase table must be created manually by user)
- Both nav links use same styling (removed active/inactive distinction)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required

The favorites table must be created in Supabase before the feature works:
```sql
CREATE TABLE favorites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stay_id uuid REFERENCES stays(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, stay_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);
```

## Next Phase Readiness
- Favorites infrastructure complete, ready for moderation plan (07-02)
- Wishlist page functional once Supabase table is created

---
*Phase: 07-favorites-and-moderation*
*Completed: 2026-03-17*
