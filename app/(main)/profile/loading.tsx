export default function ProfileLoading() {
  return (
    <div className="py-6 animate-pulse">
      {/* Heading */}
      <div className="mb-2 h-8 w-48 rounded bg-bg-muted" />
      {/* Email */}
      <div className="mb-8 h-4 w-64 rounded bg-bg-muted" />

      {/* Booking card skeletons */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 rounded-card border border-border-subtle bg-bg-card p-4"
          >
            {/* Image */}
            <div className="h-24 w-32 flex-shrink-0 rounded-small bg-bg-muted" />
            {/* Details */}
            <div className="flex-1 space-y-2">
              <div className="h-5 w-3/4 rounded bg-bg-muted" />
              <div className="h-4 w-1/2 rounded bg-bg-muted" />
              <div className="h-4 w-1/3 rounded bg-bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
