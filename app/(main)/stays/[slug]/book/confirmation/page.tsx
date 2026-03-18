import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils/price';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function ConfirmationPage({ searchParams }: Props) {
  const { id } = await searchParams;

  if (!id) {
    return (
      <div className="py-12 text-center">
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
      <div className="py-12 text-center">
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

  const stay = booking.stays as { title: string; location: string; images: string[]; slug: string } | null;

  return (
    <div className="mx-auto max-w-lg py-12">
      <div className="rounded-card border border-border-subtle bg-bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
        <h1 className="font-heading mt-4 text-2xl font-semibold text-text-primary">
          Booking confirmed!
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Your reservation has been created.
        </p>

        <div className="mt-8 space-y-4 text-left text-sm">
          {stay && (
            <div className="rounded-small border border-border p-4">
              <h3 className="font-semibold text-text-primary">{stay.title}</h3>
              <p className="text-text-secondary">{stay.location}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-text-secondary">Check-in</span>
              <p className="font-medium text-text-primary">
                {new Date(booking.check_in + 'T12:00:00').toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <span className="text-text-secondary">Check-out</span>
              <p className="font-medium text-text-primary">
                {new Date(booking.check_out + 'T12:00:00').toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div>
            <span className="text-text-secondary">Guests</span>
            <p className="font-medium text-text-primary">
              {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
            </p>
          </div>

          <hr className="border-border" />

          <div className="flex justify-between font-semibold">
            <span className="text-text-primary">Total</span>
            <span className="font-mono text-text-primary">
              {formatPrice(booking.total_price)}
            </span>
          </div>

          <div>
            <span className="text-text-secondary">Booking ID</span>
            <p className="font-mono text-xs text-text-body">
              {booking.id.slice(0, 8)}
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block rounded-button bg-accent px-6 py-2 text-sm font-semibold text-white hover:bg-accent/90 transition"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
