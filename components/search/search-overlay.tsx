'use client';

import { useRef, useEffect } from 'react';
import { Search, Sparkles, X, Loader2 } from 'lucide-react';
import { useSearchQuery } from '@/lib/hooks/use-search-query';
import { useFilterTransition } from '@/components/filter-transition-context';
import { SearchSuggestions } from '@/components/search/search-suggestions';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

/**
 * Mobile-only full-screen search overlay with input and suggestions.
 */
export function SearchOverlay() {
  const { searchExpanded, setSearchExpanded } = useFilterTransition();
  const {
    localValue,
    setLocalValue,
    isLoading,
    submitQuery,
    handleClear,
    handleKeyDown: baseKeyDown,
  } = useSearchQuery();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleKeyDown(e: React.KeyboardEvent) {
    baseKeyDown(e);
    if (e.key === 'Escape') {
      setSearchExpanded(false);
    }
  }

  function handleSubmit() {
    submitQuery(localValue).then(() => setSearchExpanded(false));
  }

  function handleDismiss() {
    handleClear();
    setSearchExpanded(false);
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
              className={`h-10 w-full rounded-full border bg-bg-card pl-9 pr-14 text-base text-text-primary placeholder:text-text-muted focus:outline-none ${
                isLoading
                  ? 'border-accent animate-pulse opacity-70'
                  : 'border-accent'
              }`}
            />
            {isLoading ? (
              <Loader2 className="absolute right-12 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-accent" />
            ) : localValue ? (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { setLocalValue(''); inputRef.current?.focus(); }}
                aria-label="Clear search text"
                className="absolute right-12 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleSubmit}
              aria-label="Search"
              className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent/90"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
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

        <div className="mt-4">
          <SearchSuggestions onSelect={(text) => { setLocalValue(text); submitQuery(text).then(() => setSearchExpanded(false)); }} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
