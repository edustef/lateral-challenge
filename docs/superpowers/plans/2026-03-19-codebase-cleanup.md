# Codebase Cleanup & Reorganization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the flat components directory into feature folders, break up oversized files, extract shared hooks and utilities, and deduplicate repeated patterns.

**Architecture:** Feature-folder grouping (search/, booking/, stays/, layout/) with two-layer hook extraction for search params. Shared UI pieces (GuestCounter) extracted. Date utilities consolidated. No behavior changes except fixing a latent bug where the AI fallback path leaves stale filter params.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, nuqs, base UI components

**Spec:** `docs/superpowers/specs/2026-03-19-codebase-cleanup-design.md`

---

### Task 1: Create shared date utilities

Extract duplicated date functions into `lib/utils/date.ts` before moving files, so the moves can reference the new location immediately.

**Files:**
- Modify: `lib/utils/date.ts`
- Modify: `lib/utils/__tests__/date.test.ts`

- [ ] **Step 1: Add tests for the new date utils**

Add to `lib/utils/__tests__/date.test.ts`:

```typescript
import { rangeOverlapsDisabled, parseDate } from '../date';

describe('rangeOverlapsDisabled', () => {
  const disabled = [{ from: '2026-04-10', to: '2026-04-15' }];

  it('returns true when range overlaps disabled dates', () => {
    const checkIn = new Date('2026-04-12T12:00:00');
    const checkOut = new Date('2026-04-18T12:00:00');
    expect(rangeOverlapsDisabled(checkIn, checkOut, disabled)).toBe(true);
  });

  it('returns false when range is outside disabled dates', () => {
    const checkIn = new Date('2026-04-01T12:00:00');
    const checkOut = new Date('2026-04-05T12:00:00');
    expect(rangeOverlapsDisabled(checkIn, checkOut, disabled)).toBe(false);
  });

  it('returns false for empty disabled array', () => {
    const checkIn = new Date('2026-04-10T12:00:00');
    const checkOut = new Date('2026-04-15T12:00:00');
    expect(rangeOverlapsDisabled(checkIn, checkOut, [])).toBe(false);
  });
});

describe('parseDate', () => {
  it('parses a valid date string anchored to noon', () => {
    const d = parseDate('2026-04-10');
    expect(d).toBeInstanceOf(Date);
    expect(d!.getHours()).toBe(12);
  });

  it('returns undefined for undefined input', () => {
    expect(parseDate(undefined)).toBeUndefined();
  });

  it('returns undefined for invalid date string', () => {
    expect(parseDate('not-a-date')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run lib/utils/__tests__/date.test.ts`
Expected: FAIL — `rangeOverlapsDisabled` and `parseDate` not exported from `../date`

- [ ] **Step 3: Add the functions to `lib/utils/date.ts`**

Append to `lib/utils/date.ts`:

```typescript
/**
 * Returns true if [checkIn, checkOut) overlaps any disabled date range.
 * Disabled range boundaries use midnight (T00:00:00) for date-only comparison.
 */
export function rangeOverlapsDisabled(
  checkIn: Date,
  checkOut: Date,
  disabledDates: { from: string; to: string }[],
): boolean {
  return disabledDates.some((range) => {
    const from = new Date(range.from + 'T00:00:00');
    const to = new Date(range.to + 'T00:00:00');
    return checkIn < to && checkOut > from;
  });
}

/**
 * Parses a YYYY-MM-DD string into a Date anchored at noon (T12:00:00)
 * to avoid timezone edge cases where midnight rolls to the previous day.
 * Returns undefined if input is missing or invalid.
 */
export function parseDate(str?: string): Date | undefined {
  if (!str) return undefined;
  const d = new Date(str + 'T12:00:00');
  return isNaN(d.getTime()) ? undefined : d;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run lib/utils/__tests__/date.test.ts`
Expected: ALL PASS

- [ ] **Step 5: Commit**

```bash
git add lib/utils/date.ts lib/utils/__tests__/date.test.ts
git commit -m "feat: extract rangeOverlapsDisabled and parseDate into shared date utils"
```

---

### Task 2: Create `useSearchParams` hook (Layer 1)

Thin wrapper around the repeated `useQueryStates` call with all 9 search params + a `NULL_PARAMS` constant.

