import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Users } from 'lucide-react';
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
    };
  };
};

function formatDateRange(checkIn: string, checkOut: string): string {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const startStr = start.toLocaleDateString('en-US', opts);
  const endStr = end.toLocaleDateString('en-US', {
    ...opts,
    year: 'numeric',
  });
  return `${startStr} - ${endStr}`;
}

export function BookingCard({ booking }: BookingCardProps) {
  const { stay } = booking;
  const image = stay.images?.[0] ?? '/placeholder.jpg';

  return (
    <div className="flex gap-4 rounded-card border border-border-subtle bg-bg-card p-4">
      {/* Stay image */}
      <Link href={`/stays/${stay.slug}`} className="shrink-0">
        <div className="relative h-20 w-20 overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={stay.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      </Link>

      {/* Booking details */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          href={`/stays/${stay.slug}`}
          className="truncate font-heading text-base font-semibold text-text-primary hover:underline"
        >
          {stay.title}
        </Link>
        <p className="truncate text-sm text-text-secondary">{stay.location}</p>

        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-text-muted">
          <span className="inline-flex items-center gap-1">
            <CalendarDays size={14} />
            {formatDateRange(booking.check_in, booking.check_out)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users size={14} />
            {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-3">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              booking.status === 'confirmed'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {booking.status}
          </span>
          <span className="text-sm font-semibold text-text-primary">
            {formatPrice(booking.total_price)}
          </span>
        </div>
      </div>
    </div>
  );
}
