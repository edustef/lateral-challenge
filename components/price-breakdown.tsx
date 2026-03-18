function formatPrice(cents: number): string {
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0 });
}

interface PriceBreakdownProps {
  pricePerNight: number;
  nights: number;
  cleaningFee: number;
  serviceFee: number;
}

export function PriceBreakdown({
  pricePerNight,
  nights,
  cleaningFee,
  serviceFee,
}: PriceBreakdownProps) {
  const subtotal = pricePerNight * nights;
  const total = subtotal + cleaningFee + serviceFee;

  return (
    <div className="space-y-3 text-sm">
      <div className="flex justify-between">
        <span className="text-text-body">
          {formatPrice(pricePerNight)} x {nights} night{nights !== 1 ? 's' : ''}
        </span>
        <span className="font-mono text-text-primary">{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-text-body">Cleaning fee</span>
        <span className="font-mono text-text-primary">{formatPrice(cleaningFee)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-text-body">Service fee</span>
        <span className="font-mono text-text-primary">{formatPrice(serviceFee)}</span>
      </div>
      <hr className="border-border" />
      <div className="flex justify-between font-semibold">
        <span className="text-text-primary">Total</span>
        <span className="font-mono text-text-primary">{formatPrice(total)}</span>
      </div>
    </div>
  );
}