**Files:**
- Create: `lib/hooks/use-search-params.ts`

- [ ] **Step 1: Create `lib/hooks/use-search-params.ts`**

```typescript
'use client';

import type { TransitionStartFunction } from 'react';
import { useQueryStates } from 'nuqs';
import { searchParamsParsers } from '@/lib/search-params';

/** All search params set to null — used for clearing filters. */
export const NULL_PARAMS = {
  q: null,
  locations: null,
  countries: null,
  type: null,
  tags: null,
  sort: null,
  stayType: null,
  maxPrice: null,
  amenities: null,
} as const;

/**
 * Thin wrapper around useQueryStates for all 9 search params.
 * Provides params, setParams, and a clearAll helper.
 */
export function useSearchParamsState(startTransition?: TransitionStartFunction) {
  const [params, setParams] = useQueryStates(
    {
      q: searchParamsParsers.q,
      locations: searchParamsParsers.locations,
      countries: searchParamsParsers.countries,
      type: searchParamsParsers.type,
      tags: searchParamsParsers.tags,
      sort: searchParamsParsers.sort,
      stayType: searchParamsParsers.stayType,
      maxPrice: searchParamsParsers.maxPrice,
      amenities: searchParamsParsers.amenities,
    },
    startTransition ? { startTransition } : {},
  );

  function clearAll() {
    setParams(NULL_PARAMS);
  }

  return { params, setParams, clearAll };
}
```

- [ ] **Step 2: Verify build compiles**

Run: `pnpm exec tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add lib/hooks/use-search-params.ts
git commit -m "feat: add useSearchParamsState hook to consolidate search param wiring"
```

---

### Task 3: Create `useSearchQuery` hook (Layer 2)

Input state, AI submit logic, throttle, and clear — built on `useSearchParamsState`.

**Files:**
- Create: `lib/hooks/use-search-query.ts`

- [ ] **Step 1: Create `lib/hooks/use-search-query.ts`**

```typescript
'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { parseNaturalQuery } from '@/lib/actions/concierge';
import { useFilterTransition } from '@/components/filter-transition-context';
import { useSearchParamsState, NULL_PARAMS } from '@/lib/hooks/use-search-params';

/**
 * Full search input logic: local input state, AI-powered submit with throttle,
 * clear, and Enter key handling. Built on useSearchParamsState.
 *
 * Escape handling is left to consumers since desktop (blur) and mobile
 * (close overlay) behaviors differ.
 */
export function useSearchQuery() {
  const { startTransition, setSummary } = useFilterTransition();
  const { params, setParams, clearAll } = useSearchParamsState(startTransition);
  const [localValue, setLocalValue] = useState(params.q ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const lastAiCall = useRef(0);

  // Sync local value when URL q param changes externally
  useEffect(() => {
    setLocalValue(params.q ?? '');
  }, [params.q]);

  const submitQuery = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) {
        clearAll();
        setSummary(null);
        return;
      }

      // Throttle: ignore if less than 1s since last AI call
      const now = Date.now();
      if (now - lastAiCall.current < 1000) return;
      lastAiCall.current = now;

      setIsLoading(true);
      try {
        const result = await parseNaturalQuery(trimmed);
        if (!result) {
          // AI failed — fall back to text search, reset ALL params (bug fix)
          setSummary(null);
          setParams({
            ...NULL_PARAMS,
            q: trimmed,
            locations: [trimmed],
          });
          return;
        }

        setSummary(result.summary);
        setParams({
          q: trimmed,
          locations: result.locations ?? null,
          countries: result.countries ?? null,
          type: result.travel_type ?? null,
          tags: result.tags ?? null,
          sort: result.sort ?? null,
          stayType: result.stay_type ?? null,
          maxPrice: result.max_price ? result.max_price * 100 : null,
          amenities: result.amenities ?? null,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setParams, setSummary, clearAll],
  );

  const handleClear = useCallback(() => {
    setLocalValue('');
    setSummary(null);
    clearAll();
  }, [setSummary, clearAll]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitQuery(localValue);
      }
    },
    [submitQuery, localValue],
  );

  return {
    localValue,
    setLocalValue,
    isLoading,
    submitQuery,
    handleClear,
    handleKeyDown,
    params,
  };
}
```

