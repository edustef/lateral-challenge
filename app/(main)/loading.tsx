export default function DiscoveryLoading() {
  return (
    <div className="animate-pulse">
      {/* Toolbar skeleton */}
      <div className="border-b border-border-subtle">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="h-10 w-48 rounded-pill bg-bg-muted" />
          <div className="h-10 w-64 rounded-pill bg-bg-muted" />
          <div className="h-5 w-12 rounded bg-bg-muted" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Title skeleton */}
        <div className="flex items-baseline justify-between">
          <div className="h-8 w-64 rounded-md bg-bg-muted" />
          <div className="h-5 w-16 rounded-md bg-bg-muted" />
        </div>

        {/* Grid skeleton: 6 cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-card border border-border-subtle bg-bg-card"
            >
              <div className="aspect-[4/3] bg-bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-5 w-3/4 rounded bg-bg-muted" />
                <div className="h-4 w-1/2 rounded bg-bg-muted" />
                <div className="h-4 w-1/3 rounded bg-bg-muted" />
                <div className="flex items-center justify-between">
                  <div className="h-6 w-16 rounded-badge bg-bg-muted" />
                  <div className="h-4 w-12 rounded bg-bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
