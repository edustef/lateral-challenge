'use server';

import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/supabase/types';

export type StayCard = Tables<'stays'>;

export async function getStays(filters: {
  type?: string | null;
  vibe?: string | null;
  search?: string | null;
  sort?: string | null;
}): Promise<StayCard[]> {
  const supabase = await createClient();
  let query = supabase.from('stays').select('*');

  if (filters.type) query = query.eq('travel_type', filters.type);
  if (filters.vibe) query = query.eq('vibe', filters.vibe);
  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,location.ilike.%${filters.search}%`
    );
  }
  if (filters.sort === 'price-asc') {
    query = query.order('price_per_night', { ascending: true });
  } else if (filters.sort === 'price-desc') {
    query = query.order('price_per_night', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
