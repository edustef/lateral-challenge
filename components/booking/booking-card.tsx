import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils/price';

type BookingCardProps = {
  booking: {
    id: string;
    check_in: string;
    check_out: string;
    guests: number;
    total_price: number;
    status: string;
    stay: {
      title: string;
      location: string;
      images: string[];
      slug: string;
      price_per_night: number;
    };
  };
};

function formatDateRange(checkIn: string, checkOut: string): string {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${startStr} — ${endStr}`;
}

function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === 'confirmed'
      ? 'bg-status-confirmed-tint text-status-confirmed'
      : status === 'pending'
        ? 'bg-status-pending-tint text-status-pending'
        : 'bg-status-cancelled-tint text-status-cancelled';

  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles}`}>
      {status}
    </span>
  );
}

export function BookingCard({ booking }: BookingCardProps) {
  const { stay } = booking;
  const image = stay.images?.[0] ?? '/placeholder.jpg';
  const nights = calculateNights(booking.check_in, booking.check_out);

  return (
    <div className="flex overflow-hidden rounded-card border border-border bg-bg-card transition-all duration-200 hover:shadow-md">
      {/* Card Image */}
      <Link href={`/stays/${stay.slug}`} className="shrink-0">
        <div className="relative h-full w-full max-w-[280px]">
          <Image
            src={image}
            alt={stay.title}
            fill
            loading="lazy"
            className="object-cover"
            sizes="280px"
          />
        </div>
      </Link>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-6">
        {/* Top Info */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <StatusBadge status={booking.status} />
            <span className="text-sm font-semibold text-text-primary">
              {formatPrice(stay.price_per_night)} / night
            </span>
          </div>
          <Link
            href={`/stays/${stay.slug}`}
            className="font-mono text-lg font-semibold text-text-primary hover:underline"
          >
            {stay.title}
          </Link>
          <p className="text-[13px] text-text-muted">{stay.location}</p>
        </div>

        {/* Dates & Guests */}
        <div className="mt-4 flex gap-6">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Check-in / Check-out
            </span>
            <span className="text-sm text-text-primary">
              {formatDateRange(booking.check_in, booking.check_out)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Guests
            </span>
            <span className="text-sm text-text-primary">
              {booking.guests} {booking.guests === 1 ? 'Adult' : 'Adults'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <Link
            href={`/stays/${stay.slug}`}
            className="rounded-full bg-text-primary px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-text-primary/90 active:scale-[0.98]"
          >
            View Stay
          </Link>
          <button
            type="button"
            className="rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-text-muted transition-colors hover:bg-bg-page active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* Compact card for mobile */
export function BookingCardCompact({ booking }: BookingCardProps) {
  const { stay } = booking;
  const image = stay.images?.[0] ?? '/placeholder.jpg';

  return (
    <div className="flex gap-4 rounded-badge border border-border bg-bg-card p-4 transition-all duration-200 hover:shadow-md active:scale-[0.98]">
      <Link href={`/stays/${stay.slug}`} className="shrink-0">
        <div className="relative h-20 w-20 overflow-hidden rounded-xl">
          <Image src={image} alt={stay.title} fill loading="lazy" className="object-cover" sizes="80px" />
        </div>
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link href={`/stays/${stay.slug}`} className="truncate font-mono text-sm font-semibold text-text-primary hover:underline">
          {stay.title}
        </Link>
        <p className="truncate text-xs text-text-muted">{stay.location}</p>
        <p className="text-xs text-text-muted">{formatDateRange(booking.check_in, booking.check_out)}</p>
        <div className="mt-auto flex items-center gap-2">
          <StatusBadge status={booking.status} />
          <span className="text-sm font-semibold text-text-primary">{formatPrice(booking.total_price)}</span>
        </div>
      </div>
    </div>
  );
}
