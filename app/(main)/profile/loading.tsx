import { Heart } from 'lucide-react';

export default function ProfileLoading() {
  return (
    <div>
      <div className="border-b border-border-subtle">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-start gap-8">
            <div className="h-24 w-24 shrink-0 animate-pulse rounded-full bg-bg-muted" />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="h-8 w-48 animate-pulse rounded bg-bg-muted" />
                <div className="hidden h-10 w-28 animate-pulse rounded-full bg-bg-muted sm:block" />
              </div>
              <div className="flex items-center gap-6">
                <div className="h-4 w-48 animate-pulse rounded bg-bg-muted" />
                <div className="h-4 w-36 animate-pulse rounded bg-bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex border-b border-[#E8E4DF]">
          <div className="flex items-center gap-2 border-b-2 border-[#FF8400] px-5 py-3">
            <span className="text-sm font-semibold text-text-primary">Upcoming</span>
          </div>
          <div className="px-5 py-3">
            <span className="text-sm font-medium text-text-muted">Past</span>
          </div>
          <div className="px-5 py-3">
            <span className="text-sm font-medium text-text-muted">Cancelled</span>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse flex gap-4 rounded-card border border-border-subtle bg-bg-card p-4"
            >
              <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 rounded bg-bg-muted" />
                <div className="h-4 w-1/2 rounded bg-bg-muted" />
                <div className="h-4 w-1/3 rounded bg-bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-border-subtle px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center gap-2">
          <Heart size={18} className="text-text-muted" />
          <h2 className="text-base font-semibold text-text-primary">Saved stays</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-card border border-border-subtle bg-bg-card"
            >
              <div className="aspect-[4/3] w-full bg-bg-muted" />
              <div className="space-y-1.5 p-3">
                <div className="h-4 w-3/4 rounded bg-bg-muted" />
                <div className="h-3 w-1/2 rounded bg-bg-muted" />
                <div className="h-3 w-1/3 rounded bg-bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