- [ ] **Step 2: Verify build compiles**

Run: `pnpm exec tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add lib/hooks/use-search-query.ts
git commit -m "feat: add useSearchQuery hook with AI submit, throttle, and param management"
```

---

### Task 4: Create GuestCounter component

Extract the duplicated +/- stepper before moving booking files.

**Files:**
- Create: `components/guest-counter.tsx`

- [ ] **Step 1: Create `components/guest-counter.tsx`**

```typescript
'use client';

import { Users, Minus, Plus } from 'lucide-react';

interface GuestCounterProps {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  className?: string;
}

export function GuestCounter({ value, min = 1, max, onChange, className }: GuestCounterProps) {
  return (
    <div className={className ?? "flex items-center justify-between rounded-small border border-border bg-bg-card px-4 h-11 sm:h-12"}>
      <div className="flex items-center gap-2.5">
        <Users size={16} className="text-text-muted" />
        <span className="text-sm text-text-primary">
          {value} adult{value !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label="Decrease guests"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-text-secondary hover:bg-bg-muted disabled:opacity-40 transition"
        >
          <Minus size={14} />
        </button>
        <span className="min-w-[1.25rem] text-center text-sm font-medium text-text-primary">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label="Increase guests"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white disabled:opacity-40 transition"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build compiles**

Run: `pnpm exec tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/guest-counter.tsx
git commit -m "feat: extract GuestCounter into shared component"
```

---

### Task 5: Move search components into `components/search/`

Move 4 files, split `search-bar.tsx` into `search-bar.tsx` + `search-overlay.tsx` using the new hooks, update all import consumers.

**Files:**
- Create: `components/search/search-bar.tsx` (rewritten, uses `useSearchQuery`)
- Create: `components/search/search-overlay.tsx` (rewritten, uses `useSearchQuery`)
- Move: `components/search-hero.tsx` -> `components/search/search-hero.tsx`
- Move: `components/search-suggestions.tsx` -> `components/search/search-suggestions.tsx`
- Move: `components/mobile-search-fab.tsx` -> `components/search/mobile-search-fab.tsx`
- Move: `components/concierge-summary.tsx` -> `components/search/concierge-summary.tsx`
- Delete: `components/search-bar.tsx` (replaced by two new files)
- Modify imports in:
  - `app/(main)/layout.tsx` (SearchOverlay, MobileSearchFab)
  - `app/(main)/page.tsx` (SearchHero, ConciergeSummary)
  - `components/search/search-hero.tsx` (SearchBar — internal reference)
  - `components/search/search-bar.tsx` (SearchSuggestions — internal reference)

- [ ] **Step 1: Create `components/search/` directory**

```bash
mkdir -p components/search
```

- [ ] **Step 2: Write `components/search/search-bar.tsx`**

Desktop-only search input, rewritten to use `useSearchQuery`. Uses base-ui `Popover` with controlled `open` state wired to focus/blur to preserve the original focus-based interaction (not click-based):

```typescript
'use client';

import { useRef, useState } from 'react';
import { Search, Sparkles, X, Loader2 } from 'lucide-react';
import { useSearchQuery } from '@/lib/hooks/use-search-query';
import { SearchSuggestions } from '@/components/search/search-suggestions';
import { Popover, PopoverContent } from '@/components/ui/popover';

type SearchBarProps = {
  compact?: boolean;
};

/**
 * AI-powered search bar (desktop only, hidden on mobile).
 * Simple queries do text search; complex queries are parsed by AI into structured filters.
 * Submits on Enter. Focus popover shows suggestions in hero mode.
 */
