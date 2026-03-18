'use client';

import { useOptimistic, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { toggleFavorite } from '@/lib/actions/favorites';

export function FavoriteButton({
  stayId,
  isFavorited,
}: {
  stayId: string;
  isFavorited: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticFavorited, setOptimisticFavorited] = useOptimistic(isFavorited);

  return (
    <button
      type="button"
      aria-label={optimisticFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={optimisticFavorited}
      className="absolute top-2 right-2 z-10 rounded-full bg-white/80 p-1.5 backdrop-blur-sm transition-colors"
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        startTransition(async () => {
          setOptimisticFavorited(!optimisticFavorited);
          await toggleFavorite(stayId);
        });
      }}
    >
      <Heart
        size={18}
        className={
          optimisticFavorited
            ? 'fill-red-500 text-red-500'
            : 'text-text-muted hover:text-red-400'
        }
      />
    </button>
  );
}
