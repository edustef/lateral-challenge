import { BackButton } from '@/components/back-button';

export default function WishlistLoading() {
  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <BackButton
        label="Back to results"
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition"
      />

      <div className="flex items-baseline justify-between">
        <h1 className="font-heading text-2xl font-semibold text-text-primary">
          Your Wishlist
        </h1>
        <div className="h-4 w-16 animate-pulse rounded bg-bg-muted" />
      </div>

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
  );
}
