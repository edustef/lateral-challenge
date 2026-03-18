# Unified Filter Pill Bar

## Summary

Replace the separate VibePicker, VibePickerMobile, and toolbar layout with a single Airbnb-style pill-shaped bar containing Who and Vibe segments. Text search remains separate. Fix mobile sticky toolbar spacing bug.

## Current State

- `vibe-picker.tsx` — desktop-only (`hidden md:flex`), Popover with Who + Vibe chip grids, includes a "Clear" button when filters are active
- `vibe-picker-mobile.tsx` — mobile-only (`md:hidden`), Drawer with same chip grids, footer has "Reset" + "Show N stays" buttons
- `search-bar.tsx` — desktop inline input + mobile icon button; `SearchOverlay` renders inside the toolbar using `absolute inset-0`
- `sort-toggle.tsx` — Popover-based sort toggle, lives in a **separate div below** the toolbar (not inside it)
- `page.tsx` adds another layer of responsive wrapping (`hidden md:block` / `shrink-0 md:hidden`) around the components
- `travelTypes` and `vibes` arrays are duplicated in both vibe-picker files
- Both components consume `useFilterTransition()` from `FilterTransitionContext` for nuqs `startTransition`
- Toolbar has `sticky top-14` which assumes sticky header above — breaks on mobile where header is `md:sticky`

## Design

### Pill Bar Component (`filter-pill.tsx`)

A single `'use client'` component that renders an Airbnb-style pill-shaped bar with two labeled segments:

```
┌─────────────┬─────────────┐
│  Who         │  Vibe        │
│  Anyone      │  Any vibe    │
└─────────────┴─────────────┘
```

Each segment shows:
- **Label** (small, bold): "Who" / "Vibe"
- **Value** (muted): selected value or placeholder ("Anyone" / "Any vibe")

When a filter is active, the segment value updates to show the selection (e.g., "Solo", "Adventure").

**Props:** `{ staysCount: number }` — used for the mobile drawer footer "Show N stays" button.

**Shared constants:** Extract `travelTypes` and `vibes` arrays into the top of `filter-pill.tsx` (single source, no duplication).

**Responsive strategy:** Render both Popover and Drawer markup, use CSS classes (`hidden md:block` / `md:hidden`) to show/hide. This matches the existing pattern, avoids hydration mismatches, and keeps things simple. The parent `page.tsx` should NOT add its own responsive wrappers — the component handles it internally.

#### Desktop (md+)

Clicking anywhere on the pill opens a single Popover below it containing both "Who's traveling?" and "What's the vibe?" chip grids. Same content/behavior as current VibePicker popover.

#### Mobile (<md)

Tapping the pill opens a bottom Drawer with the same chip grids. Drawer footer retains:
- Summary text (e.g., "Solo traveler · Adventure vibe")
- Two-column grid: "Reset" button (clears both filters) + "Show N stays" button (closes drawer)

Same content/behavior as current VibePickerMobile drawer.

#### Clear/Reset Behavior

- **Desktop:** When filters are active, show an X button to the right of the pill (outside the pill, same position as current "Clear" button). Clicking clears both `type` and `vibe` params.
- **Mobile:** Reset button inside the drawer footer (same as current).

#### Icons

- No Sparkles icon on the pill trigger (cleaner two-line layout replaces it)
- ChevronDown not needed (the pill itself is the affordance)
- Type/vibe icons still appear on the chip buttons inside the popover/drawer content

#### Accessibility

Preserve existing patterns: `aria-label` on the pill trigger, `aria-pressed` on chip buttons, `sr-only` drawer title.

### Toolbar Layout

```
[FilterPill] [ClearX?]          [SearchIcon]
```

- FilterPill + optional Clear button are left-aligned
- SearchBar stays right-aligned (icon button on mobile, inline input on desktop)
- `SearchOverlay` continues to render inside the toolbar's `relative` container (unchanged)
- SortToggle stays in its own div below the toolbar (unchanged, not moving)

### Sticky Toolbar Fix

The toolbar in `page.tsx` currently has `sticky top-14`. Since the header is `md:sticky`:
- Mobile: toolbar should be `sticky top-0` (header scrolls away)
- Desktop: toolbar should be `sticky top-14` (header is sticky above)
- Fix: change to `sticky top-0 md:top-14`

### Components

**New:**
- `components/filter-pill.tsx` — unified pill bar, handles Popover (desktop) and Drawer (mobile), consumes `useFilterTransition()` for startTransition

**Delete:**
- `components/vibe-picker.tsx` — replaced by filter-pill
- `components/vibe-picker-mobile.tsx` — replaced by filter-pill

**Unchanged:**
- `components/search-bar.tsx` — stays to the right of the pill (SearchOverlay still works via absolute positioning)
- `components/sort-toggle.tsx` — stays in its own row below the toolbar

**Updated:**
- `app/(main)/page.tsx` — swap VibePicker + VibePickerMobile imports for single FilterPill, remove extra responsive wrapper divs, fix `top-14` to `top-0 md:top-14`

### Data Flow

No changes to query param structure. The pill reads/writes the same `type` and `vibe` nuqs query params via `searchParamsParsers` with `startTransition` from `useFilterTransition()`. The component must be rendered inside `FilterTransitionProvider` (already the case in page.tsx).

### Visual Style

- Pill: `rounded-full` border, white background, subtle shadow (`shadow-sm`), vertical divider between segments
- Segments: two-line layout (label + value), generous padding for comfortable tap targets
- Active state: when filters are selected, pill border/bg shifts to accent tint (`border-accent bg-accent-tint`) matching current active chip style
- Chip grids inside popover/drawer: unchanged from current design
- Consistent with existing design tokens (border-border, text-primary, text-muted, accent, accent-tint, etc.)
