'use client';

import { SearchX, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { StayCard } from '@/components/stay-card';
import { useFilterTransition } from '@/components/filter-transition-context';
import type { StayCard as StayCardType } from '@/lib/actions/stays';

export function StaysGrid({ stays, favoriteIds }: { stays: StayCardType[]; favoriteIds?: string[] }) {
  const { isPending } = useFilterTransition();
  const favoriteSet = useMemo(() => new Set(favoriteIds ?? []), [favoriteIds]);

  if (stays.length === 0 && !isPending) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <SearchX className="h-10 w-10 text-text-secondary" />
        <h2 className="font-heading text-lg font-semibold text-text-primary">
          No stays found
        </h2>
        <p className="text-sm text-text-secondary">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {isPending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg-page/60">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        </div>
      )}
      <div
        data-testid="stays-grid"
        className={`grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 transition-opacity ${isPending ? 'opacity-40' : ''}`}
      >
        {stays.map((stay) => (
          <StayCard key={stay.id} stay={stay} isFavorited={favoriteSet.has(stay.id)} />
        ))}
      </div>
    </div>
  );
}
