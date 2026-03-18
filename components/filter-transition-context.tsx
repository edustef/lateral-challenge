'use client';

import { createContext, useContext, useState, useTransition, type TransitionStartFunction } from 'react';

type FilterTransitionContextValue = {
  isPending: boolean;
  startTransition: TransitionStartFunction;
  searchExpanded: boolean;
  setSearchExpanded: (expanded: boolean) => void;
};

const FilterTransitionContext = createContext<FilterTransitionContextValue>({
  isPending: false,
  startTransition: (fn) => fn(),
  searchExpanded: false,
  setSearchExpanded: () => {},
});

export function FilterTransitionProvider({ children }: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();
  const [searchExpanded, setSearchExpanded] = useState(false);
  return (
    <FilterTransitionContext.Provider value={{ isPending, startTransition, searchExpanded, setSearchExpanded }}>
      {children}
    </FilterTransitionContext.Provider>
  );
}

export function useFilterTransition() {
  return useContext(FilterTransitionContext);
}
