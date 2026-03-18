import Link from 'next/link';
import { SearchX } from 'lucide-react';

export default function StayNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <SearchX size={48} className="text-text-muted" />
      <h1 className="font-heading text-2xl font-semibold text-text-primary">
        Stay not found
      </h1>
      <p className="max-w-md text-text-body">
        This stay may have been removed or the URL might be incorrect.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-[--radius-button] bg-accent px-6 py-3 font-semibold text-white hover:bg-accent/90 transition"
      >
        Browse all stays
      </Link>
    </div>
  );
}
