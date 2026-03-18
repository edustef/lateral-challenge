export default function DiscoveryLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero section */}
      <section className="flex flex-col items-center px-4 pb-4 pt-10 text-center sm:px-6 sm:pb-8 sm:pt-20 lg:px-8">
        <div className="h-9 w-72 rounded bg-bg-muted sm:h-10 sm:w-96" />
        <div className="mt-2 h-5 w-64 rounded bg-bg-muted" />
        <div className="mt-6 hidden h-12 w-full max-w-2xl rounded-pill bg-bg-muted sm:mt-8 md:block" />
      </section>

      {/* Stays section */}
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        {/* Result count */}
        <div className="mb-6 h-4 w-24 rounded bg-bg-muted" />

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
    </div>
  );
}
