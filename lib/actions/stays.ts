'use server';

import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/supabase/types';

export type StayCard = Tables<'stays'> & {
  avg_rating: number | null;
  review_count: number;
};

export async function getStays(filters: {
  type?: string | null;
  vibe?: string | null;
  search?: string | null;
  sort?: string | null;
}): Promise<StayCard[]> {
  const start = performance.now();
  const actionName = 'getStays';
  console.log(`[action] ${actionName} start`, { filters });
  try {
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
    } else if (filters.sort !== 'rating-desc') {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;
    const stays = data ?? [];

    // Fetch average ratings for all stays
    const stayIds = stays.map((s) => s.id);
    const { data: reviews } = await supabase
      .from('reviews')
      .select('stay_id, rating')
      .in('stay_id', stayIds)
      .eq('is_approved', true);

    const ratingMap = new Map<string, { sum: number; count: number }>();
    for (const r of reviews ?? []) {
      const entry = ratingMap.get(r.stay_id) ?? { sum: 0, count: 0 };
      entry.sum += r.rating;
      entry.count += 1;
      ratingMap.set(r.stay_id, entry);
    }

    let result: StayCard[] = stays.map((s) => {
      const entry = ratingMap.get(s.id);
      return {
        ...s,
        avg_rating: entry ? entry.sum / entry.count : null,
        review_count: entry?.count ?? 0,
      };
    });

    if (filters.sort === 'rating-desc') {
      result.sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0));
    }

    console.log(`[action] ${actionName} ok`, { duration: Math.round(performance.now() - start) + 'ms', count: result.length });
    return result;
  } catch (err) {
    console.error(`[action] ${actionName} error`, { duration: Math.round(performance.now() - start) + 'ms', error: err });
    throw err;
  }
}

export type StayPreview = Pick<Tables<'stays'>, 'id' | 'title' | 'location' | 'price_per_night' | 'slug' | 'images'>;

export async function searchStaysPreview(term: string): Promise<StayPreview[]> {
  if (!term || term.length < 2) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('stays')
    .select('id, title, location, price_per_night, slug, images')
    .or(`title.ilike.%${term}%,location.ilike.%${term}%`)
    .limit(5);
  if (error) return [];
  return data ?? [];
}

export async function getStayBySlug(slug: string): Promise<Tables<'stays'> | null> {
  const start = performance.now();
  const actionName = 'getStayBySlug';
  console.log(`[action] ${actionName} start`, { slug });
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('stays')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) {
      console.log(`[action] ${actionName} ok`, { duration: Math.round(performance.now() - start) + 'ms', found: false });
      return null;
    }
    console.log(`[action] ${actionName} ok`, { duration: Math.round(performance.now() - start) + 'ms', found: true });
    return data;
  } catch (err) {
    console.error(`[action] ${actionName} error`, { duration: Math.round(performance.now() - start) + 'ms', error: err });
    throw err;
  }
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
    .eq('is_approved', true)
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
