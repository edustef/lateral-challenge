# Codebase Cleanup & Reorganization

## Goal

Improve codebase readability and organization through feature-folder grouping, component decomposition, and deduplication — without changing any user-facing behavior.

## Scope

**In scope:** All files in `components/`, `lib/` (non-generated), and `app/` (import updates only).

**Out of scope:** `components/ui/` (shadcn/base UI), `lib/supabase/types.ts` (generated), `supabase/migrations/`, `node_modules`.

---

## 1. File Organization

Reorganize `components/` from flat structure into feature folders. Generic components stay at root.

### New Structure

```
components/
  search/
    search-bar.tsx          ← desktop search input only
    search-overlay.tsx      ← mobile full-screen overlay (extracted from search-bar.tsx)
    search-hero.tsx         ← moved from components/
    search-suggestions.tsx  ← moved from components/
    mobile-search-fab.tsx   ← moved from components/
    concierge-summary.tsx   ← moved from components/
  booking/
    checkout-form.tsx       ← slimmed down (summary card extracted)
    checkout-summary.tsx    ← NEW: sticky sidebar summary card (from checkout-form.tsx)
    booking-sidebar.tsx     ← moved, uses shared GuestCounter
    booking-card.tsx        ← moved (exports BookingCard + BookingCardCompact)
    date-picker.tsx         ← moved from components/
    price-breakdown.tsx     ← moved from components/
  stays/
    stay-card.tsx           ← moved (imports FavoriteButton from root via @/components/favorite-button)
    stay-info.tsx           ← moved from components/
    stays-grid.tsx          ← moved (intra-folder import of stay-card becomes @/components/stays/stay-card)
    photo-gallery.tsx       ← moved from components/
    review-form.tsx         ← moved from components/
    reviews-list.tsx        ← moved from components/
  layout/
    header.tsx              ← moved from components/
    header-bar.tsx          ← moved from components/
  ui/                       ← UNTOUCHED
  filter-transition-context.tsx  ← app-wide context, stays at root
  auth-button.tsx           ← generic, stays at root
  favorite-button.tsx       ← generic, stays at root
  sort-toggle.tsx           ← generic, stays at root (verify usage — may be dead code)
  page-transition.tsx       ← generic, stays at root
  route-error.tsx           ← generic, stays at root
  back-button.tsx           ← generic, stays at root
  guest-counter.tsx         ← NEW: extracted from checkout-form + booking-sidebar
```

### Lib Changes

```
lib/
  hooks/                    ← NEW directory
    use-search-params.ts    ← NEW: thin wrapper around useQueryStates + NULL_PARAMS constant
    use-search-query.ts     ← NEW: input state + submit logic, built on use-search-params
  utils/
    date.ts                 ← gains rangeOverlapsDisabled(), parseDate()
    price.ts                ← unchanged
```

---

## 2. Component Decomposition

### search-bar.tsx (442 lines) -> 3 files + 2 hooks

**Problem:** Contains two independent components (`SearchBar` and `SearchOverlay`) with heavily duplicated logic (param wiring, submitQuery, handleClear, handleKeyDown, throttle). Also contains a custom `PopoverPortal` that duplicates `ui/popover`.

**Solution — two-layer hook architecture:**

**Layer 1: `lib/hooks/use-search-params.ts`** (~30 lines) — Thin wrapper used by all search-related components.
- Wraps the `useQueryStates` call with all 9 search params
- Exports a `NULL_PARAMS` constant (all params set to null) to eliminate the 6 repetitions of the clear pattern
- Returns: `{ params, setParams, clearAll }`
- Consumers: `search-bar.tsx`, `search-overlay.tsx`, `mobile-search-fab.tsx`, `concierge-summary.tsx`

**Layer 2: `lib/hooks/use-search-query.ts`** (~60 lines) — Input + submit logic, built on `useSearchParams`.
- `localValue` state + sync with URL `q` param
- `submitQuery` with throttle and AI parsing
- `handleClear` to reset all params + summary
- `handleKeyDown` for Enter (submits) — Escape handling left to consumers since behavior differs (desktop blurs input, mobile closes overlay)
- `isLoading` state
- Returns: `{ localValue, setLocalValue, isLoading, submitQuery, handleClear, handleKeyDown, params }`
- Consumers: `search-bar.tsx`, `search-overlay.tsx` only

**Bug fix in `submitQuery` fallback path:** Currently when AI returns null, only 6 of 9 params are reset (`type`, `tags`, `sort` are not nulled, leaving stale values). The hook will null all 9 params in the fallback path to match the clear behavior.

**Component files:**

