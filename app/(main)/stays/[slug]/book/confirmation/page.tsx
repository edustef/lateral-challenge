import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils/price';
import Link from 'next/link';
import Image from 'next/image';
import { Check, CalendarCheck } from 'lucide-react';

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function ConfirmationPage({ searchParams }: Props) {
  const { id } = await searchParams;

  if (!id) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <p className="text-text-secondary">Booking not found.</p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm text-accent hover:underline"
        >
          Back to home
        </Link>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: booking } = await supabase
    .from('bookings')
    .select('*, stays(title, location, images, slug)')
    .eq('id', id)
    .single();

  if (!booking) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <p className="text-text-secondary">Booking not found.</p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm text-accent hover:underline"
        >
          Back to home
        </Link>
      </div>
    );
  }

  const stay = booking.stays as {
    title: string;
    location: string;
    images: string[];
    slug: string;
  } | null;

  const formatDate = (dateStr: string) =>
    new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-[640px] flex-col items-center gap-10">
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-accent-tint">
          <Check size={32} className="text-accent" />
        </div>

        <div className="space-y-2 text-center">
          <h1 className="font-heading text-[32px] font-medium tracking-tight text-text-primary">
            Booking confirmed!
          </h1>
          <p className="text-[15px] leading-relaxed text-text-body">
            Your adventure at {stay?.title ?? 'your stay'} is all set. We&apos;ve sent the details to{' '}
            {booking.contact_email}.
          </p>
        </div>

        {stay && (
          <div className="flex w-full flex-col overflow-hidden rounded-card border border-border bg-bg-card sm:flex-row">
            {stay.images[0] && (
              <div className="relative h-40 w-full shrink-0 sm:h-auto sm:w-[220px]">
                <Image
                  src={stay.images[0]}
                  alt={stay.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex-1 space-y-4 p-5 sm:p-6">
              <div className="space-y-1">
                <h2 className="font-heading text-base font-medium text-text-primary sm:text-lg">
                  {stay.title}
                </h2>
                <p className="text-[13px] text-text-secondary">{stay.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <p className="text-[11px] font-medium text-text-secondary">Check-in</p>
                  <p className="text-[13px] font-medium text-text-primary">
                    {formatDate(booking.check_in)}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-medium text-text-secondary">Check-out</p>
                  <p className="text-[13px] font-medium text-text-primary">
                    {formatDate(booking.check_out)}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-medium text-text-secondary">Guests</p>
                  <p className="text-[13px] font-medium text-text-primary">
                    {booking.guests} adult{booking.guests !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-medium text-text-secondary">Total paid</p>
                  <p className="text-[13px] font-medium text-text-primary">
                    {formatPrice(booking.total_price)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/profile"
            className="inline-flex w-full items-center justify-center gap-2 rounded-button bg-accent px-7 h-12 text-sm font-medium text-white hover:bg-accent/90 transition sm:w-auto"
          >
            <CalendarCheck size={16} />
            View my bookings
          </Link>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-button border border-border bg-bg-card px-7 h-12 text-sm font-medium text-text-primary hover:bg-bg-muted transition sm:w-auto"
          >
            Browse more stays
          </Link>
        </div>
      </div>
    </div>
  );
}
