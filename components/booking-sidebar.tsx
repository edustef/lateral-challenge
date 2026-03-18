'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Users, Minus, Plus } from 'lucide-react';
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

function guestsForTravelType(type: string): number {
  switch (type) {
    case 'solo': return 1;
    case 'duo': return 2;
    case 'family':
    case 'group': return 3;
    default: return 2;
  }
}

interface BookingSidebarProps {
  stay: {
    id: string;
    slug: string;
    price_per_night: number;
    cleaning_fee: number;
    service_fee: number;
    max_guests: number;
    travel_type: string;
  };
  disabledDates?: { from: string; to: string }[];
}

function defaultsOverlapDisabled(
  disabledDates: { from: string; to: string }[]
): boolean {
  if (disabledDates.length === 0) return false;
  const checkIn = getDefaultCheckIn();
  const checkOut = getDefaultCheckOut();
  return disabledDates.some((range) => {
    const from = new Date(range.from + 'T00:00:00');
    const to = new Date(range.to + 'T00:00:00');
    return checkIn < to && checkOut > from;
  });
}

export function BookingSidebar({ stay, disabledDates = [] }: BookingSidebarProps) {
  const hasOverlap = defaultsOverlapDisabled(disabledDates);
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    hasOverlap ? undefined : getDefaultCheckIn
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    hasOverlap ? undefined : getDefaultCheckOut
  );
  const [guests, setGuests] = useState(() =>
    Math.min(guestsForTravelType(stay.travel_type), stay.max_guests)
  );

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  const hasDateConflict = useMemo(() => {
    if (!checkIn || !checkOut) return false;
    return disabledDates.some((range) => {
      const from = new Date(range.from + 'T00:00:00');
      const to = new Date(range.to + 'T00:00:00');
      return checkIn < to && checkOut > from;
    });
  }, [checkIn, checkOut, disabledDates]);

  const bookingUrl = `/stays/${stay.slug}/book?${new URLSearchParams({
    ...(checkIn ? { checkIn: `${checkIn.getFullYear()}-${String(checkIn.getMonth() + 1).padStart(2, '0')}-${String(checkIn.getDate()).padStart(2, '0')}` } : {}),
    ...(checkOut ? { checkOut: `${checkOut.getFullYear()}-${String(checkOut.getMonth() + 1).padStart(2, '0')}-${String(checkOut.getDate()).padStart(2, '0')}` } : {}),
    guests: String(guests),
  }).toString()}`;

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden rounded-card border border-border-subtle bg-bg-card p-6 shadow-sm lg:sticky lg:top-24 lg:block">
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
            disabledDates={disabledDates}
          />
        </div>

        {/* Guests */}
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-text-primary">
            Guests
          </label>
          <div className="flex items-center justify-between rounded-small border border-border bg-bg-card px-4 h-12">
            <div className="flex items-center gap-2.5">
              <Users size={16} className="text-text-muted" />
              <span className="text-sm text-text-primary">
                {guests} adult{guests !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                disabled={guests <= 1}
                aria-label="Decrease guests"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-text-secondary hover:bg-bg-muted disabled:opacity-40 transition"
              >
                <Minus size={14} />
              </button>
              <span className="min-w-[1.25rem] text-center text-sm font-medium text-text-primary">
                {guests}
              </span>
              <button
                type="button"
                onClick={() => setGuests((g) => Math.min(stay.max_guests, g + 1))}
                disabled={guests >= stay.max_guests}
                aria-label="Increase guests"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white disabled:opacity-40 transition"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
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

        {/* Date conflict warning */}
        {hasDateConflict && (
          <p className="mt-4 rounded-small border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">
            Selected dates include unavailable dates. Please choose a different range.
          </p>
        )}

        {/* CTA */}
        {hasDateConflict ? (
          <span
            aria-disabled="true"
            className="mt-6 block w-full rounded-button bg-accent/40 py-3 text-center font-semibold text-white cursor-not-allowed"
          >
            Book this stay
          </span>
        ) : (
          <Link
            href={bookingUrl}
            aria-label="Book this stay"
            className="mt-6 block w-full rounded-button bg-accent py-3 text-center font-semibold text-white hover:bg-accent/90 transition"
          >
            Book this stay
          </Link>
        )}
      </div>

      {/* Mobile floating bottom bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 lg:hidden"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))' }}
      >
        <div className="flex items-center justify-between rounded-2xl border border-border bg-bg-card px-4 py-3 shadow-lg">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-lg font-semibold text-text-primary">
                {formatPrice(stay.price_per_night)}
              </span>
              <span className="text-sm text-text-secondary">/night</span>
            </div>
            {nights > 0 && (
              <p className="text-xs text-text-muted">
                {formatPrice(stay.price_per_night * nights + stay.cleaning_fee + stay.service_fee)} total · {nights} {nights === 1 ? 'night' : 'nights'}
              </p>
            )}
          </div>
          {hasDateConflict ? (
            <span
              aria-disabled="true"
              className="rounded-button bg-accent/40 px-6 py-2.5 text-sm font-semibold text-white cursor-not-allowed"
            >
              Book
            </span>
          ) : (
            <Link
              href={bookingUrl}
              className="rounded-button bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 transition"
            >
              Book
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
