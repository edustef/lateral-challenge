'use client';

import { usePathname } from 'next/navigation';
import { Search, Sparkles, X } from 'lucide-react';
import { useFilterTransition } from '@/components/filter-transition-context';
import { useSearchParamsState } from '@/lib/hooks/use-search-params';
import { useCallback } from 'react';

export function MobileSearchFab() {
  const pathname = usePathname();
  const { startTransition, setSearchExpanded, setSummary } = useFilterTransition();
  const { params, clearAll } = useSearchParamsState(startTransition);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSummary(null);
    clearAll();
  }, [clearAll, setSummary]);

  if (pathname !== '/') return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 flex justify-center px-6 pb-4 md:hidden"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))' }}
    >
      <button
        type="button"
        onClick={() => setSearchExpanded(true)}
        className="flex h-11 max-w-xs items-center gap-2 rounded-full border border-border bg-white pl-3 pr-1.5 shadow-lg transition-shadow active:shadow-md"
      >
        {params.q ? (
          <Search className="h-4 w-4 shrink-0 text-accent" />
        ) : (
          <Sparkles className="h-4 w-4 shrink-0 text-accent" />
        )}
        <span className={`flex-1 truncate text-sm font-medium ${params.q ? 'text-text-primary' : 'text-text-muted'}`}>
          {params.q || "Try 'cozy cabin for 2 under $200'..."}
        </span>
        {params.q && (
          <span
            role="button"
            onClick={handleClear}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg-muted text-text-secondary"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        )}
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-white">
          <Search className="h-3.5 w-3.5" />
        </span>
      </button>
    </div>
  );
}
