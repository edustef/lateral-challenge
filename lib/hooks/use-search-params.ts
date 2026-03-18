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
