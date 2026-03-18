import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils/price';
import { FavoriteButton } from '@/components/favorite-button';
import type { StayCard as StayCardType } from '@/lib/actions/stays';

export function StayCard({ stay, isFavorited = false }: { stay: StayCardType; isFavorited?: boolean }) {
  const price = formatPrice(stay.price_per_night);
  const href = `/stays/${stay.slug}`;

  return (
    <Link href={href} className="group block" data-testid="stay-card">
      {/* Desktop card */}
      <article className="hidden md:block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <div className="absolute top-2 right-2 z-10">
            <FavoriteButton stayId={stay.id} isFavorited={isFavorited} />
          </div>
          <Image
            src={stay.images[0] ?? ''}
            alt={stay.title}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        </div>
        <div className="mt-2.5 space-y-0.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-semibold text-text-primary line-clamp-1">
              {stay.title}
            </h3>
            {stay.avg_rating !== null && (
              <span className="flex shrink-0 items-center gap-1 text-sm text-text-secondary">
                <Star size={13} className="fill-text-primary text-text-primary" />
                {stay.avg_rating.toFixed(1)}
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary">{stay.location}</p>
          <p className="pt-1 text-sm">
            <span className="font-semibold text-text-primary">{price}</span>
            <span className="text-text-muted"> / night</span>
          </p>
        </div>
      </article>

      {/* Mobile card */}
      <article className="flex gap-3 md:hidden">
        <div className="relative h-[100px] w-[100px] flex-shrink-0 overflow-hidden rounded-xl">
          <Image
            src={stay.images[0] ?? ''}
            alt={stay.title}
            fill
            loading="lazy"
            className="object-cover"
            sizes="100px"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[15px] font-semibold text-text-primary line-clamp-1">
                {stay.title}
              </h3>
              <div className="shrink-0">
                <FavoriteButton stayId={stay.id} isFavorited={isFavorited} />
              </div>
            </div>
            <p className="text-sm text-text-secondary">{stay.location}</p>
            {stay.avg_rating !== null && (
              <span className="flex items-center gap-1 text-sm text-text-secondary">
                <Star size={12} className="fill-text-primary text-text-primary" />
                {stay.avg_rating.toFixed(1)}
                <span className="text-text-muted">({stay.review_count})</span>
              </span>
            )}
          </div>
          <p className="text-sm">
            <span className="font-semibold text-text-primary">{price}</span>
            <span className="text-text-muted"> / night</span>
          </p>
        </div>
      </article>
    </Link>
  );
}
