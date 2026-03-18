import { searchParamsCache } from '@/lib/search-params';
import { getStays } from '@/lib/actions/stays';
import { getFavoriteStayIds } from '@/lib/actions/favorites';
import { FilterPill } from '@/components/filter-pill';
import { SearchBar, SearchOverlay } from '@/components/search-bar';
import { SortToggle } from '@/components/sort-toggle';
import { ConciergeSummary } from '@/components/concierge-summary';
import { StaysGrid } from '@/components/stays-grid';
import { FilterTransitionProvider } from '@/components/filter-transition-context';
import type { SearchParams } from 'nuqs/server';

type PageProps = { searchParams: Promise<SearchParams> };

export default async function DiscoveryPage({ searchParams }: PageProps) {
  const { type, vibe, search, sort, stayType, maxPrice, amenities } = await searchParamsCache.parse(searchParams);

  const [stays, favoriteIds] = await Promise.all([
    getStays({ type, vibe, search, sort, stayType, maxPrice, amenities }),
    getFavoriteStayIds(),
  ]);
  return (
    <FilterTransitionProvider>
      {/* Toolbar row: filter pill + search */}
      <div className="sticky top-0 md:top-14 z-30 border-b border-border-subtle bg-bg-page/80 backdrop-blur-xl">
        <div className="relative mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <FilterPill staysCount={stays.length} />
          <div className="ml-auto">
            <SearchBar />
          </div>
          <SearchOverlay />
        </div>
      </div>

      {/* AI summary banner */}
      <ConciergeSummary />

      <div className="mx-auto flex max-w-7xl justify-end px-4 pt-3 sm:px-6 lg:px-8">
        <SortToggle />
      </div>

      <section className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Title row */}
        <div className="flex items-baseline justify-between">
          <h1 className="font-heading text-2xl font-semibold text-text-primary">
            Unique stays near you
          </h1>
          <span className="text-sm text-text-secondary">{stays.length} stays</span>
        </div>

        {/* Stays grid */}
        <StaysGrid stays={stays} favoriteIds={favoriteIds} />
      </section>
    </FilterTransitionProvider>
  );
}
