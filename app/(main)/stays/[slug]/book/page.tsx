import { notFound } from 'next/navigation';
import { getStayBySlug } from '@/lib/actions/stays';
import { CheckoutForm } from '@/components/checkout-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type Props = { params: Promise<{ slug: string }> };

export default async function BookPage({ params }: Props) {
  const { slug } = await params;
  const stay = await getStayBySlug(slug);
  if (!stay) notFound();

  return (
    <div className="py-6">
      <Link
        href={`/stays/${slug}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition"
      >
        <ArrowLeft size={16} /> Back to {stay.title}
      </Link>

      <h1 className="font-heading text-2xl font-semibold text-text-primary mb-6">
        Book {stay.title}
      </h1>

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
        }}
      />
    </div>
  );
}
