import { searchParamsCache } from '@/lib/search-params';
import { getStays } from '@/lib/actions/stays';
import { VibePicker } from '@/components/vibe-picker';
import { VibePickerMobile } from '@/components/vibe-picker-mobile';
import { Search, ArrowUpDown } from 'lucide-react';
import type { SearchParams } from 'nuqs/server';

type PageProps = { searchParams: Promise<SearchParams> };

export default async function DiscoveryPage({ searchParams }: PageProps) {
  const { type, vibe, search, sort } = await searchParamsCache.parse(searchParams);

  const stays = await getStays({ type, vibe, search, sort });

  return (
    <div className="py-6">
      {/* Toolbar: vibe picker + search/sort */}
      <div className="flex items-center justify-between gap-4">
        <VibePicker />
        <VibePickerMobile staysCount={stays.length} />

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-[--radius-pill] border border-border-subtle bg-bg-surface text-text-secondary transition-colors hover:border-border"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-[--radius-pill] border border-border-subtle bg-bg-surface text-text-secondary transition-colors hover:border-border"
            aria-label="Sort"
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Section title */}
      <div className="mt-8 flex items-baseline gap-3">
        <h1 className="font-heading text-2xl text-text-primary">Unique stays near you</h1>
        <span className="text-sm text-text-secondary">{stays.length} stays</span>
      </div>

      {/* Stays grid placeholder — cards come in plan 02-02 */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stays.map((stay) => (
          <div
            key={stay.id}
            className="rounded-[--radius-card] border border-border-subtle bg-bg-card p-4"
          >
            <div className="mb-3 aspect-[4/3] rounded-[--radius-small] bg-bg-muted" />
            <p className="font-medium text-text-primary">{stay.title}</p>
            <p className="text-sm text-text-secondary">{stay.location}</p>
            <p className="mt-1 font-mono text-sm text-text-primary">
              ${stay.price_per_night}/night
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
