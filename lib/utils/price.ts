/**
 * Price calculation utilities.
 * All prices are in cents (integers).
 */

export function calculateNights(checkIn: Date, checkOut: Date): number {
  const diffMs = checkOut.getTime() - checkIn.getTime();
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function calculateTotal({
  pricePerNight,
  nights,
  cleaningFee,
  serviceFee,
}: {
  pricePerNight: number;
  nights: number;
  cleaningFee: number;
  serviceFee: number;
}): number {
  return pricePerNight * nights + cleaningFee + serviceFee;
}

export function formatPrice(cents: number): string {
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0 });
}
