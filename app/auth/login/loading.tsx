export default function LoginLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center animate-pulse">
      <div className="w-full max-w-sm rounded-card border border-border-subtle bg-bg-card p-8">
        {/* Heading */}
        <div className="mx-auto mb-6 h-7 w-32 rounded bg-bg-muted" />

        {/* Input */}
        <div className="mb-4 h-10 w-full rounded-lg bg-bg-muted" />

        {/* Button */}
        <div className="h-11 w-full rounded-lg bg-bg-muted" />
      </div>
    </div>
  );
}
