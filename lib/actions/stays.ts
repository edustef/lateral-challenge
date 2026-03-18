'use server';

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import type { Tables } from '@/lib/supabase/types';

export type StayCard = Tables<'stays'> & {
  avg_rating: number | null;
  review_count: number;
};

export async function getStays(filters: {
  type?: string | null;
  tags?: string[] | null;
  locations?: string[] | null;
  countries?: string[] | null;
  sort?: string | null;
  stayType?: string | null;
  maxPrice?: number | null;
  amenities?: string[] | null;
}): Promise<StayCard[]> {
  const log = logger('getStays');
  log.info('start', { filters });
  try {
    const supabase = await createClient();
    let query = supabase.from('stays').select('*');

    if (filters.type) query = query.eq('travel_type', filters.type);
    // Tags are a soft filter — applied as client-side sort after fetch (matches first, then rest)

    // Geographic filters: locations (text match) and countries (country code) are OR'd together
    const geoConditions: string[] = [];
    if (filters.locations?.length) {
      for (const loc of filters.locations) {
        const sanitized = loc.replace(/%/g, '\\%').replace(/_/g, '\\_');
        geoConditions.push(`title.ilike.%${sanitized}%`, `location.ilike.%${sanitized}%`);
      }
    }
    if (filters.countries?.length) {
      geoConditions.push(`country.in.(${filters.countries.join(',')})`);
    }
    if (geoConditions.length > 0) {
      query = query.or(geoConditions.join(','));
    }
    if (filters.stayType) query = query.eq('type', filters.stayType);
    if (filters.maxPrice) query = query.lte('price_per_night', filters.maxPrice);
    if (filters.amenities && filters.amenities.length > 0) {
      query = query.contains('amenities', filters.amenities);
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

    // Soft-sort by tag relevance: stays matching more requested tags appear first
    if (filters.tags?.length && filters.sort !== 'price-asc' && filters.sort !== 'price-desc') {
      const requestedTags = new Set(filters.tags);
      result.sort((a, b) => {
        const aHits = (a.tags ?? []).filter(t => requestedTags.has(t)).length;
        const bHits = (b.tags ?? []).filter(t => requestedTags.has(t)).length;
        return bHits - aHits; // more tag matches = higher rank
      });
    }

    log.info('ok', { duration: log.elapsed(), count: result.length });
    return result;
  } catch (err) {
    log.error('failed', { duration: log.elapsed(), error: err instanceof Error ? err.message : String(err) });
    throw err;
  }
}

export async function getFeaturedStays(): Promise<StayCard[]> {
  const all = await getStays({ sort: 'rating-desc' });
  return all.slice(0, 4);
}

export async function getStayBySlug(slug: string): Promise<Tables<'stays'> | null> {
  const log = logger('getStayBySlug');
  log.info('start', { slug });
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('stays')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) {
      log.info('ok', { duration: log.elapsed(), found: false });
      return null;
    }
    log.info('ok', { duration: log.elapsed(), found: true });
    return data;
  } catch (err) {
    log.error('failed', { duration: log.elapsed(), error: err instanceof Error ? err.message : String(err) });
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
