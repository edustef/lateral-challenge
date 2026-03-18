export default function CheckoutLoading() {
  return (
    <div className="py-6 animate-pulse">
      {/* Back link */}
      <div className="mb-6 h-4 w-32 rounded bg-bg-muted" />

      {/* Heading */}
      <div className="mb-8 h-8 w-64 rounded bg-bg-muted" />

      <div className="mx-auto max-w-2xl">
        {/* Step indicators */}
        <div className="mb-8 flex items-center justify-between">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div className="h-8 w-8 rounded-full bg-bg-muted" />
                <div className="h-3 w-12 rounded bg-bg-muted" />
              </div>
              {i < 3 && <div className="mx-2 h-px flex-1 bg-border" />}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="rounded-card border border-border-subtle bg-bg-card p-6">
          {/* Form heading */}
          <div className="mb-4 h-6 w-48 rounded bg-bg-muted" />

          {/* Form fields */}
          <div className="space-y-4">
            <div className="h-10 w-full rounded-small bg-bg-muted" />
            <div className="h-10 w-full rounded-small bg-bg-muted" />
            <div className="h-10 w-full rounded-small bg-bg-muted" />
          </div>

          {/* Navigation buttons */}
          <div className="mt-6 flex items-center justify-between">
            <div className="h-10 w-20 rounded-button bg-bg-muted" />
            <div className="h-10 w-24 rounded-button bg-bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
