import { searchParamsCache } from '@/lib/search-params';
import { getStays } from '@/lib/actions/stays';
import { getFavoriteStayIds } from '@/lib/actions/favorites';
import { VibeHero } from '@/components/vibe-hero';
import { ConciergeSummary } from '@/components/concierge-summary';
import { StaysGrid } from '@/components/stays-grid';
import { FilterTransitionProvider } from '@/components/filter-transition-context';
import type { SearchParams } from 'nuqs/server';

type PageProps = { searchParams: Promise<SearchParams> };

export default async function DiscoveryPage({ searchParams }: PageProps) {
  const { type, vibe, search, country, sort, stayType, maxPrice, amenities } = await searchParamsCache.parse(searchParams);

  const [stays, favoriteIds] = await Promise.all([
    getStays({ type, vibe, search, country, sort, stayType, maxPrice, amenities }),
    getFavoriteStayIds(),
  ]);
  return (
    <FilterTransitionProvider>
      {/* Vibe hero / compact strip (includes search bar + sort) */}
      <VibeHero staysCount={stays.length} />

      {/* AI summary banner */}
      <ConciergeSummary />

      <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        {/* Subtle results count */}
        <p className="mb-6 text-sm text-text-muted">
          {stays.length} {stays.length === 1 ? 'stay' : 'stays'} available
        </p>

        {/* Stays grid */}
        <StaysGrid stays={stays} favoriteIds={favoriteIds} />
      </section>
    </FilterTransitionProvider>
  );
}
