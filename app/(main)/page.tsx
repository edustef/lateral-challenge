import { searchParamsCache } from '@/lib/search-params';
import { getStays, getFeaturedStays } from '@/lib/actions/stays';
import { getFavoriteStayIds } from '@/lib/actions/favorites';
import { SearchHero } from '@/components/search-hero';
import { ConciergeSummary } from '@/components/concierge-summary';
import { StaysGrid } from '@/components/stays-grid';
import { FilterTransitionProvider } from '@/components/filter-transition-context';
import type { SearchParams } from 'nuqs/server';

type PageProps = { searchParams: Promise<SearchParams> };

export default async function DiscoveryPage({ searchParams }: PageProps) {
  const { type, tags, search, country, sort, stayType, maxPrice, amenities } = await searchParamsCache.parse(searchParams);

  const hasFilters = !!(type || tags?.length || search || country || sort || stayType || maxPrice || amenities?.length);

  const [stays, favoriteIds] = await Promise.all([
    hasFilters
      ? getStays({ type, tags, search, country, sort, stayType, maxPrice, amenities })
      : getFeaturedStays(),
    getFavoriteStayIds(),
  ]);

  return (
    <FilterTransitionProvider>
      <SearchHero staysCount={stays.length} featuredMode={!hasFilters} />
      <ConciergeSummary />

      <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <p className="mb-6 text-sm text-text-muted">
          {hasFilters
            ? `${stays.length} ${stays.length === 1 ? 'stay' : 'stays'} found`
            : 'Popular stays'}
        </p>
        <StaysGrid stays={stays} favoriteIds={favoriteIds} />
      </section>
    </FilterTransitionProvider>
  );
}
