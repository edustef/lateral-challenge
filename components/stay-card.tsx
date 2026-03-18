import Image from 'next/image';
import Link from 'next/link';
import { Star, Users } from 'lucide-react';
import { formatPrice } from '@/lib/utils/price';
import { FavoriteButton } from '@/components/favorite-button';
import type { StayCard as StayCardType } from '@/lib/actions/stays';

export function StayCard({ stay, isFavorited = false }: { stay: StayCardType; isFavorited?: boolean }) {
  const price = formatPrice(stay.price_per_night);
  const href = `/stays/${stay.slug}`;

  return (
    <Link href={href} className="group block" data-testid="stay-card">
      {/* Desktop: vertical card (hidden below md) */}
      <article className="hidden md:flex md:flex-col overflow-hidden rounded-card border border-border-subtle bg-bg-card transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <div className="relative aspect-[4/3]">
          <FavoriteButton stayId={stay.id} isFavorited={isFavorited} />
          <Image
            src={stay.images[0] ?? ''}
            alt={stay.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        </div>
        <div className="flex flex-col gap-2 p-4">
          <h3 className="font-heading text-base font-semibold text-text-primary line-clamp-1">
            {stay.title}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-text-secondary">{stay.location}</p>
            {stay.avg_rating !== null && (
              <span className="flex items-center gap-0.5 text-sm text-text-secondary">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                {stay.avg_rating.toFixed(1)}
                <span className="text-text-muted">({stay.review_count})</span>
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono font-semibold text-text-primary">
              {price}
            </span>
            <span className="text-sm text-text-secondary">/ night</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="rounded-badge bg-bg-muted px-3 py-1 text-xs text-text-secondary capitalize">
              {stay.type}
            </span>
            <span className="flex items-center gap-1 text-xs text-text-secondary">
              <Users size={14} />
              {stay.max_guests} guests
            </span>
          </div>
        </div>
      </article>

      {/* Mobile: horizontal card (shown below md) */}
      <article className="flex flex-row gap-4 rounded-small border border-border-subtle bg-bg-card p-3 transition-all duration-200 active:scale-[0.98] md:hidden">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-small">
          <FavoriteButton stayId={stay.id} isFavorited={isFavorited} />
          <Image
            src={stay.images[0] ?? ''}
            alt={stay.title}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <h3 className="font-heading text-sm font-semibold text-text-primary line-clamp-1">
              {stay.title}
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-xs text-text-secondary">{stay.location}</p>
              {stay.avg_rating !== null && (
                <span className="flex items-center gap-0.5 text-xs text-text-secondary">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  {stay.avg_rating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-sm font-semibold text-text-primary">
                {price}
              </span>
              <span className="text-xs text-text-secondary">/ night</span>
            </div>
            <span className="rounded-badge bg-bg-muted px-2 py-0.5 text-xs text-text-secondary capitalize">
              {stay.type}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
