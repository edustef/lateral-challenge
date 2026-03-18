export default function DiscoveryLoading() {
  return (
    <div className="py-6">
      {/* Toolbar skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-48 animate-pulse rounded-pill bg-bg-muted" />
        <div className="h-10 flex-1 animate-pulse rounded-pill bg-bg-muted" />
        <div className="h-5 w-12 animate-pulse rounded bg-bg-muted" />
      </div>

      {/* Title skeleton */}
      <div className="mt-8 flex items-baseline gap-3">
        <div className="h-8 w-64 animate-pulse rounded-md bg-bg-muted" />
        <div className="h-5 w-16 animate-pulse rounded-md bg-bg-muted" />
      </div>

      {/* Grid skeleton: 6 cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-card border border-border-subtle bg-bg-card"
          >
            <div className="aspect-[4/3] animate-pulse bg-bg-muted" />
            <div className="p-4">
              <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-bg-muted" />
              <div className="mb-2 h-4 w-1/2 animate-pulse rounded bg-bg-muted" />
              <div className="mb-2 h-4 w-1/3 animate-pulse rounded bg-bg-muted" />
              <div className="flex items-center justify-between">
                <div className="h-6 w-16 animate-pulse rounded-badge bg-bg-muted" />
                <div className="h-4 w-12 animate-pulse rounded bg-bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
