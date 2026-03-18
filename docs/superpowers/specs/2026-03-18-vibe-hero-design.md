# Vibe Hero Picker — Design Spec

## Problem

The current vibe/travel-type filter is a small pill in the toolbar that opens a popover with toggle chips. It feels generic, flat, and buried — the filtering experience doesn't match the playful, discovery-oriented nature of the product.

## Goal

Elevate vibe selection into a hero-level, playful, tactile experience that's the first thing users interact with on the homepage. Use progressive disclosure: start big and immersive, collapse into a compact strip once a vibe is chosen.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Prominence | Hero-level, first interaction | Vibes are the core differentiator, not a utility filter |
| Visual energy | Playful and tactile | Bouncy animations, distinct colors per vibe, game-like feel |
| Interaction model | Progressive — hero first, collapses to strip | Big moment on first visit, gets out of the way once chosen |
| Travel type placement | Secondary row in the hero | Part of the same selection moment, but visually subordinate |

## Layout

### Expanded State (no vibe selected)

Full-width section between header and stays grid:

1. **Heading**: "What's your vibe?" — `font-heading text-3xl` desktop, `text-2xl` mobile, centered
2. **Vibe cards**: 4 cards in a horizontal row (~160px tall desktop). Mobile: 2x2 grid
3. **Travel type row**: "Who's going?" label + 4 smaller horizontal pills. Mobile: 2x2 grid
4. No submit button — selecting a vibe triggers immediate filter + collapse

### Collapsed State (vibe selected)

Compact sticky strip at `top-0 md:top-14` (same as current toolbar):

```
[🏔 Adventure] [👥 Duo]  ·  [Change]          [🔍 Search] [Sort ▾]
```

- Selected vibe: pill with vibe accent color tint, icon + label
- Selected travel type: pill with sage accent tint, icon + label (if selected)
- "Change" text button: re-expands the hero
- `X` button: clears all filters, re-expands hero
- Search bar on the right (same as current)
- `SortToggle` renders inline at the far right of the strip
- In the expanded hero, `SortToggle` is hidden (it only appears after collapse)

### Mobile Collapsed Strip

- Single row, horizontally scrollable if needed
- Tapping the vibe pill re-expands (no separate "Change" button)

## Visual Design

### Vibe Colors

Each vibe gets a distinct accent color, muted enough to fit the sage/taupe design system:

| Vibe | Color | CSS Variable | Feeling |
|------|-------|-------------|---------|
| Adventure | `#C4956A` | `--warm-accent` (existing) | Earthy, energetic |
| Culture | `#8B7BB5` | `--vibe-culture` (new) | Refined, curious |
| Disconnect | `#6BA3A0` | `--vibe-disconnect` (new) | Calm, serene |
| Celebration | `#D4845A` | `--vibe-celebration` (new) | Warm, festive |

### Vibe Card States

| State | Appearance |
|-------|-----------|
| Default | White bg, light border, muted icon, `shadow-sm` |
| Hover | `scale(1.05)`, shadow lifts, icon animates, border gets vibe color at low opacity |
| Selected | Vibe color tint bg, solid vibe color border, icon in full vibe color, slight inward shadow |
| Unselected (sibling selected) | `opacity: 0.5`, `scale(0.97)` — makes selected card pop |

### Icon Hover Animations

All subtle, 200-300ms, via `motion/react` `whileHover`:

| Vibe | Icon | Animation |
|------|------|-----------|
| Adventure | Mountain | Bounce pulse |
| Culture | Landmark | Gentle rotate wiggle |
| Disconnect | WifiOff | Slow float up-down |
| Celebration | Sparkles | Quick sparkle scale burst |

### Travel Type Pills

Small rounded pills in a horizontal row. Sage accent (`--accent`) when selected — same visual weight as current implementation. Secondary to vibe cards.

### Typography

| Element | Style |
|---------|-------|
| "What's your vibe?" | `font-heading text-3xl` desktop / `text-2xl` mobile |
| Vibe label | `text-base font-medium` |
| Vibe tagline | `text-sm text-text-secondary` |
| "Who's going?" | `text-sm text-text-secondary` |

## Interaction Model

### Selection → Collapse

