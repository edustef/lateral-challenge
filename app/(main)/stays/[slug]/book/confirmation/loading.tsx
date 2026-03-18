export default function ConfirmationLoading() {
  return (
    <div className="flex items-center justify-center py-12 animate-pulse">
      <div className="w-full max-w-lg rounded-card border border-border-subtle bg-bg-card p-8 text-center">
        {/* Icon placeholder */}
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-bg-muted" />

        {/* Heading */}
        <div className="mx-auto mb-2 h-7 w-56 rounded bg-bg-muted" />

        {/* Paragraph */}
        <div className="mx-auto mb-6 h-4 w-72 rounded bg-bg-muted" />

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="h-16 rounded-small bg-bg-muted" />
          <div className="h-16 rounded-small bg-bg-muted" />
          <div className="h-16 rounded-small bg-bg-muted" />
          <div className="h-16 rounded-small bg-bg-muted" />
        </div>
      </div>
    </div>
  );
}
