'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { useQueryState } from 'nuqs';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { searchParamsParsers } from '@/lib/search-params';
import { useFilterTransition } from '@/components/filter-transition-context';

/**
 * Mobile: icon button that opens the search overlay.
 * Desktop: always-visible inline input.
 */
export function SearchBar() {
  const { startTransition, searchExpanded, setSearchExpanded } = useFilterTransition();
  const [search, setSearch] = useQueryState(
    'search',
    searchParamsParsers.search.withOptions({ throttleMs: 300, startTransition })
  );
  const [focused, setFocused] = useState(false);
  const desktopRef = useRef<HTMLInputElement>(null);

  function handleClear() {
    setSearch(null);
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
          search
            ? 'border-accent bg-accent-tint text-accent'
            : 'border-border bg-white text-text-secondary hover:text-text-primary'
        }`}
      >
        <Search className="h-4 w-4" />
      </button>

      {/* Desktop: inline input */}
      <motion.div
        className="relative hidden md:block"
        animate={{ width: focused || search ? 280 : 200 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          ref={desktopRef}
          type="text"
          placeholder="Search stays..."
          value={search ?? ''}
          onChange={(e) => setSearch(e.target.value || null)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="h-10 w-full rounded-button border border-border bg-white pl-9 pr-9 text-chip font-medium text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </motion.div>
    </>
  );
}

/**
 * Mobile-only overlay that covers the toolbar when search is expanded.
 */
export function SearchOverlay() {
  const { startTransition, searchExpanded, setSearchExpanded } = useFilterTransition();
  const [search, setSearch] = useQueryState(
    'search',
    searchParamsParsers.search.withOptions({ throttleMs: 300, startTransition })
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDismiss = useCallback(() => {
    setSearchExpanded(false);
  }, [setSearchExpanded]);

  const handleClear = useCallback(() => {
    setSearch(null);
    setSearchExpanded(false);
  }, [setSearch, setSearchExpanded]);

  useEffect(() => {
    if (searchExpanded) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [searchExpanded]);

  useEffect(() => {
    if (!searchExpanded) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleDismiss();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchExpanded, handleDismiss]);

  function handleBlur() {
    setTimeout(() => {
      if (!inputRef.current || document.activeElement === inputRef.current) return;
      handleDismiss();
    }, 120);
  }

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
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search stays..."
              value={search ?? ''}
              onChange={(e) => setSearch(e.target.value || null)}
              onBlur={handleBlur}
              className="h-10 w-full rounded-button border border-accent bg-white pl-9 pr-9 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
