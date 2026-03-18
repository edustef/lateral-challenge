# Search-First Redesign

**Date:** 2026-03-18
**Status:** Approved

## Summary

Replace the vibe-picker hero with a search-first homepage. The AI search bar becomes the primary interaction — users describe what they want in natural language, and OpenAI breaks it down into structured filters (tags, type, price, amenities, location, travel type). No manual filter UI is exposed to the user.

The `vibe` column is replaced by a `tags text[]` column, allowing multiple freeform tags per stay instead of a single enum value.

## Goals

- Search bar is the hero of the homepage
- AI parses natural language into structured DB filters (not vector search)
- Tags replace vibe as a richer, multi-value categorization system
- Tags are backend-only — they inform AI filtering but don't appear in the UI
- Clean, minimal homepage with featured stays as the default state

## Non-Goals

- Tag management UI or admin interface
- Vector/semantic search
- User-facing filter controls (advanced filters stay hidden under the hood)
- Changing stay detail pages or booking flow

## Data Model

### Migration: `00004_replace_vibe_with_tags.sql`

Drop the `vibe` column and its CHECK constraint. Add a `tags text[]` column.

```sql
ALTER TABLE stays DROP COLUMN vibe;
ALTER TABLE stays ADD COLUMN tags text[] DEFAULT '{}';
```

No CHECK constraint on tags — freeform array like `amenities`.

### Tag Examples

Each stay gets 4-8 tags. Tags are descriptive and overlap across stays:

| Stay | Tags |
|------|------|
| Summit Treehouse | adventure, nature, mountain, solo-friendly, scenic-views, treehouse |
| Glacier Cabin | adventure, romantic, winter, mountain, hot-tub, fireplace |
| Kyoto Cabin | cultural, zen, minimalist, temples, solo-friendly, onsen |
| Forest Cabin | off-grid, nature, solitude, rustic, unplugged |
| Vineyard Houseboat | celebration, wine-country, group-friendly, luxury, waterfront |
| Savanna Glamping | off-grid, wildlife, luxury, safari, nature, scenic-views |

### Seed Data

All 45 stays updated: `vibe` column removed, `tags` array added. Full reseed via `supabase db reset --linked`.

## Homepage Layout

### Default State (No Search)

```
┌─────────────────────────────────────────────┐
│                  Wanderly                     │
│           Find your perfect escape            │
│    Describe what you're looking for and       │
│           let AI find it                      │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │ 🔍 Treehouse for two with a hot tub... │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  Popular stays                                │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │
│  │ img  │ │ img  │ │ img  │ │ img  │        │
│  │ name │ │ name │ │ name │ │ name │        │
│  │ $$$  │ │ $$$  │ │ $$$  │ │ $$$  │        │
│  └──────┘ └──────┘ └──────┘ └──────┘        │
└─────────────────────────────────────────────┘
```

- Hero: centered tagline + large search bar
- Below: "Popular stays" — 4 featured stay cards (top-rated from DB)
- Featured stays query: `getStays` with `sort: 'rating-desc'`, limit 4

### Post-Search State

```
┌─────────────────────────────────────────────┐
│ Wanderly  [🔍 romantic cabin with fireplace] │
├─────────────────────────────────────────────┤
│ ✨ Showing romantic cabins with fireplaces ✕ │
│                                               │
│ 6 stays found                                 │
│ ┌──────┐ ┌──────┐ ┌──────┐                  │
│ │ card │ │ card │ │ card │                  │
│ └──────┘ └──────┘ └──────┘                  │
│ ┌──────┐ ┌──────┐ ┌──────┐                  │
│ │ card │ │ card │ │ card │                  │
│ └──────┘ └──────┘ └──────┘                  │
└─────────────────────────────────────────────┘
```

- Hero collapses to compact sticky header with search bar
- Concierge summary banner shows AI interpretation
- Results grid below with count

## Search Focus Popover

### Desktop

On input focus, a popover drops below the search bar with hardcoded example queries:

```
┌─────────────────────────────────────────┐
│ Try something like                       │
│                                          │
│ 🌳 Treehouse for two with a hot tub     │
│    under $300                            │
│ ⛰️ Off-grid cabin with no wifi,         │
│    just nature                           │
│ 🎉 Group celebration spot for 8 in      │
│    wine country                          │
│ 🌏 Cultural escape in Japan or Bali     │
│ ❄️ Cozy winter cabin with fireplace     │
│    and sauna                             │
│ 💫 Luxury glamping with stargazing      │
│    under $500                            │
└─────────────────────────────────────────┘
```

