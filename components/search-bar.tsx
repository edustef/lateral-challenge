'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { useQueryStates } from 'nuqs';
import { Search, Sparkles, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { searchParamsParsers } from '@/lib/search-params';
import { isSimpleQuery } from '@/lib/concierge-schema';
import { parseNaturalQuery } from '@/lib/actions/concierge';
import { useFilterTransition } from '@/components/filter-transition-context';

/**
 * AI-powered search bar. Simple queries (1-2 words) do text search.
 * Complex queries are parsed by OpenAI into structured filters.
 * Submits on Enter (not live-as-you-type).
 */
export function SearchBar() {
  const { startTransition, searchExpanded, setSearchExpanded, setSummary } = useFilterTransition();
  const [params, setParams] = useQueryStates(
    {
      search: searchParamsParsers.search,
      country: searchParamsParsers.country,
      type: searchParamsParsers.type,
      vibe: searchParamsParsers.vibe,
      sort: searchParamsParsers.sort,
      stayType: searchParamsParsers.stayType,
      maxPrice: searchParamsParsers.maxPrice,
      amenities: searchParamsParsers.amenities,
    },
    { startTransition },
  );
  const [localValue, setLocalValue] = useState(params.search ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const lastAiCall = useRef(0);
  const desktopRef = useRef<HTMLInputElement>(null);

  // Sync local value when URL search param changes externally
  useEffect(() => {
    setLocalValue(params.search ?? '');
  }, [params.search]);

  const handleSubmit = useCallback(async () => {
    const trimmed = localValue.trim();
    if (!trimmed) {
      setParams({
        search: null, country: null, stayType: null, maxPrice: null, amenities: null,
        type: null, vibe: null, sort: null,
      });
      setSummary(null);
      return;
    }

    if (isSimpleQuery(trimmed)) {
      setSummary(null);
      setParams({
        search: trimmed, country: null, stayType: null, maxPrice: null, amenities: null,
      });
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
        setParams({ search: trimmed, country: null, stayType: null, maxPrice: null, amenities: null });
        return;
      }

      setSummary(result.summary);
      setParams({
        search: result.search ?? null,
        country: result.country ?? null,
        type: result.travel_type ?? null,
        vibe: result.vibe ?? null,
        sort: result.sort ?? null,
        stayType: result.stay_type ?? null,
        maxPrice: result.max_price ? result.max_price * 100 : null, // dollars → cents
        amenities: result.amenities ?? null,
      });
    } finally {
      setIsLoading(false);
    }
  }, [localValue, setParams, setSummary]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  function handleClear() {
    setLocalValue('');
    setSummary(null);
    setParams({
      search: null, country: null, stayType: null, maxPrice: null, amenities: null,
      type: null, vibe: null, sort: null,
    });
    desktopRef.current?.focus();
  }

  return (
    <>
      {/* Mobile: icon button */}
      <button
        type="button"
        aria-label="Open search"
        onClick={() => setSearchExpanded(true)}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors md:hidden ${
          params.search
            ? 'border-accent bg-accent-tint text-accent'
            : 'border-border bg-white text-text-secondary hover:text-text-primary'
        }`}
      >
        <Search className="h-4 w-4" />
      </button>

      {/* Desktop: inline input */}
      <div className="relative hidden md:block w-[280px]">
        <Sparkles className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
        <input
          ref={desktopRef}
          type="text"
          placeholder="Try 'cozy cabin for 2 under $200'..."
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className={`h-10 w-full rounded-button border bg-white pl-9 pr-9 text-chip font-medium text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none ${
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
      </div>
    </>
  );
}

/**
 * Mobile-only overlay that covers the toolbar when search is expanded.
 */
export function SearchOverlay() {
  const { startTransition, searchExpanded, setSearchExpanded, setSummary } = useFilterTransition();
  const [params, setParams] = useQueryStates(
    {
      search: searchParamsParsers.search,
      country: searchParamsParsers.country,
      type: searchParamsParsers.type,
      vibe: searchParamsParsers.vibe,
      sort: searchParamsParsers.sort,
      stayType: searchParamsParsers.stayType,
      maxPrice: searchParamsParsers.maxPrice,
      amenities: searchParamsParsers.amenities,
    },
    { startTransition },
  );
  const [localValue, setLocalValue] = useState(params.search ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const lastAiCall = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(params.search ?? '');
  }, [params.search]);

  const handleDismiss = useCallback(() => {
    setSearchExpanded(false);
  }, [setSearchExpanded]);

  const handleSubmit = useCallback(async () => {
    const trimmed = localValue.trim();
    if (!trimmed) {
      setParams({
        search: null, country: null, stayType: null, maxPrice: null, amenities: null,
        type: null, vibe: null, sort: null,
      });
      setSummary(null);
      setSearchExpanded(false);
      return;
    }

    if (isSimpleQuery(trimmed)) {
      setSummary(null);
      setParams({ search: trimmed, country: null, stayType: null, maxPrice: null, amenities: null });
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
        setParams({ search: trimmed, country: null, stayType: null, maxPrice: null, amenities: null });
      } else {
        setSummary(result.summary);
        setParams({
          search: result.search ?? null,
          country: result.country ?? null,
          type: result.travel_type ?? null,
          vibe: result.vibe ?? null,
          sort: result.sort ?? null,
          stayType: result.stay_type ?? null,
          maxPrice: result.max_price ? result.max_price * 100 : null,
          amenities: result.amenities ?? null,
        });
      }
    } finally {
      setIsLoading(false);
      setSearchExpanded(false);
    }
  }, [localValue, setParams, setSummary, setSearchExpanded]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === 'Escape') {
        handleDismiss();
      }
    },
    [handleSubmit, handleDismiss],
  );

  const handleClear = useCallback(() => {
    setLocalValue('');
    setSummary(null);
    setParams({
      search: null, country: null, stayType: null, maxPrice: null, amenities: null,
      type: null, vibe: null, sort: null,
    });
    setSearchExpanded(false);
  }, [setParams, setSummary, setSearchExpanded]);

  useEffect(() => {
    if (searchExpanded) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [searchExpanded]);

  return (
    <AnimatePresence>
      {searchExpanded && (
        <motion.div
          className="absolute inset-0 z-10 flex items-center px-4 sm:px-6 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="absolute inset-0 bg-bg-page/80 backdrop-blur-sm" />
          <div className="relative w-full">
            <Sparkles className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Try 'cozy cabin for 2 under $200'..."
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className={`h-10 w-full rounded-button border bg-white pl-9 pr-9 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                isLoading ? 'border-accent animate-pulse opacity-70' : 'border-accent'
              }`}
            />
            {isLoading ? (
              <Loader2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-accent" />
            ) : (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleClear}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
