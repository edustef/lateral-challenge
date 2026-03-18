'use client';

import { useState, useTransition, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';
import { PriceBreakdown } from '@/components/price-breakdown';
import { calculateNights, calculateTotal, formatPrice } from '@/lib/utils/price';
import { createBooking } from '@/lib/actions/bookings';

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
  };
}

const STEPS = ['Dates', 'Guests', 'Contact', 'Review'] as const;

export function CheckoutForm({ stay }: CheckoutFormProps) {
  const [step, setStep] = useState(1);
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(1);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const checkIn = range?.from;
  const checkOut = range?.to;

  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

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

  const canAdvance = () => {
    switch (step) {
      case 1:
        return !!checkIn && !!checkOut;
      case 2:
        return guests >= 1 && guests <= stay.max_guests;
      case 3:
        return contactName.trim() !== '' && contactEmail.trim() !== '';
      default:
        return true;
    }
  };

  function handleSubmit() {
    if (!checkIn || !checkOut) return;

    const formData = new FormData();
    formData.set('stayId', stay.id);
    formData.set('slug', stay.slug);
    formData.set('checkIn', checkIn.toISOString().split('T')[0]);
    formData.set('checkOut', checkOut.toISOString().split('T')[0]);
    formData.set('guests', String(guests));
    formData.set('contactName', contactName);
    formData.set('contactEmail', contactEmail);
    formData.set('contactPhone', contactPhone);
    formData.set('totalPrice', String(total));

    startTransition(async () => {
      const result = await createBooking(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-between">
        {STEPS.map((label, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === step;
          const isCompleted = stepNum < step;
          return (
            <div key={label} className="flex flex-1 items-center" role="group" aria-label={`Step ${stepNum}: ${label}`}>
              <div className="flex flex-col items-center gap-1">
                <div
                  aria-label={`Checkout step ${stepNum} of 4: ${label}`}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition ${
                    isActive
                      ? 'bg-accent text-white'
                      : isCompleted
                        ? 'bg-accent/20 text-accent'
                        : 'bg-bg-muted text-text-secondary'
                  }`}
                >
                  {isCompleted ? '✓' : stepNum}
                </div>
                <span className="text-xs text-text-secondary">{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-px flex-1 ${
                    isCompleted ? 'bg-accent/40' : 'bg-border'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="rounded-card border border-border-subtle bg-bg-card p-6">
        {/* Step 1: Dates */}
        {step === 1 && (
          <div>
            <h2 className="font-heading text-lg font-semibold text-text-primary mb-4">
              Select your dates
            </h2>
            <div className="flex justify-center">
              <Calendar
                mode="range"
                selected={range}
                onSelect={setRange}
                disabled={{ before: tomorrow }}
                numberOfMonths={1}
              />
            </div>
            {checkIn && checkOut && (
              <p className="mt-4 text-center text-sm text-text-secondary">
                {nights} night{nights !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>
        )}

        {/* Step 2: Guests */}
        {step === 2 && (
          <div>
            <h2 className="font-heading text-lg font-semibold text-text-primary mb-4">
              Number of guests
            </h2>
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                disabled={guests <= 1}
                aria-label="Decrease guests"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-lg font-semibold text-text-primary hover:bg-bg-muted disabled:opacity-40 transition"
              >
                -
              </button>
              <span className="min-w-[3rem] text-center text-2xl font-semibold text-text-primary" aria-live="polite" aria-label={`${guests} guest${guests !== 1 ? 's' : ''}`}>
                {guests}
              </span>
              <button
                type="button"
                onClick={() => setGuests((g) => Math.min(stay.max_guests, g + 1))}
                disabled={guests >= stay.max_guests}
                aria-label="Increase guests"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-lg font-semibold text-text-primary hover:bg-bg-muted disabled:opacity-40 transition"
              >
                +
              </button>
            </div>
            <p className="mt-3 text-center text-sm text-text-secondary">
              Maximum {stay.max_guests} guest{stay.max_guests !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Step 3: Contact Info */}
        {step === 3 && (
          <div>
            <h2 className="font-heading text-lg font-semibold text-text-primary mb-4">
              Contact information
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="mb-1 block text-sm text-text-secondary">
                  Full name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full rounded-small border border-border bg-bg-card px-3 py-2 text-sm text-text-body focus:ring-2 focus:ring-accent/30 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1 block text-sm text-text-secondary">
                  Email *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-small border border-border bg-bg-card px-3 py-2 text-sm text-text-body focus:ring-2 focus:ring-accent/30 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className="mb-1 block text-sm text-text-secondary">
                  Phone (optional)
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full rounded-small border border-border bg-bg-card px-3 py-2 text-sm text-text-body focus:ring-2 focus:ring-accent/30 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Confirm */}
        {step === 4 && (
          <div>
            <h2 className="font-heading text-lg font-semibold text-text-primary mb-4">
              Review your booking
            </h2>
            <div className="space-y-4">
              <div className="rounded-small border border-border p-4">
                <h3 className="font-semibold text-text-primary">{stay.title}</h3>
                <p className="text-sm text-text-secondary">{stay.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-secondary">Check-in</span>
                  <p className="font-medium text-text-primary">
                    {checkIn?.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-text-secondary">Check-out</span>
                  <p className="font-medium text-text-primary">
                    {checkOut?.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="text-sm">
                <span className="text-text-secondary">Guests</span>
                <p className="font-medium text-text-primary">
                  {guests} guest{guests !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="text-sm">
                <span className="text-text-secondary">Contact</span>
                <p className="font-medium text-text-primary">{contactName}</p>
                <p className="text-text-body">{contactEmail}</p>
                {contactPhone && <p className="text-text-body">{contactPhone}</p>}
              </div>

              <hr className="border-border" />

              <PriceBreakdown
                pricePerNight={stay.price_per_night}
                nights={nights}
                cleaningFee={stay.cleaning_fee}
                serviceFee={stay.service_fee}
              />
            </div>

            {error && (
              <div className="mt-4 rounded-small border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => { setStep((s) => s - 1); setError(null); }}
              className="rounded-button border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-muted transition"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance()}
              className="rounded-button bg-accent px-6 py-2 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-40 transition"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              aria-busy={isPending}
              className="rounded-button bg-accent px-6 py-2 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-60 transition"
            >
              {isPending ? 'Confirming...' : 'Confirm & Pay'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
