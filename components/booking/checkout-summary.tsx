import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import { PriceBreakdown } from '@/components/booking/price-breakdown';

interface CheckoutSummaryProps {
  stay: {
    title: string;
    location: string;
    images: string[];
    price_per_night: number;
    cleaning_fee: number;
    service_fee: number;
  };
  nights: number;
}

export function CheckoutSummary({ stay, nights }: CheckoutSummaryProps) {
  return (
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
  );
}
