'use client';

import { useOptimistic, useTransition } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label={optimisticFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={optimisticFavorited}
      className="z-10 rounded-full bg-white/80 p-1.5 backdrop-blur-sm transition-colors"
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        startTransition(async () => {
          setOptimisticFavorited(!optimisticFavorited);
          const result = await toggleFavorite(stayId);
          if (result.error === 'Not authenticated') {
            setOptimisticFavorited(isFavorited);
            router.push('/auth/login');
          }
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
