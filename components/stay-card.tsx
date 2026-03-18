import Image from 'next/image';
import Link from 'next/link';
import { Users } from 'lucide-react';
import type { StayCard as StayCardType } from '@/lib/actions/stays';

export function StayCard({ stay }: { stay: StayCardType }) {
  const price = Math.round(stay.price_per_night / 100);
  const href = `/stays/${stay.slug}`;

  return (
    <Link href={href} className="group block">
      {/* Desktop: vertical card (hidden below md) */}
      <article className="hidden md:flex md:flex-col overflow-hidden rounded-card border border-border-subtle bg-bg-card transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/3]">
          <Image
            src={stay.images[0] ?? ''}
            alt={stay.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        </div>
        <div className="flex flex-col gap-2 p-4">
          <h3 className="font-heading text-base font-semibold text-text-primary line-clamp-1">
            {stay.title}
          </h3>
          <p className="text-sm text-text-secondary">{stay.location}</p>
          <div className="flex items-baseline gap-1">
            <span className="font-mono font-semibold text-text-primary">
              ${price}
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
      <article className="flex flex-row gap-4 rounded-small border border-border-subtle bg-bg-card p-3 md:hidden">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-small">
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
            <p className="text-xs text-text-secondary">{stay.location}</p>
          </div>
          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-sm font-semibold text-text-primary">
                ${price}
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
