import { redirect } from 'next/navigation';
import { createClient, getClaims } from '@/lib/supabase/server';
import { BookingCard, BookingCardCompact } from '@/components/booking-card';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage() {
  const user = await getClaims();

  if (!user) {
    redirect('/auth/login?redirect=/profile');
  }

  const supabase = await createClient();
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, stays(title, location, images, slug, price_per_night)')
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
      price_per_night: number;
    },
  }));

  const initials = user.email
    ? user.email.slice(0, 2).toUpperCase()
    : '??';

  const upcomingBookings = formattedBookings.filter(
    (b) => new Date(b.check_in) >= new Date() && b.status !== 'cancelled'
  );
  const pastBookings = formattedBookings.filter(
    (b) => new Date(b.check_in) < new Date() && b.status !== 'cancelled'
  );

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      {/* Profile Header */}
      <div className="border-b border-[#F0EDE8] bg-white px-4 py-10 sm:px-6 lg:px-20">
        <div className="flex items-start gap-8">
          {/* Avatar */}
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-accent">
            <span className="text-2xl font-semibold text-white">{initials}</span>
          </div>

          {/* Info */}
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex items-center justify-between">
              <h1 className="font-heading text-[26px] font-semibold tracking-tight text-text-primary">
                {user.email?.split('@')[0] ?? 'User'}
              </h1>
              <button
                type="button"
                className="hidden rounded-full border border-[#E8E4DF] bg-[#F5F3EF] px-6 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-[#ece9e3] sm:block active:scale-[0.98]"
              >
                Edit Profile
              </button>
            </div>
            <div className="flex items-center gap-6 text-sm text-text-muted">
              <span>{user.email}</span>
              <span className="text-text-muted/40">·</span>
              <span>Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
            <p className="hidden text-[15px] leading-relaxed text-text-body sm:block">
              Avid traveler and unique stays enthusiast. Always searching for hidden gems and off-the-beaten-path experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="px-4 py-6 sm:px-6 lg:px-20">
        {/* Tabs */}
        <div className="flex border-b border-[#E8E4DF]">
          <div className="flex items-center gap-2 border-b-2 border-[#FF8400] px-5 py-3">
            <span className="text-sm font-semibold text-text-primary">Upcoming</span>
            {upcomingBookings.length > 0 && (
              <span className="flex h-[22px] items-center rounded-full bg-[#FF8400] px-2 text-[11px] font-semibold text-white">
                {upcomingBookings.length}
              </span>
            )}
          </div>
          <div className="px-5 py-3">
            <span className="text-sm font-medium text-text-muted">Past</span>
          </div>
          <div className="px-5 py-3">
            <span className="text-sm font-medium text-text-muted">Cancelled</span>
          </div>
        </div>

        {/* Booking Cards */}
        <div className="mt-6">
          {formattedBookings.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-[20px] border border-border-subtle bg-bg-card py-16">
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
            <>
              {/* Desktop cards */}
              <div className="hidden flex-col gap-5 md:flex">
                {formattedBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
              {/* Mobile cards */}
              <div className="flex flex-col gap-3 md:hidden">
                {formattedBookings.map((booking) => (
                  <BookingCardCompact key={booking.id} booking={booking} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
