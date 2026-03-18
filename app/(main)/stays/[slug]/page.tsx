import { notFound } from 'next/navigation';
import { getStayBySlug, getReviewsForStay } from '@/lib/actions/stays';
import { getUnavailableDates } from '@/lib/actions/availability';
import { getClaims } from '@/lib/supabase/server';
import { PhotoGallery } from '@/components/stays/photo-gallery';
import { StayInfo } from '@/components/stays/stay-info';
import { ReviewsList } from '@/components/stays/reviews-list';
import { ReviewForm } from '@/components/stays/review-form';
import { BookingSidebar } from '@/components/booking/booking-sidebar';
import { BackButton } from '@/components/back-button';

type Props = { params: Promise<{ slug: string }> };

export default async function StayDetailPage({ params }: Props) {
  const { slug } = await params;
  const claimsPromise = getClaims();
  const stay = await getStayBySlug(slug);
  if (!stay) notFound();

  const [reviews, user, unavailableDates] = await Promise.all([
    getReviewsForStay(stay.id),
    claimsPromise,
    getUnavailableDates(stay.id),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <BackButton
        label="Back to results"
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition"
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left column */}
        <div>
          <PhotoGallery images={stay.images} />
          <StayInfo stay={stay} />
          <ReviewsList
            reviews={reviews}
            reviewForm={
              <ReviewForm stayId={stay.id} userEmail={user?.email ?? null} />
            }
          />
        </div>

        {/* Right column - sidebar */}
        <div>
          <BookingSidebar
            stay={{
              id: stay.id,
              slug: stay.slug,
              price_per_night: stay.price_per_night,
              cleaning_fee: stay.cleaning_fee,
              service_fee: stay.service_fee,
              max_guests: stay.max_guests,
              travel_type: stay.travel_type,
            }}
            disabledDates={unavailableDates}
          />
        </div>
      </div>
    </div>
  );
}
