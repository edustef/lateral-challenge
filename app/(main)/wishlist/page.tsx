import Link from 'next/link';
import { Heart } from 'lucide-react';
import { getFavoriteStays } from '@/lib/actions/favorites';
import { StaysGrid } from '@/components/stays-grid';

export const metadata = {
  title: 'Your Wishlist',
};

export default async function WishlistPage() {
  const favorites = await getFavoriteStays();

  if (favorites.length === 0) {
    return (
      <section className="py-20">
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

  const favoriteSet = new Set(favorites.map((s) => s.id));

  return (
    <section className="py-6 space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="font-heading text-2xl font-semibold text-text-primary">
          Your Wishlist
        </h1>
        <span className="text-sm text-text-secondary">
          {favorites.length} {favorites.length === 1 ? 'stay' : 'stays'}
        </span>
      </div>

      <StaysGrid stays={favorites} favoriteIds={favoriteSet} />
    </section>
  );
}
