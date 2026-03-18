'use client';

import { useQueryState } from 'nuqs';
import { Search, X } from 'lucide-react';
import { searchParamsParsers } from '@/lib/search-params';

export function SearchBar() {
  const [search, setSearch] = useQueryState(
    'search',
    searchParamsParsers.search.withOptions({ throttleMs: 300 })
  );

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
      <input
        type="text"
        value={search ?? ''}
        onChange={(e) => setSearch(e.target.value || null)}
        placeholder="Search stays..."
        className="w-full rounded-pill border border-border bg-bg-card py-2 pl-10 pr-9 text-sm text-text-body placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      {search && (
        <button
          type="button"
          onClick={() => setSearch(null)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
