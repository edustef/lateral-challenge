'use server';

import { createClient } from '@/lib/supabase/server';

export async function getUnavailableDates(
  stayId: string
): Promise<{ from: string; to: string }[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_unavailable_dates', {
    p_stay_id: stayId,
  });

  if (error) {
    console.error('[action] getUnavailableDates error', error.message);
    return [];
  }

  return (data ?? []).map((row: { start_date: string; end_date: string }) => ({
    from: row.start_date,
    to: row.end_date,
  }));
}
