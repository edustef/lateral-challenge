import { describe, it, expect } from 'vitest';
import { calculateNights, calculateTotal, formatPrice } from '../price';

describe('calculateNights', () => {
  it('returns 1 for a single-night stay', () => {
    const checkIn = new Date('2025-06-01');
    const checkOut = new Date('2025-06-02');
    expect(calculateNights(checkIn, checkOut)).toBe(1);
  });

  it('returns correct count for multi-night stay', () => {
    const checkIn = new Date('2025-06-01');
    const checkOut = new Date('2025-06-05');
    expect(calculateNights(checkIn, checkOut)).toBe(4);
  });

  it('returns 1 for same-day (minimum 1 night)', () => {
    const d = new Date('2025-06-01');
    expect(calculateNights(d, d)).toBe(1);
  });

  it('rounds up partial days', () => {
    const checkIn = new Date('2025-06-01T10:00:00');
    const checkOut = new Date('2025-06-02T08:00:00'); // 22 hours
    expect(calculateNights(checkIn, checkOut)).toBe(1);
  });
});

describe('calculateTotal', () => {
  it('calculates total with all fees', () => {
    // $150/night * 3 nights + $50 cleaning + $30 service = $530
    // In cents: 15000 * 3 + 5000 + 3000 = 53000
    expect(
      calculateTotal({
        pricePerNight: 15000,
        nights: 3,
        cleaningFee: 5000,
        serviceFee: 3000,
      }),
    ).toBe(53000);
  });

  it('handles zero fees', () => {
    expect(
      calculateTotal({
        pricePerNight: 10000,
        nights: 2,
        cleaningFee: 0,
        serviceFee: 0,
      }),
    ).toBe(20000);
  });

  it('handles single night', () => {
    expect(
      calculateTotal({
        pricePerNight: 25000,
        nights: 1,
        cleaningFee: 7500,
        serviceFee: 2500,
      }),
    ).toBe(35000);
  });
});

describe('formatPrice', () => {
  it('formats whole dollars', () => {
    expect(formatPrice(15000)).toBe('$150');
  });

  it('formats large amounts with commas', () => {
    expect(formatPrice(123400)).toBe('$1,234');
  });

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('$0');
  });

  it('formats cents as rounded dollars', () => {
    // 9999 cents = $99.99
    expect(formatPrice(9999)).toBe('$99.99');
  });
});
