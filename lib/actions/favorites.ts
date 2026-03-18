'use server';

import { revalidatePath } from 'next/cache';
import { createClient, getClaims } from '@/lib/supabase/server';
import type { StayCard } from './stays';

export async function toggleFavorite(stayId: string): Promise<{ favorited: boolean; error?: string }> {
  const user = await getClaims();

  if (!user) {
    return { favorited: false, error: 'Not authenticated' };
  }

  const supabase = await createClient();
  const userId = user.id;

  // Check if already favorited
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('stay_id', stayId)
    .single();

  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id);
    revalidatePath('/', 'layout');
    return { favorited: false };
  }

  await supabase.from('favorites').insert({ user_id: userId, stay_id: stayId });
  revalidatePath('/', 'layout');
  return { favorited: true };
}

export async function getFavoriteStayIds(): Promise<string[]> {
  const user = await getClaims();

  if (!user) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from('favorites')
    .select('stay_id')
    .eq('user_id', user.id);

  return (data ?? []).map((row) => row.stay_id);
}

export async function getFavoriteStays(): Promise<StayCard[]> {
  const user = await getClaims();

  if (!user) return [];

  const supabase = await createClient();
  const { data: favorites } = await supabase
    .from('favorites')
    .select('stay_id')
    .eq('user_id', user.id);

  if (!favorites || favorites.length === 0) return [];

  const stayIds = favorites.map((f) => f.stay_id);

  const { data: stays } = await supabase
    .from('stays')
    .select('*')
    .in('id', stayIds);

  if (!stays || stays.length === 0) return [];

  // Compute avg_rating and review_count same as getStays
  const { data: reviews } = await supabase
    .from('reviews')
    .select('stay_id, rating')
    .in('stay_id', stayIds);

  const ratingMap = new Map<string, { sum: number; count: number }>();
  for (const r of reviews ?? []) {
    const entry = ratingMap.get(r.stay_id) ?? { sum: 0, count: 0 };
    entry.sum += r.rating;
    entry.count += 1;
    ratingMap.set(r.stay_id, entry);
  }

  return stays.map((s) => {
    const entry = ratingMap.get(s.id);
    return {
      ...s,
      avg_rating: entry ? entry.sum / entry.count : null,
      review_count: entry?.count ?? 0,
    };
  });
}
