import { format } from 'date-fns';

/**
 * Date validation and formatting utilities.
 * All functions are pure — no server or DB dependencies.
 */

/** Returns true if checkOut is strictly after checkIn. */
export function isValidDateRange(checkIn: Date, checkOut: Date): boolean {
  return checkOut.getTime() > checkIn.getTime();
}

/** Returns true if the date is today or in the future (date-only comparison). */
export function isDateInFuture(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return target.getTime() >= today.getTime();
}

/** Formats a date range as "Mon DD - Mon DD" for display. */
export function formatDateRange(checkIn: Date, checkOut: Date): string {
  return `${format(checkIn, 'MMM d')} - ${format(checkOut, 'MMM d')}`;
}

/**
 * Returns true if [checkIn, checkOut) overlaps any disabled date range.
 * Disabled range boundaries use midnight (T00:00:00) for date-only comparison.
 */
export function rangeOverlapsDisabled(
  checkIn: Date,
  checkOut: Date,
  disabledDates: { from: string; to: string }[],
): boolean {
  return disabledDates.some((range) => {
    const from = new Date(range.from + 'T00:00:00');
    const to = new Date(range.to + 'T00:00:00');
    return checkIn < to && checkOut > from;
  });
}

/**
 * Parses a YYYY-MM-DD string into a Date anchored at noon (T12:00:00)
 * to avoid timezone edge cases where midnight rolls to the previous day.
 * Returns undefined if input is missing or invalid.
 */
export function parseDate(str?: string): Date | undefined {
  if (!str) return undefined;
  const d = new Date(str + 'T12:00:00');
  return isNaN(d.getTime()) ? undefined : d;
}
