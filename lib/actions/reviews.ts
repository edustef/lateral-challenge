'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createReview(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const start = performance.now()
  const actionName = 'createReview'
  const stayId = formData.get('stayId') as string
  const ratingStr = formData.get('rating') as string
  const comment = (formData.get('comment') as string)?.trim() || null

  console.log(`[action] ${actionName} start`, { stayId, rating: ratingStr })

  if (!stayId) {
    console.log(`[action] ${actionName} error`, { duration: Math.round(performance.now() - start) + 'ms', error: 'Missing stayId' })
    return { error: 'Stay ID is required' }
  }

  const rating = parseInt(ratingStr, 10)
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    console.log(`[action] ${actionName} error`, { duration: Math.round(performance.now() - start) + 'ms', error: 'Invalid rating' })
    return { error: 'Rating must be between 1 and 5' }
  }

  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user ?? null

  if (!user) {
    console.log(`[action] ${actionName} error`, { duration: Math.round(performance.now() - start) + 'ms', error: 'Not authenticated' })
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
      console.error(`[action] ${actionName} error`, { duration: Math.round(performance.now() - start) + 'ms', error: 'Duplicate review' })
      return { error: 'You have already reviewed this stay' }
    }
    console.error(`[action] ${actionName} error`, { duration: Math.round(performance.now() - start) + 'ms', error: error.message })
    return { error: error.message }
  }

  console.log(`[action] ${actionName} ok`, { duration: Math.round(performance.now() - start) + 'ms' })
  revalidatePath('/stays/[slug]', 'page')
  return { success: true }
}
