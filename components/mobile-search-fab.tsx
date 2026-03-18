'use client';

import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { useQueryStates } from 'nuqs';
import { searchParamsParsers } from '@/lib/search-params';
import { useFilterTransition } from '@/components/filter-transition-context';

export function MobileSearchFab() {
  const pathname = usePathname();
  const { setSearchExpanded } = useFilterTransition();
  const [params] = useQueryStates({
    q: searchParamsParsers.q,
  });

  // Only show on homepage
  if (pathname !== '/') return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 flex justify-center px-6 pb-4 md:hidden"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))' }}
    >
      <button
        type="button"
        onClick={() => setSearchExpanded(true)}
        className="flex h-11 max-w-xs items-center gap-2 rounded-full border border-border bg-white px-4 shadow-lg transition-shadow active:shadow-md"
      >
        <Sparkles className="h-4 w-4 shrink-0 text-accent" />
        <span className={`truncate text-sm font-medium ${params.q ? 'text-text-primary' : 'text-text-muted'}`}>
          {params.q || "Try 'cozy cabin for 2 under $200'..."}
        </span>
      </button>
    </div>
  );
}