export function SearchBar({ compact = false }: SearchBarProps) {
  const {
    localValue,
    setLocalValue,
    isLoading,
    submitQuery,
    handleClear,
    handleKeyDown: baseKeyDown,
  } = useSearchQuery();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  function handleKeyDown(e: React.KeyboardEvent) {
    baseKeyDown(e);
    if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  }

  const inputSize = compact
    ? 'h-10 text-base rounded-full'
    : 'h-10 text-base rounded-full md:h-14';

  const input = (
    <div ref={wrapperRef} className={`relative ${compact ? 'w-full max-w-sm' : 'w-full'}`}>
      <Sparkles className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-accent ${compact ? 'h-4 w-4' : 'h-4 w-4 md:left-4 md:h-5 md:w-5'}`} />
      <input
        ref={inputRef}
        type="text"
        placeholder="Try 'cozy cabin for 2 under $200'..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={isLoading}
        className={`${inputSize} w-full border bg-white font-medium text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none ${
          compact ? 'pl-9 pr-9' : 'pl-9 pr-16 md:pl-11 md:pr-20'
        } ${isLoading ? 'border-accent animate-pulse opacity-70' : 'border-border'}`}
      />
      {isLoading ? (
        <Loader2 className={`absolute top-1/2 -translate-y-1/2 animate-spin text-accent ${compact ? 'right-3 h-3.5 w-3.5' : 'right-4 h-4 w-4 md:right-5'}`} />
      ) : localValue ? (
        <button
          type="button"
          onClick={() => { handleClear(); inputRef.current?.focus(); }}
          aria-label="Clear search"
          className={`absolute top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary ${compact ? 'right-3' : 'right-14 md:right-[4.5rem]'}`}
        >
          <X className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
        </button>
      ) : null}
      {!compact && (
        <button
          type="button"
          onClick={() => submitQuery(localValue)}
          aria-label="Search"
          className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent/90 md:right-2 md:h-10 md:w-10"
        >
          <Search className="h-3.5 w-3.5 md:h-4 md:w-4" />
        </button>
      )}
    </div>
  );

  if (compact) {
    return <div className="hidden md:block">{input}</div>;
  }

  return (
    <div className="hidden md:block w-full">
      <Popover open={!compact && isFocused} onOpenChange={setIsFocused}>
        {input}
        <PopoverContent
          align="start"
          sideOffset={8}
          className="rounded-xl border border-border bg-white p-4 shadow-lg"
        >
          <SearchSuggestions onSelect={(text) => { setLocalValue(text); setIsFocused(false); submitQuery(text); }} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
```

- [ ] **Step 3: Write `components/search/search-overlay.tsx`**

Mobile full-screen overlay, rewritten to use `useSearchQuery`:

```typescript
'use client';

import { useRef, useEffect } from 'react';
import { Search, Sparkles, X, Loader2 } from 'lucide-react';
import { useSearchQuery } from '@/lib/hooks/use-search-query';
import { useFilterTransition } from '@/components/filter-transition-context';
import { SearchSuggestions } from '@/components/search/search-suggestions';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

/**
 * Mobile-only full-screen search overlay with input and suggestions.
 */
export function SearchOverlay() {
  const { searchExpanded, setSearchExpanded } = useFilterTransition();
  const {
    localValue,
    setLocalValue,
    isLoading,
    submitQuery,
    handleClear,
    handleKeyDown: baseKeyDown,
  } = useSearchQuery();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleKeyDown(e: React.KeyboardEvent) {
    baseKeyDown(e);
    if (e.key === 'Escape') {
      setSearchExpanded(false);
    }
  }

  function handleSubmit() {
    submitQuery(localValue).then(() => setSearchExpanded(false));
  }

  function handleDismiss() {
    handleClear();
    setSearchExpanded(false);
  }

  useEffect(() => {
    if (searchExpanded) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [searchExpanded]);

  return (
    <Dialog open={searchExpanded} onOpenChange={setSearchExpanded}>
      <DialogContent
        showCloseButton={false}
        className="fixed inset-0 top-0 left-0 flex h-dvh w-full max-w-none -translate-x-0 -translate-y-0 flex-col rounded-none ring-0 md:hidden"
      >
        <DialogTitle className="sr-only">Search stays</DialogTitle>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Sparkles className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
            <input
              ref={inputRef}
              type="text"
              autoFocus
              placeholder="Try 'cozy cabin for 2 under $200'..."
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className={`h-10 w-full rounded-full border bg-white pl-9 pr-14 text-base text-text-primary placeholder:text-text-muted focus:outline-none ${
                isLoading
                  ? 'border-accent animate-pulse opacity-70'
                  : 'border-accent'
              }`}
            />
            {isLoading ? (
              <Loader2 className="absolute right-12 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-accent" />
            ) : localValue ? (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { setLocalValue(''); inputRef.current?.focus(); }}
                aria-label="Clear search text"
                className="absolute right-12 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleSubmit}
              aria-label="Search"
              className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent/90"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSearchExpanded(false)}
            aria-label="Close search"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-text-secondary hover:text-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          <SearchSuggestions onSelect={(text) => { setLocalValue(text); submitQuery(text).then(() => setSearchExpanded(false)); }} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 4: Move remaining search files**

```bash
mv components/search-hero.tsx components/search/search-hero.tsx
mv components/search-suggestions.tsx components/search/search-suggestions.tsx
mv components/mobile-search-fab.tsx components/search/mobile-search-fab.tsx
mv components/concierge-summary.tsx components/search/concierge-summary.tsx
```

- [ ] **Step 5: Update `search-hero.tsx` import**

In `components/search/search-hero.tsx`, change:
- `from '@/components/search-bar'` -> `from '@/components/search/search-bar'`

- [ ] **Step 6: Rewrite `mobile-search-fab.tsx` to use `useSearchParamsState`**

Replace the `useQueryStates` call and inline null object with:

```typescript
'use client';

import { usePathname } from 'next/navigation';
import { Search, Sparkles, X } from 'lucide-react';
import { useFilterTransition } from '@/components/filter-transition-context';
import { useSearchParamsState } from '@/lib/hooks/use-search-params';
import { useCallback } from 'react';

export function MobileSearchFab() {
  const pathname = usePathname();
  const { startTransition, setSearchExpanded, setSummary } = useFilterTransition();
  const { params, clearAll } = useSearchParamsState(startTransition);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSummary(null);
    clearAll();
  }, [clearAll, setSummary]);

  if (pathname !== '/') return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 flex justify-center px-6 pb-4 md:hidden"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))' }}
    >
      <button
        type="button"
        onClick={() => setSearchExpanded(true)}
        className="flex h-11 max-w-xs items-center gap-2 rounded-full border border-border bg-white pl-3 pr-1.5 shadow-lg transition-shadow active:shadow-md"
      >
        {params.q ? (
          <Search className="h-4 w-4 shrink-0 text-accent" />
        ) : (
          <Sparkles className="h-4 w-4 shrink-0 text-accent" />
        )}
        <span className={`flex-1 truncate text-sm font-medium ${params.q ? 'text-text-primary' : 'text-text-muted'}`}>
          {params.q || "Try 'cozy cabin for 2 under $200'..."}
        </span>
        {params.q && (
          <span
            role="button"
            onClick={handleClear}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg-muted text-text-secondary"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        )}
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-white">
          <Search className="h-3.5 w-3.5" />
        </span>
      </button>
    </div>
  );
}
```

- [ ] **Step 7: Rewrite `concierge-summary.tsx` to use `useSearchParamsState`**

Replace the `useQueryStates` call and inline null object with:

```typescript
'use client';

import { useCallback, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFilterTransition } from '@/components/filter-transition-context';
import { useSearchParamsState } from '@/lib/hooks/use-search-params';

export function ConciergeSummary() {
  const { summary, setSummary, startTransition } = useFilterTransition();
  const { params, clearAll } = useSearchParamsState(startTransition);

  useEffect(() => {
    if (!params.q && summary) {
      setSummary(null);
    }
  }, [params.q, summary, setSummary]);

  const displayText = summary || params.q;

  const handleDismiss = useCallback(() => {
    setSummary(null);
    clearAll();
  }, [setSummary, clearAll]);

  return (
    <AnimatePresence>
      {displayText && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="mx-auto flex max-w-7xl items-center gap-2 px-4 pt-3 sm:px-6 lg:px-8"
        >
          <div className="flex flex-1 items-center gap-2 rounded-button bg-accent-tint px-3 py-2">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-accent" />
            <span className="text-sm text-accent">{displayText}</span>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss AI summary and clear filters"
              className="ml-auto shrink-0 text-accent/60 transition-colors hover:text-accent"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 8: Update import consumers**

In `app/(main)/layout.tsx`:
- `from '@/components/search-bar'` -> `from '@/components/search/search-overlay'`
- `from '@/components/mobile-search-fab'` -> `from '@/components/search/mobile-search-fab'`

In `app/(main)/page.tsx`:
- `from '@/components/search-hero'` -> `from '@/components/search/search-hero'`
- `from '@/components/concierge-summary'` -> `from '@/components/search/concierge-summary'`

In `components/header-bar.tsx` (not yet moved, still at root):
- `from '@/components/search-bar'` -> `from '@/components/search/search-bar'`

- [ ] **Step 9: Delete old `components/search-bar.tsx`**

```bash
rm components/search-bar.tsx
```

- [ ] **Step 10: Verify build**

Run: `pnpm exec tsc --noEmit && pnpm build`
Expected: No errors

- [ ] **Step 11: Commit**

```bash
git add -A components/ lib/hooks/ app/(main)/layout.tsx app/(main)/page.tsx
git commit -m "refactor: move search components into feature folder, extract useSearchQuery hook"
```

---

### Task 6: Move booking components into `components/booking/`

Move 4 files, extract checkout summary, wire up GuestCounter and shared date utils.

**Files:**
- Move: `components/checkout-form.tsx` -> `components/booking/checkout-form.tsx` (modified)
- Create: `components/booking/checkout-summary.tsx`
- Move: `components/booking-sidebar.tsx` -> `components/booking/booking-sidebar.tsx` (modified)
- Move: `components/booking-card.tsx` -> `components/booking/booking-card.tsx`
- Move: `components/date-picker.tsx` -> `components/booking/date-picker.tsx`
- Move: `components/price-breakdown.tsx` -> `components/booking/price-breakdown.tsx`
- Modify imports in:
  - `app/(main)/stays/[slug]/book/page.tsx`
  - `app/(main)/stays/[slug]/page.tsx`
  - `app/(main)/profile/page.tsx`

- [ ] **Step 1: Create `components/booking/` directory and move simple files**

```bash
mkdir -p components/booking
mv components/booking-card.tsx components/booking/booking-card.tsx
mv components/date-picker.tsx components/booking/date-picker.tsx
mv components/price-breakdown.tsx components/booking/price-breakdown.tsx
```

- [ ] **Step 2: Create `components/booking/checkout-summary.tsx`**

Extract the summary sidebar from `checkout-form.tsx`:

```typescript
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import { PriceBreakdown } from '@/components/booking/price-breakdown';

interface CheckoutSummaryProps {
  stay: {
    title: string;
    location: string;
    images: string[];
    price_per_night: number;
    cleaning_fee: number;
    service_fee: number;
  };
  nights: number;
}

export function CheckoutSummary({ stay, nights }: CheckoutSummaryProps) {
  return (
    <div className="lg:sticky lg:top-6">
      <div className="rounded-card border border-border bg-bg-card p-4 space-y-3">
        <div className="flex items-center gap-3 lg:flex-col lg:items-stretch lg:gap-0">
          {stay.images[0] && (
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-small lg:h-[180px] lg:w-full">
              <Image
                src={stay.images[0]}
                alt={stay.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="min-w-0 lg:mt-4">
            <h3 className="font-heading text-sm font-medium text-text-primary lg:text-lg">
              {stay.title}
            </h3>
            <p className="text-xs text-text-secondary">{stay.location}</p>
          </div>
        </div>

        <div className="h-px bg-bg-muted" />

        <PriceBreakdown
          pricePerNight={stay.price_per_night}
          nights={nights || 1}
          cleaningFee={stay.cleaning_fee}
          serviceFee={stay.service_fee}
        />

        <div className="flex items-start gap-2">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-accent" />
          <p className="text-xs text-text-secondary">
            Secure checkout · No payment until confirmation
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Rewrite `checkout-form.tsx` → `components/booking/checkout-form.tsx`**

Replace the inline summary and guest counter with extracted components, use shared date utils:

- Remove `rangeOverlapsDisabled` and `parseDate` functions (import from `@/lib/utils/date`)
- Remove the guest counter JSX block (replace with `<GuestCounter>`)
- Remove the summary sidebar JSX block (replace with `<CheckoutSummary>`)
- Update internal imports to use `@/components/booking/price-breakdown`, `@/components/booking/date-picker`

Key import changes at top of file:
```typescript
import { GuestCounter } from '@/components/guest-counter';
import { CheckoutSummary } from '@/components/booking/checkout-summary';
import { PriceBreakdown } from '@/components/booking/price-breakdown';
import { DatePicker } from '@/components/booking/date-picker';
import { rangeOverlapsDisabled, parseDate } from '@/lib/utils/date';
```

Replace the guest section JSX (lines 198-233) with:
```tsx
<GuestCounter value={guests} max={stay.max_guests} onChange={setGuests} />
```

Replace the summary column JSX (lines 326-366) with:
```tsx
<CheckoutSummary stay={stay} nights={nights} />
```

- [ ] **Step 4: Rewrite `booking-sidebar.tsx` → `components/booking/booking-sidebar.tsx`**

- Remove `defaultsOverlapDisabled` (use `rangeOverlapsDisabled` from `@/lib/utils/date`)
- Remove the guest counter JSX block (replace with `<GuestCounter>`)
- Update internal imports to use `@/components/booking/date-picker`, `@/components/booking/price-breakdown`

Key import changes:
```typescript
import { GuestCounter } from '@/components/guest-counter';
import { DatePicker } from '@/components/booking/date-picker';
import { PriceBreakdown } from '@/components/booking/price-breakdown';
import { rangeOverlapsDisabled } from '@/lib/utils/date';
```

Replace the guest section JSX (lines 119-154) with:
```tsx
<GuestCounter
  value={guests}
  max={stay.max_guests}
  onChange={setGuests}
  className="flex items-center justify-between rounded-small border border-border bg-bg-card px-4 h-12"
/>
```

Replace `defaultsOverlapDisabled` usage with `rangeOverlapsDisabled`.

- [ ] **Step 5: Update import consumers**

In `app/(main)/stays/[slug]/book/page.tsx`:
- `from '@/components/checkout-form'` -> `from '@/components/booking/checkout-form'`

In `app/(main)/stays/[slug]/page.tsx`:
- `from '@/components/booking-sidebar'` -> `from '@/components/booking/booking-sidebar'`

In `app/(main)/profile/page.tsx`:
- `from '@/components/booking-card'` -> `from '@/components/booking/booking-card'`

- [ ] **Step 6: Delete old files**

```bash
rm components/checkout-form.tsx components/booking-sidebar.tsx components/booking-card.tsx components/date-picker.tsx components/price-breakdown.tsx
```

- [ ] **Step 7: Verify build**

Run: `pnpm exec tsc --noEmit && pnpm build`
Expected: No errors

- [ ] **Step 8: Run tests**

Run: `pnpm vitest run`
Expected: All pass

- [ ] **Step 9: Commit**

```bash
git add -A components/ app/(main)/stays/ app/(main)/profile/
git commit -m "refactor: move booking components into feature folder, extract CheckoutSummary and GuestCounter"
```

---

### Task 7: Move stays components into `components/stays/`

Move 6 files, update import consumers.

**Files:**
- Move: `components/stay-card.tsx` -> `components/stays/stay-card.tsx`
- Move: `components/stay-info.tsx` -> `components/stays/stay-info.tsx`
- Move: `components/stays-grid.tsx` -> `components/stays/stays-grid.tsx`
- Move: `components/photo-gallery.tsx` -> `components/stays/photo-gallery.tsx`
- Move: `components/review-form.tsx` -> `components/stays/review-form.tsx`
- Move: `components/reviews-list.tsx` -> `components/stays/reviews-list.tsx`
- Modify imports in:
  - `app/(main)/page.tsx` (StaysGrid)
  - `app/(main)/wishlist/page.tsx` (StaysGrid)
  - `app/(main)/stays/[slug]/page.tsx` (StayInfo, PhotoGallery, ReviewForm, ReviewsList)
  - `app/(main)/profile/page.tsx` (StayCard)
  - `components/stays/stays-grid.tsx` (StayCard — intra-folder)

- [ ] **Step 1: Create directory and move files**

```bash
mkdir -p components/stays
mv components/stay-card.tsx components/stays/stay-card.tsx
mv components/stay-info.tsx components/stays/stay-info.tsx
mv components/stays-grid.tsx components/stays/stays-grid.tsx
mv components/photo-gallery.tsx components/stays/photo-gallery.tsx
mv components/review-form.tsx components/stays/review-form.tsx
mv components/reviews-list.tsx components/stays/reviews-list.tsx
```

- [ ] **Step 2: Update `stays-grid.tsx` internal import of `stay-card`**

In `components/stays/stays-grid.tsx`:
- `from '@/components/stay-card'` -> `from '@/components/stays/stay-card'`

- [ ] **Step 3: Update import consumers**

In `app/(main)/page.tsx`:
- `from '@/components/stays-grid'` -> `from '@/components/stays/stays-grid'`

In `app/(main)/wishlist/page.tsx`:
- `from '@/components/stays-grid'` -> `from '@/components/stays/stays-grid'`

In `app/(main)/stays/[slug]/page.tsx`:
- `from '@/components/stay-info'` -> `from '@/components/stays/stay-info'`
- `from '@/components/photo-gallery'` -> `from '@/components/stays/photo-gallery'`
- `from '@/components/review-form'` -> `from '@/components/stays/review-form'`
- `from '@/components/reviews-list'` -> `from '@/components/stays/reviews-list'`

In `app/(main)/profile/page.tsx`:
- `from '@/components/stay-card'` -> `from '@/components/stays/stay-card'`

- [ ] **Step 4: Verify build**

Run: `pnpm exec tsc --noEmit && pnpm build`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add -A components/ app/(main)/page.tsx app/(main)/wishlist/ app/(main)/stays/ app/(main)/profile/
git commit -m "refactor: move stays components into feature folder"
```

---

### Task 8: Move layout components into `components/layout/`

Move 2 files, update import consumers.

**Files:**
- Move: `components/header.tsx` -> `components/layout/header.tsx`
- Move: `components/header-bar.tsx` -> `components/layout/header-bar.tsx`
- Modify imports in:
  - `app/(main)/layout.tsx` (Header)
  - `components/layout/header.tsx` (HeaderBar — intra-folder)

- [ ] **Step 1: Create directory and move files**

```bash
mkdir -p components/layout
mv components/header.tsx components/layout/header.tsx
mv components/header-bar.tsx components/layout/header-bar.tsx
```

- [ ] **Step 2: Update `header.tsx` internal import**

In `components/layout/header.tsx`:
- `from '@/components/header-bar'` -> `from '@/components/layout/header-bar'`

- [ ] **Step 3: Update `app/(main)/layout.tsx`**

- `from '@/components/header'` -> `from '@/components/layout/header'`

Note: `header-bar.tsx`'s SearchBar import was already updated in Task 5 Step 8.

- [ ] **Step 4: Verify build**

Run: `pnpm exec tsc --noEmit && pnpm build`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add -A components/ app/(main)/layout.tsx
git commit -m "refactor: move layout components into feature folder"
```

---

### Task 9: Final verification

Full build + test pass, verify no stale files remain.

**Files:** None (verification only)

- [ ] **Step 1: Check for stale component files**

```bash
ls components/*.tsx
```

Expected remaining files at root:
- `filter-transition-context.tsx`
- `auth-button.tsx`
- `favorite-button.tsx`
- `sort-toggle.tsx`
- `page-transition.tsx`
- `route-error.tsx`
- `back-button.tsx`
- `guest-counter.tsx`

- [ ] **Step 2: Full build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 3: Run all tests**

Run: `pnpm vitest run`
Expected: All pass

- [ ] **Step 4: Check if `sort-toggle.tsx` is dead code**

```bash
grep -r "SortToggle\|sort-toggle" --include="*.tsx" --include="*.ts" app/ components/
```

If no app/ or component imports reference it, delete it:
```bash
rm components/sort-toggle.tsx
git add -A components/sort-toggle.tsx
git commit -m "chore: remove unused SortToggle component"
```

- [ ] **Step 5: Verify no broken imports with grep**

```bash
grep -r "from '@/components/search-bar'" --include="*.tsx" --include="*.ts" .
grep -r "from '@/components/checkout-form'" --include="*.tsx" --include="*.ts" .
grep -r "from '@/components/booking-sidebar'" --include="*.tsx" --include="*.ts" .
grep -r "from '@/components/booking-card'" --include="*.tsx" --include="*.ts" .
grep -r "from '@/components/stays-grid'" --include="*.tsx" --include="*.ts" .
grep -r "from '@/components/header'" --include="*.tsx" --include="*.ts" .
```

Expected: No matches (all old import paths should be gone)

- [ ] **Step 6: Commit if any cleanup needed, then final commit message**

If everything is clean, no additional commit needed.
