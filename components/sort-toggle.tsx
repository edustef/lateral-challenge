'use client';

import { useQueryState } from 'nuqs';
import { ArrowUpDown } from 'lucide-react';
import { searchParamsParsers } from '@/lib/search-params';

const SORT_CYCLE = [null, 'price-asc', 'price-desc'] as const;

function getSortLabel(sort: string | null): string {
  switch (sort) {
    case 'price-asc':
      return 'Price: low \u2192 high';
    case 'price-desc':
      return 'Price: high \u2192 low';
    default:
      return 'Sort';
  }
}

export function SortToggle() {
  const [sort, setSort] = useQueryState('sort', searchParamsParsers.sort);

  const handleToggle = () => {
    const currentIndex = SORT_CYCLE.indexOf(sort as typeof SORT_CYCLE[number]);
    const nextIndex = (currentIndex + 1) % SORT_CYCLE.length;
    setSort(SORT_CYCLE[nextIndex]);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="flex flex-shrink-0 cursor-pointer items-center gap-1 text-sm text-text-secondary transition-colors hover:text-text-primary"
    >
      <ArrowUpDown className="h-4 w-4" />
      <span className="hidden sm:inline">{getSortLabel(sort)}</span>
    </button>
  );
}
