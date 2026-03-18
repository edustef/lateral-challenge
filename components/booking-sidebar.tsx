'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { DatePicker } from '@/components/date-picker';
import { PriceBreakdown } from '@/components/price-breakdown';
import { formatPrice } from '@/lib/utils/price';

function getDefaultCheckIn(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(12, 0, 0, 0);
  return d;
}

function getDefaultCheckOut(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 6);
  d.setHours(12, 0, 0, 0);
  return d;
}

interface BookingSidebarProps {
  stay: {
    id: string;
    slug: string;
    price_per_night: number;
    cleaning_fee: number;
    service_fee: number;
    max_guests: number;
  };
}

export function BookingSidebar({ stay }: BookingSidebarProps) {
  const [checkIn, setCheckIn] = useState<Date | undefined>(getDefaultCheckIn);
  const [checkOut, setCheckOut] = useState<Date | undefined>(getDefaultCheckOut);
  const [guests, setGuests] = useState(2);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  return (
    <div className="rounded-card border border-border-subtle bg-bg-card p-6 shadow-sm lg:sticky lg:top-6">
      {/* Price header */}
      <div className="flex items-baseline gap-1">
        <span className="font-heading text-3xl font-semibold text-text-primary">
          {formatPrice(stay.price_per_night)}
        </span>
        <span className="text-text-secondary">/night</span>
      </div>

      {/* Dates */}
      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-text-primary">
          Dates
        </label>
        <DatePicker
          checkIn={checkIn}
          checkOut={checkOut}
          onCheckInChange={setCheckIn}
          onCheckOutChange={setCheckOut}
        />
      </div>

      {/* Guests */}
      <div className="mt-4">
        <label
          htmlFor="guests-select"
          className="mb-2 block text-sm font-medium text-text-primary"
        >
          Guests
        </label>
        <select
          id="guests-select"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm text-foreground bg-[length:16px_16px] bg-[right_8px_center] bg-no-repeat focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus:outline-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}
        >
          {Array.from({ length: stay.max_guests }, (_, i) => i + 1).map(
            (n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'guest' : 'guests'}
              </option>
            )
          )}
        </select>
      </div>

      {/* Price breakdown */}
      {nights > 0 && (
        <div className="mt-5">
          <PriceBreakdown
            pricePerNight={stay.price_per_night}
            nights={nights}
            cleaningFee={stay.cleaning_fee}
            serviceFee={stay.service_fee}
          />
        </div>
      )}

      {/* CTA */}
      <Link
        href={`/stays/${stay.slug}/book`}
        className="mt-6 block w-full rounded-button bg-accent py-3 text-center font-semibold text-white hover:bg-accent/90 transition"
      >
        Book this stay
      </Link>
    </div>
  );
}