- Closes on blur, Escape, or search submit
- Clicking a suggestion fills input and immediately submits (triggers AI parse)
- Stays visible while typing — no live filtering of suggestions

### Mobile

Tapping the search bar opens a full-screen overlay:

- Back arrow (top-left) to dismiss
- Auto-focused input at top
- Same suggestion list below, with larger touch targets
- Submitting closes overlay and shows results on main page

## Search Suggestions Data

Hardcoded array in `components/search-suggestions.tsx`:

```typescript
const SUGGESTIONS = [
  { emoji: '🌳', text: 'Treehouse for two with a hot tub under $300' },
  { emoji: '⛰️', text: 'Off-grid cabin with no wifi, just nature' },
  { emoji: '🎉', text: 'Group celebration spot for 8 in wine country' },
  { emoji: '🌏', text: 'Cultural escape in Japan or Bali' },
  { emoji: '❄️', text: 'Cozy winter cabin with fireplace and sauna' },
  { emoji: '💫', text: 'Luxury glamping with stargazing under $500' },
]
```

## AI Filter Schema Changes

### `ConciergeResult` Type

Replace the `vibe` field with `tags`:

```typescript
// REMOVE
vibe: string | null;

// ADD
tags: string[] | null;
```

Also remove the `VIBES` constant array from `concierge-schema.ts`.

### OpenAI Function: `extract_search_filters`

Replace `vibe` parameter with `tags`:

```typescript
// REMOVE
vibe: { type: 'string', enum: ['adventure', 'culture', 'disconnect', 'celebration'] }

// ADD
tags: {
  type: 'array',
  items: { type: 'string' },
  description: 'Tags describing the mood/theme. Examples: adventure, romantic, off-grid, cultural, winter, luxury, nature, wildlife, zen, celebration, solo-friendly, group-friendly, waterfront, mountain, scenic-views'
}
```

System prompt updated to reference tags instead of vibes.

### Query Mapping in `getStays`

```typescript
// REMOVE
if (filters.vibe) query = query.eq('vibe', filters.vibe);

// ADD
if (filters.tags?.length) query = query.overlaps('tags', filters.tags);
```

`overlaps` returns stays where the `tags` array has ANY overlap with the requested tags (OR logic). A query for `['romantic', 'fireplace']` matches stays tagged with either `romantic` OR `fireplace`.

## URL Search Params

### Remove
- `vibe` — no longer exists

### Add
- `tags` — `parseAsArrayOf(parseAsString)` (same pattern as `amenities`)

## Component Changes

### Delete
- `components/vibe-hero.tsx` — replaced entirely
- `components/filter-pill.tsx` — already deleted

### Create
- `components/search-hero.tsx` — new hero: tagline + centered search bar + handles popover state (desktop) and mobile overlay trigger
- `components/search-suggestions.tsx` — hardcoded suggestion list, shared between desktop popover and mobile overlay

### Modify
- `components/search-bar.tsx` — add `onFocus`/`onBlur` callbacks for popover control, keep AI submission logic
- `components/filter-transition-context.tsx` — remove vibe-related references
- `lib/actions/stays.ts` — replace `vibe` filter with `tags` overlaps, add `getFeaturedStays` function (top-rated, limit 4 via `.limit(4)`)
- `lib/actions/concierge.ts` — update system prompt for tags
- `lib/concierge-schema.ts` — replace `vibe` with `tags` in OpenAI function schema, update `isSimpleQuery` if needed
- `lib/search-params.ts` — remove `vibe`, add `tags`
- `app/(main)/page.tsx` — replace VibeHero with SearchHero, add featured stays for default state

### Keep As-Is
- `components/concierge-summary.tsx`
- `components/stays-grid.tsx`
- `components/stay-card.tsx`
- `components/sort-toggle.tsx`

## Error Handling

- If OpenAI fails → fall back to text search (existing behavior, no change)
- If no results from tag filter → show "No stays match your search" with a "Clear search" button
- Featured stays query failure → show empty state gracefully

## Testing

- Verify AI parses "romantic cabin" → `{ tags: ['romantic'], stayType: 'cabin' }`
- Verify `overlaps` returns correct stays for single and multiple tags
- Verify suggestion click fills input and triggers search
- Verify mobile overlay opens/closes correctly
- Verify featured stays show on default homepage
- Verify concierge summary banner still works after search
