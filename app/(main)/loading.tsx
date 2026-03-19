export default function DiscoveryLoading() {
  return (
    <>
      <section className="flex flex-col items-center px-4 pb-4 pt-10 text-center sm:px-6 sm:pb-8 sm:pt-20 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Find your perfect escape
        </h1>
        <p className="mt-2 text-pretty text-base text-text-secondary">
          Describe what you&apos;re looking for and let AI find it
        </p>
        <div className="mt-6 hidden h-12 w-full max-w-2xl animate-pulse rounded-pill bg-bg-muted sm:mt-8 md:block" />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-4 w-24 animate-pulse rounded bg-bg-muted" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-card border border-border-subtle bg-bg-card"
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
    </>
  );
}
