'use client';

import { useCallback, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFilterTransition } from '@/components/filter-transition-context';
import { useSearchParamsState } from '@/lib/hooks/use-search-params';

export function SearchSummary() {
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
