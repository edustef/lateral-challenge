export default function WishlistLoading() {
  return (
    <section className="mx-auto max-w-7xl animate-pulse space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6 h-4 w-28 rounded bg-bg-muted" />

      {/* Title + count */}
      <div className="flex items-baseline justify-between">
        <div className="h-7 w-36 rounded bg-bg-muted" />
        <div className="h-4 w-16 rounded bg-bg-muted" />
      </div>

      {/* Grid skeleton: 6 cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-card border border-border-subtle bg-bg-card"
          >
            <div className="aspect-[4/3] bg-bg-muted" />
            <div className="space-y-2 p-4">
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
    </section>
  );
}
