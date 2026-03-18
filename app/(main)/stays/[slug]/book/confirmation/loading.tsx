export default function ConfirmationLoading() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center animate-pulse px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-[640px] flex-col items-center gap-10">
        {/* Success circle */}
        <div className="h-[72px] w-[72px] rounded-full bg-bg-muted" />

        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="mx-auto h-9 w-64 rounded bg-bg-muted" />
          <div className="mx-auto h-5 w-80 rounded bg-bg-muted" />
        </div>

        {/* Booking details card */}
        <div className="flex w-full flex-col overflow-hidden rounded-card border border-border bg-bg-card sm:flex-row">
          {/* Stay image */}
          <div className="h-40 w-full shrink-0 bg-bg-muted sm:h-auto sm:w-[220px]" />

          {/* Details */}
          <div className="flex-1 space-y-4 p-5 sm:p-6">
            <div className="space-y-1">
              <div className="h-5 w-3/4 rounded bg-bg-muted" />
              <div className="h-3.5 w-1/2 rounded bg-bg-muted" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="h-3 w-14 rounded bg-bg-muted" />
                <div className="h-3.5 w-24 rounded bg-bg-muted" />
              </div>
              <div className="space-y-1">
                <div className="h-3 w-16 rounded bg-bg-muted" />
                <div className="h-3.5 w-24 rounded bg-bg-muted" />
              </div>
              <div className="space-y-1">
                <div className="h-3 w-12 rounded bg-bg-muted" />
                <div className="h-3.5 w-16 rounded bg-bg-muted" />
              </div>
              <div className="space-y-1">
                <div className="h-3 w-16 rounded bg-bg-muted" />
                <div className="h-3.5 w-20 rounded bg-bg-muted" />
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <div className="h-12 w-full rounded-button bg-bg-muted sm:w-44" />
          <div className="h-12 w-full rounded-button border border-border bg-bg-muted sm:w-44" />
        </div>
      </div>
    </div>
  );
}
