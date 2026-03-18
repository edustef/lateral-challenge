'use client';

import { useRef } from 'react';
import { useQueryState } from 'nuqs';
import { Search, X } from 'lucide-react';
import { searchParamsParsers } from '@/lib/search-params';

export function SearchBar() {
  const [search, setSearch] = useQueryState(
    'search',
    searchParamsParsers.search.withOptions({ throttleMs: 300 })
  );
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClear() {
    setSearch(null);
    inputRef.current?.focus();
  }

  return (
    <>
      {/* Mobile: compact icon input */}
      <div className="relative flex-1 md:hidden">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search stays..."
          value={search ?? ''}
          onChange={(e) => setSearch(e.target.value || null)}
          className="h-10 w-full rounded-button border border-border bg-white pl-9 pr-9 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
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
      </div>

      {/* Desktop: wider input */}
      <div className="relative hidden md:block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search stays..."
          value={search ?? ''}
          onChange={(e) => setSearch(e.target.value || null)}
          className="h-10 w-64 rounded-button border border-border bg-white pl-10 pr-9 text-chip font-medium text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none"
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
      </div>
    </>
  );
}
