import Link from 'next/link';
import { Heart } from 'lucide-react';
import { getFavoriteStays } from '@/lib/actions/favorites';
import { BackButton } from '@/components/back-button';
import { StaysGrid } from '@/components/stays-grid';

export const metadata = {
  title: 'Your Wishlist',
};

export default async function WishlistPage() {
  const favorites = await getFavoriteStays();

  if (favorites.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <Heart className="h-12 w-12 text-text-muted" />
          <h1 className="font-heading text-2xl font-semibold text-text-primary">
            No saved stays yet
          </h1>
          <p className="text-sm text-text-secondary">
            Tap the heart on any stay to save it for later.
          </p>
          <Link
            href="/"
            className="mt-2 rounded-pill bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            Browse stays
          </Link>
        </div>
      </section>
    );
  }

  const favoriteIds = favorites.map((s) => s.id);

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
        <span className="text-sm text-text-secondary">
          {favorites.length} {favorites.length === 1 ? 'stay' : 'stays'}
        </span>
      </div>

      <StaysGrid stays={favorites} favoriteIds={favoriteIds} />
    </section>
  );
}
