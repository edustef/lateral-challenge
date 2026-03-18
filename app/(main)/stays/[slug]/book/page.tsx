import { notFound } from 'next/navigation';
import { getStayBySlug } from '@/lib/actions/stays';
import { getUnavailableDates } from '@/lib/actions/availability';
import { getClaims } from '@/lib/supabase/server';
import { CheckoutForm } from '@/components/checkout-form';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string }>;
};

export default async function BookPage({ params, searchParams }: Props) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const stay = await getStayBySlug(slug);
  if (!stay) notFound();

  const [user, unavailableDates] = await Promise.all([
    getClaims(),
    getUnavailableDates(stay.id),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <CheckoutForm
        stay={{
          id: stay.id,
          slug: stay.slug,
          title: stay.title,
          price_per_night: stay.price_per_night,
          cleaning_fee: stay.cleaning_fee,
          service_fee: stay.service_fee,
          max_guests: stay.max_guests,
          images: stay.images,
          location: stay.location,
          travel_type: stay.travel_type,
        }}
        prefill={{
          checkIn: sp.checkIn,
          checkOut: sp.checkOut,
          guests: sp.guests ? Number(sp.guests) : undefined,
        }}
        user={
          user
            ? {
                name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? '',
                email: user.email ?? '',
              }
            : undefined
        }
        disabledDates={unavailableDates}
      />
    </div>
  );
}
