import { SearchX } from 'lucide-react';
import { StayCard } from '@/components/stay-card';
import type { StayCard as StayCardType } from '@/lib/actions/stays';

export function StaysGrid({ stays }: { stays: StayCardType[] }) {
  if (stays.length === 0) {
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {stays.map((stay) => (
        <StayCard key={stay.id} stay={stay} />
      ))}
    </div>
  );
}
