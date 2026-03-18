'use client';

import { useCallback } from 'react';
import { useQueryStates } from 'nuqs';
import { X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { searchParamsParsers } from '@/lib/search-params';
import { useFilterTransition } from '@/components/filter-transition-context';

export function ConciergeSummary() {
  const { summary, setSummary, startTransition } = useFilterTransition();
  const [, setParams] = useQueryStates(
    {
      search: searchParamsParsers.search,
      type: searchParamsParsers.type,
      vibe: searchParamsParsers.vibe,
      sort: searchParamsParsers.sort,
      stayType: searchParamsParsers.stayType,
      maxPrice: searchParamsParsers.maxPrice,
      amenities: searchParamsParsers.amenities,
    },
    { startTransition },
  );

  const handleDismiss = useCallback(() => {
    setSummary(null);
    setParams({
      search: null, stayType: null, maxPrice: null, amenities: null,
      type: null, vibe: null, sort: null,
    });
  }, [setSummary, setParams]);

  return (
    <AnimatePresence>
      {summary && (
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
            <span className="text-sm text-accent">{summary}</span>
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
