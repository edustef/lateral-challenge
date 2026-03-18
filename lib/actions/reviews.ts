'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createReview(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const stayId = formData.get('stayId') as string
  const ratingStr = formData.get('rating') as string
  const comment = (formData.get('comment') as string)?.trim() || null

  if (!stayId) {
    return { error: 'Stay ID is required' }
  }

  const rating = parseInt(ratingStr, 10)
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: 'Rating must be between 1 and 5' }
  }

  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user ?? null

  if (!user) {
    return { error: 'You must be signed in to leave a review' }
  }

  const { error } = await supabase
    .from('reviews')
    .insert({
      stay_id: stayId,
      user_id: user.id,
      rating,
      comment,
    })

  if (error) {
    // Unique constraint violation — user already reviewed this stay
    if (error.code === '23505') {
      return { error: 'You have already reviewed this stay' }
    }
    return { error: error.message }
  }

  revalidatePath('/stays/[slug]', 'page')
  return { success: true }
}
