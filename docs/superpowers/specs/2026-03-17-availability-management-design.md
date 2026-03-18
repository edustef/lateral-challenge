# Stay Availability Management — Design Spec

## Goal

Show unavailable dates (booked + owner-blocked) as greyed-out/disabled in the calendar date picker on the stay detail page, so guests know which dates are taken before attempting to book.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Scope of unavailable | Booked + owner-blocked dates | Covers real-world cases beyond just bookings |
| Where visible | Stay detail page only | Checkout already receives pre-selected dates |
| Owner management UI | None (seed/Supabase dashboard) | No owner model exists yet; build UI later |
| Date appearance | Greyed out / disabled, no reason shown | Guests don't need to know why a date is taken |
| Data fetching | Eager — single fetch on page load (future dates only) | Booking ranges are tiny data; one query is fine |
| Architecture | Separate `blocked_dates` table, UNION query | Clean separation, no changes to booking logic |

## Database Layer

### New table: `blocked_dates`

```sql
CREATE TABLE blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stay_id UUID NOT NULL REFERENCES stays(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL DEFAULT 'manual_block',
  created_at TIMESTAMPTZ DEFAULT now(),
  CHECK (end_date > start_date),
  EXCLUDE USING gist (stay_id WITH =, daterange(start_date, end_date) WITH &&)
);
```

- RLS enabled, public SELECT policy (anyone can view blocked dates).
- No INSERT/UPDATE/DELETE policies — managed via Supabase dashboard or seed data for now.
- Exclusion constraint prevents overlapping blocked ranges for the same stay.

### Database function: `get_unavailable_dates`

A `SECURITY DEFINER` function that UNIONs booking date ranges and blocked date ranges. This avoids exposing full booking details while making date ranges publicly queryable. Filters to future dates only.

```sql
CREATE OR REPLACE FUNCTION get_unavailable_dates(p_stay_id UUID)
RETURNS TABLE(start_date DATE, end_date DATE) AS $$
  SELECT check_in, check_out FROM bookings
    WHERE stay_id = p_stay_id AND status = 'confirmed' AND check_out >= CURRENT_DATE
  UNION ALL
  SELECT start_date, end_date FROM blocked_dates
    WHERE stay_id = p_stay_id AND end_date >= CURRENT_DATE
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

## Server Action

### `lib/actions/availability.ts`

```typescript
'use server';

export async function getUnavailableDates(stayId: string): Promise<{ from: string; to: string }[]>
```

- Calls `supabase.rpc('get_unavailable_dates', { p_stay_id: stayId })`
- Returns array of `{ from, to }` ISO date strings (`YYYY-MM-DD`)
- No auth required (public data)
- Uses `'use server'` directive for consistency with other actions in `lib/actions/`

## Component Changes

### `DatePicker` (`components/date-picker.tsx`)

- New prop: `disabledDates?: { from: string; to: string }[]`
- Converts each range to a `react-day-picker` `Matcher`: `{ from: new Date(range.from + 'T00:00:00'), to: new Date(range.to + 'T00:00:00') }`
- Uses `'T00:00:00'` suffix to avoid timezone-related off-by-one errors when parsing `YYYY-MM-DD` strings
- Passes as array to `Calendar`'s `disabled` prop alongside `{ before: getTomorrow() }`

### `BookingSidebar` (`components/booking-sidebar.tsx`)

- New prop: `disabledDates?: { from: string; to: string }[]`
- Passes through to `DatePicker`
- **Default dates**: When `disabledDates` overlap with the default check-in/check-out range (tomorrow to tomorrow+5), clear the defaults to `undefined` so the user must pick valid dates

### `app/(main)/stays/[slug]/page.tsx`

- Adds `getUnavailableDates(stay.id)` call in `Promise.all`
- Passes result as `disabledDates` to `BookingSidebar`

## Data Flow

```
StayDetailPage (Server Component)
  ├── getStayBySlug(slug)
  ├── getReviewsForStay(stay.id)
  ├── getUnavailableDates(stay.id)  ← NEW
  └── <BookingSidebar disabledDates={unavailableDates} />
        └── <DatePicker disabledDates={disabledDates} />
              └── <Calendar disabled={[{ before: tomorrow }, ...dateRangeMatchers]} />
```

## Edge Cases

- **No unavailable dates**: Empty array, calendar works as before.
- **User selects range spanning an unavailable gap**: `react-day-picker` v9 resets the selection when the end date is past a disabled range, forcing the user to pick a range within available dates.
- **Concurrent booking**: DB exclusion constraint on `bookings` is the final safety net. Calendar availability is optimistic.
- **Cancelled bookings**: Filtered out by `status = 'confirmed'` in the DB function.
- **Default dates overlap unavailable**: BookingSidebar clears defaults to undefined, showing "Select dates" placeholder.

## Known Limitations

- **Booking exclusion constraint does not filter by status**: The existing `EXCLUDE USING gist` on `bookings` applies to all rows including cancelled bookings. A cancelled booking's date range still blocks new bookings at the DB level. This predates this feature and is out of scope — tracked for a future fix (replace with partial exclusion constraint on `status = 'confirmed'`).
- **No cross-table overlap guard**: Nothing prevents a blocked date range from overlapping an existing confirmed booking. Acceptable since blocked dates are managed manually via dashboard for now.

## Files to Create/Modify

| File | Action |
|------|--------|
| `supabase/migrations/00003_add_blocked_dates.sql` | Create |
| `lib/actions/availability.ts` | Create |
| `components/date-picker.tsx` | Modify — add `disabledDates` prop |
| `components/booking-sidebar.tsx` | Modify — accept and pass `disabledDates` |
| `app/(main)/stays/[slug]/page.tsx` | Modify — fetch and pass unavailable dates |
| `supabase/seed.sql` | Modify — add sample blocked dates |
| `lib/supabase/types.ts` | Regenerate after migration |
