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
