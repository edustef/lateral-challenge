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

export async function getStayBySlug(slug: string): Promise<Tables<'stays'> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('stays')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) return null;
  return data;
}

export type ReviewWithAuthor = Tables<'reviews'> & {
  profiles: Pick<Tables<'profiles'>, 'full_name' | 'avatar_url'> | null;
};

export async function getReviewsForStay(stayId: string): Promise<ReviewWithAuthor[]> {
  const supabase = await createClient();

  // Fetch reviews
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('stay_id', stayId)
    .order('created_at', { ascending: false });
  if (error || !reviews) return [];

  // Fetch profiles for review authors
  const userIds = [...new Set(reviews.map((r) => r.user_id))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .in('id', userIds);

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.id, { full_name: p.full_name, avatar_url: p.avatar_url }])
  );

  return reviews.map((r) => ({
    ...r,
    profiles: profileMap.get(r.user_id) ?? null,
  }));
}
