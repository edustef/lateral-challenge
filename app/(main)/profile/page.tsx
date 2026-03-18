import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BookingCard } from '@/components/booking-card';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirect=/profile');
  }

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, stays(title, location, images, slug)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const formattedBookings = (bookings ?? []).map((b) => ({
    id: b.id,
    check_in: b.check_in,
    check_out: b.check_out,
    guests: b.guests,
    total_price: b.total_price,
    status: b.status,
    stay: b.stays as unknown as {
      title: string;
      location: string;
      images: string[];
      slug: string;
    },
  }));

  return (
    <div className="py-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-text-primary">
          My Bookings
        </h1>
        <p className="mt-1 text-sm text-text-secondary">{user.email}</p>
      </div>

      {formattedBookings.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-card border border-border-subtle bg-bg-card py-12">
          <MapPin size={32} className="text-text-muted" />
          <p className="text-text-secondary">No bookings yet</p>
          <Link
            href="/"
            className="text-sm font-medium text-accent hover:underline"
          >
            Browse stays
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {formattedBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}
