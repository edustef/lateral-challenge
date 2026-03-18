import { describe, it, expect, vi, afterEach } from 'vitest';
import { isValidDateRange, isDateInFuture, formatDateRange } from '../date';

describe('isValidDateRange', () => {
  it('returns true when checkOut is after checkIn', () => {
    expect(
      isValidDateRange(new Date('2025-06-01'), new Date('2025-06-05')),
    ).toBe(true);
  });

  it('returns false when dates are the same', () => {
    const d = new Date('2025-06-01');
    expect(isValidDateRange(d, d)).toBe(false);
  });

  it('returns false when checkOut is before checkIn', () => {
    expect(
      isValidDateRange(new Date('2025-06-05'), new Date('2025-06-01')),
    ).toBe(false);
  });
});

describe('isDateInFuture', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true for tomorrow', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15T12:00:00'));
    expect(isDateInFuture(new Date('2025-06-16'))).toBe(true);
  });

  it('returns false for yesterday', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15T12:00:00'));
    expect(isDateInFuture(new Date('2025-06-14'))).toBe(false);
  });

  it('returns true for today', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15T12:00:00'));
    expect(isDateInFuture(new Date('2025-06-15'))).toBe(true);
  });
});

describe('formatDateRange', () => {
  it('formats a date range as "Mon DD - Mon DD"', () => {
    const result = formatDateRange(
      new Date('2025-06-01'),
      new Date('2025-06-05'),
    );
    expect(result).toBe('Jun 1 - Jun 5');
  });

  it('handles cross-month ranges', () => {
    const result = formatDateRange(
      new Date('2025-06-28'),
      new Date('2025-07-03'),
    );
    expect(result).toBe('Jun 28 - Jul 3');
  });
});
