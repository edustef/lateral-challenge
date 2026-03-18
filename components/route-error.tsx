'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Route error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-card border border-border-subtle bg-bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error-tint">
          <AlertTriangle className="h-6 w-6 text-error" />
        </div>
        <h2 className="font-heading text-xl font-semibold text-text-primary">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          An unexpected error occurred. Please try again or return to the home page.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-button bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-button border border-border px-5 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg-muted focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
