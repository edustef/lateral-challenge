'use client';

import { useState } from 'react';
import { useQueryState } from 'nuqs';
import { ArrowUpDown, Check } from 'lucide-react';
import { searchParamsParsers } from '@/lib/search-params';
import { useFilterTransition } from '@/components/filter-transition-context';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const SORT_OPTIONS = [
  { value: null, label: 'Default' },
  { value: 'price-asc', label: 'Price: low \u2192 high' },
  { value: 'price-desc', label: 'Price: high \u2192 low' },
  { value: 'rating-desc', label: 'Top rated' },
] as const;

function getSortLabel(sort: string | null): string {
  const option = SORT_OPTIONS.find((o) => o.value === sort);
  return option?.label ?? 'Sort';
}

export function SortToggle() {
  const { startTransition, clearConcierge } = useFilterTransition();
  const [sort, setSort] = useQueryState('sort', { ...searchParamsParsers.sort, startTransition });
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="flex flex-shrink-0 cursor-pointer items-center gap-1 text-sm text-text-secondary transition-all hover:text-text-primary active:scale-95"
      >
        <ArrowUpDown className="h-4 w-4" />
        {getSortLabel(sort)}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 gap-0 p-1">
        {SORT_OPTIONS.map((option) => {
          const isActive = sort === option.value;
          return (
            <button
              key={option.value ?? 'default'}
              type="button"
              onClick={() => {
                setSort(option.value);
                setOpen(false);
                clearConcierge();
              }}
              className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-text-secondary transition-colors hover:bg-accent hover:text-text-primary"
            >
              <Check
                className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? 'opacity-100' : 'opacity-0'}`}
              />
              {option.label}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