- **`search/search-bar.tsx`** (~50 lines) — Desktop-only search input. Uses `useSearchQuery` hook. Renders focus popover via `ui/popover`. Handles Escape by blurring input.
- **`search/search-overlay.tsx`** (~70 lines) — Mobile full-screen Dialog overlay. Uses `useSearchQuery` hook. Handles Escape and post-submit by calling `setSearchExpanded(false)` from `useFilterTransition`.
- **Delete `PopoverPortal`** — Replace with `ui/popover` component.

### checkout-form.tsx (383 lines) -> 2 files

**Problem:** The summary sidebar card (stay image, title, price breakdown, security badge) is embedded in the form component. Also contains utility functions duplicated in `booking-sidebar.tsx`.

**Solution:**

- **`booking/checkout-form.tsx`** (~280 lines) — Form only (dates, guests, contact, submit). Uses shared `GuestCounter`.
- **`booking/checkout-summary.tsx`** (~60 lines) — Sticky sidebar card with stay image, title, location, price breakdown, security note. Receives stay + nights as props.

### Guest Counter Extraction

**Problem:** The +/- stepper with guest count is copy-pasted identically in `checkout-form.tsx` and `booking-sidebar.tsx` (same icons, same classes, same aria labels).

**Solution:**

- **`components/guest-counter.tsx`** (~40 lines) — Shared component.
  - Props: `{ value: number; min?: number; max: number; onChange: (n: number) => void }`
  - Used by `checkout-form.tsx` and `booking-sidebar.tsx`.

---

## 3. Deduplication

### Date Utilities

Move `rangeOverlapsDisabled()` and `parseDate()` from `checkout-form.tsx` to `lib/utils/date.ts`. Remove the duplicate overlap check from `booking-sidebar.tsx` (`defaultsOverlapDisabled` is essentially the same function). Note: `parseDate` anchors to noon (`T12:00:00`) to avoid timezone edge cases, while `rangeOverlapsDisabled` uses midnight (`T00:00:00`) for boundary comparisons — preserve this distinction with comments.

### Search Param Wiring (6 call sites)

The `useQueryStates` call with all 9 search params is repeated in:
1. `SearchBar.submitQuery` empty case (line 58)
2. `SearchBar.handleClear` (line 131)
3. `SearchOverlay.submitQuery` empty case (line 276)
4. `SearchOverlay.handleClear` (line 346)
5. `MobileSearchFab.handleClear` (line 31)
6. `ConciergeSummary.handleDismiss` (line 38)

The two-layer hook architecture consolidates this: `useSearchParams` wraps the `useQueryStates` call + `NULL_PARAMS` constant, eliminating all 6 repetitions.

---

## 4. Import Updates

All files that import moved components need their import paths updated. This is mechanical:

- `@/components/search-bar` -> `@/components/search/search-bar` (SearchBar) + `@/components/search/search-overlay` (SearchOverlay)
- `@/components/search-hero` -> `@/components/search/search-hero`
- `@/components/mobile-search-fab` -> `@/components/search/mobile-search-fab`
- `@/components/concierge-summary` -> `@/components/search/concierge-summary`
- `@/components/search-suggestions` -> `@/components/search/search-suggestions`
- `@/components/checkout-form` -> `@/components/booking/checkout-form`
- `@/components/booking-sidebar` -> `@/components/booking/booking-sidebar`
- `@/components/booking-card` -> `@/components/booking/booking-card` (both BookingCard + BookingCardCompact)
- `@/components/date-picker` -> `@/components/booking/date-picker`
- `@/components/price-breakdown` -> `@/components/booking/price-breakdown`
- `@/components/stay-card` -> `@/components/stays/stay-card`
- `@/components/stay-info` -> `@/components/stays/stay-info`
- `@/components/stays-grid` -> `@/components/stays/stays-grid`
- `@/components/photo-gallery` -> `@/components/stays/photo-gallery`
- `@/components/review-form` -> `@/components/stays/review-form`
- `@/components/reviews-list` -> `@/components/stays/reviews-list`
- `@/components/header` -> `@/components/layout/header`
- `@/components/header-bar` -> `@/components/layout/header-bar`

---

## 5. Constraints

- No behavior changes (except the param-reset bug fix). All tests must continue to pass.
- Keep kebab-case file naming throughout.
- Do not modify `components/ui/` or generated types.
- The `SearchOverlay` export moves to its own file (`search/search-overlay.tsx`) with its own import path.

---

## 6. Verification

- `pnpm build` succeeds (no broken imports)
- `pnpm test` passes (existing unit tests)
- Manual smoke: discovery page loads, search works (desktop + mobile), booking flow works, profile page loads
