'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { parseNaturalQuery } from '@/lib/actions/search-parser';
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
