export default function StayDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 animate-pulse">
      {/* Back link skeleton */}
      <div className="mb-6 h-4 w-32 rounded bg-bg-muted" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left column */}
        <div>
          {/* Hero image skeleton */}
          <div className="aspect-[16/9] w-full rounded-card bg-bg-muted" />

          {/* Thumbnails skeleton */}
          <div className="mt-3 flex gap-3">
            <div className="h-20 w-28 rounded-small bg-bg-muted" />
            <div className="h-20 w-28 rounded-small bg-bg-muted" />
            <div className="h-20 w-28 rounded-small bg-bg-muted" />
          </div>

          {/* Title skeleton */}
          <div className="mt-8 h-8 w-3/4 rounded bg-bg-muted" />

          {/* Location skeleton */}
          <div className="mt-3 h-4 w-1/2 rounded bg-bg-muted" />

          {/* Description skeleton */}
          <div className="mt-8 space-y-2">
            <div className="h-5 w-40 rounded bg-bg-muted" />
            <div className="mt-3 h-4 w-full rounded bg-bg-muted" />
            <div className="h-4 w-full rounded bg-bg-muted" />
            <div className="h-4 w-2/3 rounded bg-bg-muted" />
          </div>

          {/* Amenities skeleton */}
          <div className="mt-8 space-y-2">
            <div className="h-5 w-24 rounded bg-bg-muted" />
            <div className="mt-3 flex flex-wrap gap-2">
              <div className="h-9 w-24 rounded-badge bg-bg-muted" />
              <div className="h-9 w-28 rounded-badge bg-bg-muted" />
              <div className="h-9 w-20 rounded-badge bg-bg-muted" />
              <div className="h-9 w-32 rounded-badge bg-bg-muted" />
            </div>
          </div>

          {/* Reviews skeleton */}
          <div className="mt-8 space-y-4">
            <div className="h-5 w-32 rounded bg-bg-muted" />
            <div className="space-y-3 py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-bg-muted" />
                <div className="space-y-1">
                  <div className="h-4 w-24 rounded bg-bg-muted" />
                  <div className="h-3 w-16 rounded bg-bg-muted" />
                </div>
              </div>
              <div className="h-4 w-full rounded bg-bg-muted" />
            </div>
          </div>
        </div>

        {/* Right column - sidebar skeleton */}
        <div>
          <div className="rounded-card border border-border-subtle bg-bg-card p-6 lg:sticky lg:top-24">
            <div className="h-9 w-32 rounded bg-bg-muted" />
            <div className="mt-5 space-y-3">
              <div className="h-4 w-12 rounded bg-bg-muted" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-10 rounded-small bg-bg-muted" />
                <div className="h-10 rounded-small bg-bg-muted" />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="h-4 w-16 rounded bg-bg-muted" />
              <div className="h-10 rounded-small bg-bg-muted" />
            </div>
            <div className="mt-5 space-y-3">
              <div className="h-4 w-full rounded bg-bg-muted" />
              <div className="h-4 w-full rounded bg-bg-muted" />
              <div className="h-4 w-full rounded bg-bg-muted" />
              <hr className="border-border" />
              <div className="h-5 w-full rounded bg-bg-muted" />
            </div>
            <div className="mt-6 h-12 w-full rounded-button bg-bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
