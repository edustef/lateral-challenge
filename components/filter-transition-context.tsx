'use client';

import { createContext, useContext, useCallback, useState, useTransition, type TransitionStartFunction } from 'react';

type FilterTransitionContextValue = {
  isPending: boolean;
  startTransition: TransitionStartFunction;
  searchExpanded: boolean;
  setSearchExpanded: (expanded: boolean) => void;
  summary: string | null;
  setSummary: (summary: string | null) => void;
  clearConcierge: () => void;
};

const FilterTransitionContext = createContext<FilterTransitionContextValue>({
  isPending: false,
  startTransition: (fn) => fn(),
  searchExpanded: false,
  setSearchExpanded: () => {},
  summary: null,
  setSummary: () => {},
  clearConcierge: () => {},
});

export function FilterTransitionProvider({ children }: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const clearConcierge = useCallback(() => {
    setSummary(null);
  }, []);

  return (
    <FilterTransitionContext.Provider value={{ isPending, startTransition, searchExpanded, setSearchExpanded, summary, setSummary, clearConcierge }}>
      {children}
    </FilterTransitionContext.Provider>
  );
}

export function useFilterTransition() {
  return useContext(FilterTransitionContext);
}
