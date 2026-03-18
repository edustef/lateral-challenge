import { searchParamsCache } from '@/lib/search-params';
import type { SearchParams } from 'nuqs/server';

type PageProps = { searchParams: Promise<SearchParams> };

export default async function DiscoveryPage({ searchParams }: PageProps) {
  const { type, vibe, search, sort } = await searchParamsCache.parse(searchParams);

  return (
    <div className="py-6">
      {/* VibePicker will be mounted here in Task 2 */}
      {/* StaysGrid placeholder — cards come in plan 02-02 */}
      <p className="text-text-secondary">
        Discovery page — filters: type={type ?? 'any'}, vibe={vibe ?? 'any'}
      </p>
    </div>
  );
}
