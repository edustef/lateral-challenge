export default function CheckoutLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
        <div className="flex-1 space-y-6 lg:order-1 lg:space-y-8">
          <div className="h-7 w-56 rounded bg-bg-muted sm:h-8 sm:w-72" />

          <div className="space-y-3">
            <div className="h-5 w-44 rounded bg-bg-muted" />
            <div className="hidden rounded-card border border-border p-4 lg:block">
              <div className="h-64 w-full rounded bg-bg-muted" />
            </div>
            <div className="h-11 w-full rounded-small bg-bg-muted lg:hidden" />
          </div>

          <div className="space-y-3">
            <div className="h-5 w-36 rounded bg-bg-muted" />
            <div className="h-11 w-40 rounded-small bg-bg-muted" />
          </div>

          <div className="space-y-3">
            <div className="h-5 w-40 rounded bg-bg-muted" />
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="h-11 flex-1 rounded-small bg-bg-muted sm:h-12" />
              <div className="h-11 flex-1 rounded-small bg-bg-muted sm:h-12" />
            </div>
            <div className="h-11 w-full rounded-small bg-bg-muted sm:h-12" />
            <div className="h-11 w-full rounded-small bg-bg-muted sm:h-12" />
          </div>

          <div className="hidden lg:block">
            <div className="h-12 w-40 rounded-button bg-bg-muted" />
          </div>
        </div>

        <div className="w-full lg:order-2 lg:w-[380px] lg:shrink-0">
          <div className="rounded-card border border-border-subtle bg-bg-card p-5">
            <div className="flex gap-4">
              <div className="h-20 w-28 shrink-0 rounded-small bg-bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 rounded bg-bg-muted" />
                <div className="h-4 w-1/2 rounded bg-bg-muted" />
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="h-4 w-full rounded bg-bg-muted" />
              <div className="h-4 w-full rounded bg-bg-muted" />
              <div className="h-4 w-full rounded bg-bg-muted" />
              <hr className="border-border" />
              <div className="h-5 w-full rounded bg-bg-muted" />
            </div>
          </div>
        </div>

        <div className="w-full lg:hidden">
          <div className="h-12 w-full rounded-button bg-bg-muted" />
        </div>
      </div>
    </div>
  );
}
