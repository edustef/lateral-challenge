'use client';

import { useState, useTransition, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';
import { Users, Lock, ShieldCheck, Minus, Plus } from 'lucide-react';
import { PriceBreakdown } from '@/components/price-breakdown';
import { DatePicker } from '@/components/date-picker';
import { calculateNights, calculateTotal, formatPrice } from '@/lib/utils/price';
import { createBooking } from '@/lib/actions/bookings';
import Image from 'next/image';

interface CheckoutFormProps {
  stay: {
    id: string;
    slug: string;
    title: string;
    price_per_night: number;
    cleaning_fee: number;
    service_fee: number;
    max_guests: number;
    images: string[];
    location: string;
    travel_type: string;
  };
  prefill?: {
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  };
  user?: {
    name: string;
    email: string;
  };
  disabledDates?: { from: string; to: string }[];
}

function rangeOverlapsDisabled(
  checkIn: Date,
  checkOut: Date,
  disabledDates: { from: string; to: string }[]
): boolean {
  return disabledDates.some((range) => {
    const from = new Date(range.from + 'T00:00:00');
    const to = new Date(range.to + 'T00:00:00');
    return checkIn < to && checkOut > from;
  });
}

function parseDate(str?: string): Date | undefined {
  if (!str) return undefined;
  const d = new Date(str + 'T12:00:00');
  return isNaN(d.getTime()) ? undefined : d;
}

export function CheckoutForm({ stay, prefill, user, disabledDates = [] }: CheckoutFormProps) {
  const disabledMatchers = disabledDates.map((range) => ({
    from: new Date(range.from + 'T00:00:00'),
    to: new Date(range.to + 'T00:00:00'),
  }));
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [range, setRange] = useState<DateRange | undefined>(() => {
    const from = parseDate(prefill?.checkIn);
    const to = parseDate(prefill?.checkOut);
    return from ? { from, to } : undefined;
  });
  const [guests, setGuests] = useState(prefill?.guests ?? 2);
  const [firstName, setFirstName] = useState(() => {
    if (!user?.name) return '';
    const parts = user.name.split(' ');
    return parts[0] ?? '';
  });
  const [lastName, setLastName] = useState(() => {
    if (!user?.name) return '';
    const parts = user.name.split(' ');
    return parts.slice(1).join(' ');
  });
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const checkIn = range?.from;
  const checkOut = range?.to;

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return calculateNights(checkIn, checkOut);
  }, [checkIn, checkOut]);

  const total = useMemo(() => {
    if (nights === 0) return 0;
    return calculateTotal({
      pricePerNight: stay.price_per_night,
      nights,
      cleaningFee: stay.cleaning_fee,
      serviceFee: stay.service_fee,
    });
  }, [nights, stay.price_per_night, stay.cleaning_fee, stay.service_fee]);

  const hasDateConflict = useMemo(() => {
    if (!checkIn || !checkOut) return false;
    return rangeOverlapsDisabled(checkIn, checkOut, disabledDates);
  }, [checkIn, checkOut, disabledDates]);

  const canSubmit =
    !!checkIn &&
    !!checkOut &&
    nights > 0 &&
    !hasDateConflict &&
    guests >= 1 &&
    firstName.trim() !== '' &&
    email.trim() !== '';

  function handleSubmit() {
    if (!checkIn || !checkOut) return;

    const formData = new FormData();
    formData.set('stayId', stay.id);
    formData.set('slug', stay.slug);
    formData.set('checkIn', `${checkIn.getFullYear()}-${String(checkIn.getMonth() + 1).padStart(2, '0')}-${String(checkIn.getDate()).padStart(2, '0')}`);
    formData.set('checkOut', `${checkOut.getFullYear()}-${String(checkOut.getMonth() + 1).padStart(2, '0')}-${String(checkOut.getDate()).padStart(2, '0')}`);
    formData.set('guests', String(guests));
    formData.set('contactName', `${firstName} ${lastName}`.trim());
    formData.set('contactEmail', email);
    formData.set('contactPhone', phone);
    formData.set('totalPrice', String(total));

    startTransition(async () => {
      const result = await createBooking(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  const formatDateDisplay = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });


  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
      {/* Form — first on mobile, left column on desktop */}
      <div className="flex-1 space-y-6 lg:order-1 lg:space-y-8">
        <h1 className="font-heading text-xl font-medium tracking-tight text-text-primary sm:text-[28px]">
          Complete your booking
        </h1>

        {/* Date Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-text-primary sm:text-base">
            When are you staying?
          </h2>

          {/* Mobile: popover date picker */}
          <div className="lg:hidden">
            <DatePicker
              checkIn={checkIn}
              checkOut={checkOut}
              onCheckInChange={(d) => setRange((r) => ({ from: d, to: r?.to }))}
              onCheckOutChange={(d) => setRange((r) => ({ from: r?.from, to: d }))}
              disabledDates={disabledDates}
            />
          </div>

          {/* Desktop: inline 2-month calendar */}
          <div className="hidden lg:block rounded-card border border-border p-4">
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              disabled={[{ before: tomorrow }, ...disabledMatchers]}
              numberOfMonths={2}
              showOutsideDays={false}
              defaultMonth={checkIn ?? tomorrow}
              className="w-full bg-transparent [--cell-size:--spacing(9)]"
              classNames={{
                months: "flex w-full gap-8",
                month: "flex-1 flex flex-col gap-4",
              }}
            />
          </div>

          {checkIn && checkOut && (
            <p className="text-xs text-text-secondary sm:text-sm">
              {nights} night{nights !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        {/* Guest Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-text-primary sm:text-base">
            How many guests?
          </h2>
          <div className="flex items-center justify-between rounded-small border border-border bg-bg-card px-4 h-11 sm:h-12">
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

        {/* Contact Section — only show if user is not signed in */}
        {!user && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-text-primary sm:text-base">
              Contact information
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1 space-y-1">
                <label htmlFor="firstName" className="block text-xs font-medium text-text-primary sm:text-[13px]">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jane"
                  className="h-11 w-full rounded-small border border-border bg-bg-card px-4 text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-accent/30 sm:h-12"
                />
              </div>
              <div className="flex-1 space-y-1">
                <label htmlFor="lastName" className="block text-xs font-medium text-text-primary sm:text-[13px]">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Cooper"
                  className="h-11 w-full rounded-small border border-border bg-bg-card px-4 text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-accent/30 sm:h-12"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-medium text-text-primary sm:text-[13px]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="h-11 w-full rounded-small border border-border bg-bg-card px-4 text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-accent/30 sm:h-12"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="phone" className="block text-xs font-medium text-text-primary sm:text-[13px]">
                Phone (optional)
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="h-11 w-full rounded-small border border-border bg-bg-card px-4 text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-accent/30 sm:h-12"
              />
            </div>
          </div>
        )}

        {/* Error */}
        {hasDateConflict && (
          <div className="rounded-small border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            Your selected dates include unavailable dates. Please choose a different range.
          </div>
        )}
        {error && (
          <div className="rounded-small border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit — desktop only (inside form column) */}
        <div className="hidden lg:block">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || isPending}
            aria-busy={isPending}
            className="inline-flex items-center gap-2 rounded-button bg-accent px-8 h-12 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-40 transition"
          >
            <Lock size={16} />
            {isPending ? 'Confirming...' : 'Confirm & pay'}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="w-full lg:order-2 lg:w-[380px] lg:shrink-0">
        <div className="lg:sticky lg:top-6">
          <div className="rounded-card border border-border bg-bg-card p-4 space-y-3">
            <div className="flex items-center gap-3 lg:flex-col lg:items-stretch lg:gap-0">
              {stay.images[0] && (
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-small lg:h-[180px] lg:w-full">
                  <Image
                    src={stay.images[0]}
                    alt={stay.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="min-w-0 lg:mt-4">
                <h3 className="font-heading text-sm font-medium text-text-primary lg:text-lg">
                  {stay.title}
                </h3>
                <p className="text-xs text-text-secondary">{stay.location}</p>
              </div>
            </div>

            <div className="h-px bg-bg-muted" />

            <PriceBreakdown
              pricePerNight={stay.price_per_night}
              nights={nights || 1}
              cleaningFee={stay.cleaning_fee}
              serviceFee={stay.service_fee}
            />

            <div className="flex items-start gap-2">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-accent" />
              <p className="text-xs text-text-secondary">
                Secure checkout · No payment until confirmation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit — mobile only (below summary card) */}
      <div className="w-full lg:hidden">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || isPending}
          aria-busy={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-button bg-accent h-12 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-40 transition"
        >
          <Lock size={16} />
          {isPending ? 'Confirming...' : 'Confirm & pay'}
        </button>
      </div>
    </div>
  );
}
