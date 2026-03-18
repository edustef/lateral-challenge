'use client';

import { useRef, useEffect, useCallback, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useQueryStates } from 'nuqs';
import { Search, Sparkles, X, Loader2 } from 'lucide-react';
import { searchParamsParsers } from '@/lib/search-params';
import { parseNaturalQuery } from '@/lib/actions/concierge';
import { useFilterTransition } from '@/components/filter-transition-context';
import { SearchSuggestions } from '@/components/search-suggestions';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

type SearchBarProps = {
  compact?: boolean;
};

/**
 * AI-powered search bar. Simple queries (1-2 words) do text search.
 * Complex queries are parsed by OpenAI into structured filters.
 * Submits on Enter (not live-as-you-type).
 *
 * - `compact` (default false): hero mode with larger input and focus popover.
 *   When true: smaller input, no popover, still opens mobile overlay.
 */
export function SearchBar({ compact = false }: SearchBarProps) {
  const { startTransition, searchExpanded, setSearchExpanded, setSummary } =
    useFilterTransition();
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
    { startTransition },
  );
  const [localValue, setLocalValue] = useState(params.q ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const lastAiCall = useRef(0);
  const desktopRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync local value when URL q param changes externally
  useEffect(() => {
    setLocalValue(params.q ?? '');
  }, [params.q]);

  const submitQuery = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) {
        setParams({
          q: null,
          locations: null,
          countries: null,
          stayType: null,
          maxPrice: null,
          amenities: null,
          type: null,
          tags: null,
          sort: null,
        });
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
          // AI failed or returned nothing — fall back to text search
          setSummary(null);
          setParams({
            q: trimmed,
            locations: [trimmed],
            countries: null,
            stayType: null,
            maxPrice: null,
            amenities: null,
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
          maxPrice: result.max_price ? result.max_price * 100 : null, // dollars → cents
          amenities: result.amenities ?? null,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setParams, setSummary],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        setIsFocused(false);
        submitQuery(localValue);
      } else if (e.key === 'Escape') {
        setIsFocused(false);
        desktopRef.current?.blur();
      }
    },
    [submitQuery, localValue],
  );

  function handleClear() {
    setLocalValue('');
    setSummary(null);
    setParams({
      q: null,
      locations: null,
      countries: null,
      stayType: null,
      maxPrice: null,
      amenities: null,
      type: null,
      tags: null,
      sort: null,
    });
    desktopRef.current?.focus();
  }

  function handleSuggestionSelect(text: string) {
    setLocalValue(text);
    setIsFocused(false);
    submitQuery(text);
  }

  const inputSize = compact
    ? 'h-10 text-base rounded-full'
    : 'h-10 text-base rounded-full md:h-14';

  return (
    <>
      <div ref={wrapperRef} className={`relative hidden md:block ${compact ? 'w-full max-w-sm' : 'w-full'}`}>
        <Sparkles className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
        <input
          ref={desktopRef}
          type="text"
          placeholder="Try 'cozy cabin for 2 under $200'..."
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isLoading}
          className={`${inputSize} w-full border bg-white pl-9 pr-9 font-medium text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none ${
            isLoading ? 'border-accent animate-pulse opacity-70' : 'border-border'
          }`}
        />
        {isLoading ? (
          <Loader2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-accent" />
        ) : localValue ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}

        {/* Focus popover — hero mode only */}
        {!compact && isFocused && <PopoverPortal anchorRef={wrapperRef}>
          <SearchSuggestions onSelect={handleSuggestionSelect} />
        </PopoverPortal>}
      </div>
    </>
  );
}

/**
 * Portal-based popover that positions itself below an anchor element.
 * Renders at document root to avoid z-index/overflow issues.
 */
function PopoverPortal({ anchorRef, children }: { anchorRef: React.RefObject<HTMLDivElement | null>; children: ReactNode }) {
  const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0 });

  useEffect(() => {
    function update() {
      const el = anchorRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setStyle({
        position: 'fixed',
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
        opacity: 1,
      });
    }
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [anchorRef]);

  return createPortal(
    <div style={style} className="rounded-xl border border-border bg-white p-4 shadow-lg">
      {children}
    </div>,
    document.body,
  );
}

/**
 * Mobile-only full-screen overlay with search input and suggestions.
 */
export function SearchOverlay() {
  const { startTransition, searchExpanded, setSearchExpanded, setSummary } =
    useFilterTransition();
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
    { startTransition },
  );
  const [localValue, setLocalValue] = useState(params.q ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const lastAiCall = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(params.q ?? '');
  }, [params.q]);

  const submitQuery = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) {
        setParams({
          q: null,
          locations: null,
          countries: null,
          stayType: null,
          maxPrice: null,
          amenities: null,
          type: null,
          tags: null,
          sort: null,
        });
        setSummary(null);
        setSearchExpanded(false);
        return;
      }

      const now = Date.now();
      if (now - lastAiCall.current < 1000) return;
      lastAiCall.current = now;

      setIsLoading(true);
      try {
        const result = await parseNaturalQuery(trimmed);
        if (!result) {
          setSummary(null);
          setParams({
            q: trimmed,
            locations: [trimmed],
            countries: null,
            stayType: null,
            maxPrice: null,
            amenities: null,
          });
        } else {
          setSummary(result.summary);
          setParams({
            q: trimmed,
            locations: result.locations ?? null,
            countries: result.countries ?? null,
            type: result.travel_type ?? null,
            tags: result.tags ?? null,
            sort: result.sort ?? null,
            stayType: result.stay_type ?? null,
            maxPrice: result.max_price ? result.max_price * 100 : null, // dollars → cents
            amenities: result.amenities ?? null,
          });
        }
      } finally {
        setIsLoading(false);
        setSearchExpanded(false);
      }
    },
    [setParams, setSummary, setSearchExpanded],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitQuery(localValue);
      } else if (e.key === 'Escape') {
        setSearchExpanded(false);
      }
    },
    [submitQuery, localValue, setSearchExpanded],
  );

  const handleClear = useCallback(() => {
    setLocalValue('');
    setSummary(null);
    setParams({
      q: null,
      locations: null,
      countries: null,
      stayType: null,
      maxPrice: null,
      amenities: null,
      type: null,
      tags: null,
      sort: null,
    });
    setSearchExpanded(false);
  }, [setParams, setSummary, setSearchExpanded]);

  function handleSuggestionSelect(text: string) {
    setLocalValue(text);
    submitQuery(text);
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

        {/* Input + close */}
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
              className={`h-10 w-full rounded-full border bg-white pl-9 pr-9 text-base text-text-primary placeholder:text-text-muted focus:outline-none ${
                isLoading
                  ? 'border-accent animate-pulse opacity-70'
                  : 'border-accent'
              }`}
            />
            {isLoading ? (
              <Loader2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-accent" />
            ) : localValue ? (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setLocalValue('');
                  inputRef.current?.focus();
                }}
                aria-label="Clear search text"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <Search className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
            )}
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

        {/* Suggestions */}
        <div className="mt-4">
          <SearchSuggestions onSelect={handleSuggestionSelect} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