1. User taps a vibe card
2. Card shows selected state immediately
3. 600ms pause to let the choice register
4. Hero animates into compact strip over ~400ms (spring easing)
5. `motion/react` `AnimatePresence` + `layout` prop handles the transition

### Re-expanding

- Click "Change" in strip (desktop) or tap vibe pill (mobile)
- Hero smoothly expands back with current selections highlighted
- Clicking same vibe deselects → hero stays expanded

### Clear All

- `X` button in strip clears both vibe and travel type
- Hero re-expands to full state

### Search param interaction

- If `?search=...` is set with no vibe, the hero auto-collapses to the strip so the search bar is visible. The hero only expands when there are no active filters at all.

### Transition Feedback

The 600ms pause + 400ms collapse animation provides perceived progress. No additional loading indicator is needed during the transition. The stays grid updates via server re-render as it does today (the `isPending` state from `FilterTransitionContext` is available if a subtle grid dim is desired later).

### Direct URL Access

- Landing on `?vibe=adventure&type=duo` shows collapsed strip immediately (no expand-then-collapse animation)
- Landing on `?search=treehouse` (no vibe) also shows collapsed strip (search bar needs to be visible)
- Landing on `/` with no params shows full hero

## Accessibility

- Each vibe card is a `<button>` with `aria-pressed` and `aria-label="Filter by {label}"`
- Travel type pills use the same pattern
- Standard focus ring via existing `outline-ring/50` focus-visible style
- Tab navigation between all interactive elements; no custom arrow-key handling needed
- Collapse/expand transitions respect `prefers-reduced-motion` — skip animations, show instant state change

## Component Architecture

### New Files

**`components/vibe-hero.tsx`** — single client component file containing:

- `VibeHero` (exported) — main component, manages expanded/collapsed state
- `VibeCard` (internal) — individual vibe card with hover animations
- `TravelTypePill` (internal) — small travel type toggle pill
- `CompactStrip` (internal) — collapsed toolbar with selected pills + search + sort. Must be `position: relative` to serve as the containing block for `SearchOverlay`

### Modified Files

**`app/(main)/page.tsx`**:
- Replace `<FilterPill>` import/usage with `<VibeHero>`
- Remove current sticky toolbar wrapper div
- Pass `staysCount` as prop to `VibeHero`; `SearchBar`, `SearchOverlay`, and `SortToggle` render inside `CompactStrip` (collapsed) and are hidden in the expanded hero
- The "Unique stays near you" heading and count remain below the hero/strip, unchanged

**`app/globals.css`**:
- Add to `:root`: `--vibe-culture: #8B7BB5`, `--vibe-disconnect: #6BA3A0`, `--vibe-celebration: #D4845A`
- Add to `@theme inline`: `--color-vibe-culture: var(--vibe-culture)`, `--color-vibe-disconnect: var(--vibe-disconnect)`, `--color-vibe-celebration: var(--vibe-celebration)` — required for Tailwind utility classes like `bg-vibe-culture`

### Deleted Files

**`components/filter-pill.tsx`** — fully replaced by `vibe-hero.tsx`

### No Changes

- Database schema (same `vibe` and `travel_type` columns/values)
- Dependencies (uses existing `motion/react`, `nuqs`, `lucide-react`)
- Server actions (`getStays` filters unchanged)
- Search params (`?vibe=...&type=...` same keys)
- `FilterTransitionContext` (still used for `startTransition`)

## Data Flow

Unchanged from current:

```
URL params (?vibe=X&type=Y) → nuqs → server re-render → getStays() → StaysGrid
```

The only change is where the filter UI renders, not how filtering works.

## Vibe Card Content

| Value | Label | Tagline | Icon |
|-------|-------|---------|------|
| `adventure` | Adventure | Get out there | Mountain |
| `culture` | Culture | Immerse yourself | Landmark |
| `disconnect` | Disconnect | Off the grid | WifiOff |
| `celebration` | Celebration | Something special | Sparkles |

## Travel Type Content

| Value | Label | Tagline | Icon |
|-------|-------|---------|------|
| `solo` | Solo | Just me | User |
| `duo` | Duo | For two | Users |
| `family` | Family | Kids welcome | House |
| `group` | Group | The crew | Globe |
