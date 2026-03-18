import { notFound } from 'next/navigation';
import { getStayBySlug, getReviewsForStay } from '@/lib/actions/stays';
import { PhotoGallery } from '@/components/photo-gallery';
import { StayInfo } from '@/components/stay-info';
import { ReviewsList } from '@/components/reviews-list';
import { BookingSidebar } from '@/components/booking-sidebar';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type Props = { params: Promise<{ slug: string }> };

export default async function StayDetailPage({ params }: Props) {
  const { slug } = await params;
  const stay = await getStayBySlug(slug);
  if (!stay) notFound();

  const reviews = await getReviewsForStay(stay.id);

  return (
    <div className="py-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition"
      >
        <ArrowLeft size={16} /> Back to results
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left column */}
        <div>
          <PhotoGallery images={stay.images} />
          <StayInfo stay={stay} />
          <ReviewsList reviews={reviews} />
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
            }}
          />
        </div>
      </div>
    </div>
  );
}
