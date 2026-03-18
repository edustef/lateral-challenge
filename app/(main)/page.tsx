import { searchParamsCache } from '@/lib/search-params';
import { getStays } from '@/lib/actions/stays';
import { getFavoriteStayIds } from '@/lib/actions/favorites';
import { VibePicker } from '@/components/vibe-picker';
import { VibePickerMobile } from '@/components/vibe-picker-mobile';
import { SearchBar } from '@/components/search-bar';
import { SortToggle } from '@/components/sort-toggle';
import { StaysGrid } from '@/components/stays-grid';
import type { SearchParams } from 'nuqs/server';

type PageProps = { searchParams: Promise<SearchParams> };

export default async function DiscoveryPage({ searchParams }: PageProps) {
  const { type, vibe, search, sort } = await searchParamsCache.parse(searchParams);

  const [stays, favoriteIds] = await Promise.all([
    getStays({ type, vibe, search, sort }),
    getFavoriteStayIds(),
  ]);
  const favoriteSet = new Set(favoriteIds);

  return (
    <section className="py-6 space-y-6">
      {/* Toolbar row: vibe picker + search + sort */}
      <div className="sticky top-0 z-30 -mx-4 flex items-center gap-3 border-b border-border/50 bg-bg-page px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="hidden md:block">
          <VibePicker />
        </div>
        <div className="md:hidden">
          <VibePickerMobile staysCount={stays.length} />
        </div>
        <SearchBar />
        <SortToggle />
      </div>

      {/* Title row */}
      <div className="flex items-baseline justify-between">
        <h1 className="font-heading text-2xl font-semibold text-text-primary">
          Unique stays near you
        </h1>
        <span className="text-sm text-text-secondary">{stays.length} stays</span>
      </div>

      {/* Stays grid */}
      <StaysGrid stays={stays} favoriteIds={favoriteSet} />
    </section>
  );
}
