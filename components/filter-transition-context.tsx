'use client';

import { createContext, useContext, useCallback, useMemo, useState, useTransition, type TransitionStartFunction } from 'react';

type FilterTransitionContextValue = {
  isPending: boolean;
  startTransition: TransitionStartFunction;
  searchExpanded: boolean;
  setSearchExpanded: (expanded: boolean) => void;
  summary: string | null;
  setSummary: (summary: string | null) => void;
  clearConcierge: () => void;
  heroScrolledPast: boolean;
  setHeroScrolledPast: (v: boolean) => void;
};

const FilterTransitionContext = createContext<FilterTransitionContextValue>({
  isPending: false,
  startTransition: (fn) => fn(),
  searchExpanded: false,
  setSearchExpanded: () => {},
  summary: null,
  setSummary: () => {},
  clearConcierge: () => {},
  heroScrolledPast: false,
  setHeroScrolledPast: () => {},
});

export function FilterTransitionProvider({ children }: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [heroScrolledPast, setHeroScrolledPast] = useState(false);

  const clearConcierge = useCallback(() => {
    setSummary(null);
  }, []);

  const value = useMemo(
    () => ({ isPending, startTransition, searchExpanded, setSearchExpanded, summary, setSummary, clearConcierge, heroScrolledPast, setHeroScrolledPast }),
    [isPending, startTransition, searchExpanded, setSearchExpanded, summary, setSummary, clearConcierge, heroScrolledPast, setHeroScrolledPast]
  );

  return (
    <FilterTransitionContext.Provider value={value}>
      {children}
    </FilterTransitionContext.Provider>
  );
}

export function useFilterTransition() {
  return useContext(FilterTransitionContext);
}
