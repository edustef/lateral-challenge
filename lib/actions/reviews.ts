'use server'

import { createClient, getClaims } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { moderateContent } from '@/lib/moderation'
import { revalidatePath } from 'next/cache'

export async function createReview(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const log = logger('createReview')
  const stayId = formData.get('stayId') as string
  const ratingStr = formData.get('rating') as string
  const comment = (formData.get('comment') as string)?.trim() || null

  log.info('start', { stayId, rating: ratingStr })

  if (!stayId) {
    log.error('missing stayId', { duration: log.elapsed() })
    return { error: 'Stay ID is required' }
  }

  const rating = parseInt(ratingStr, 10)
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    log.error('invalid rating', { duration: log.elapsed() })
    return { error: 'Rating must be between 1 and 5' }
  }

  const supabase = await createClient()
  const user = await getClaims()

  if (!user) {
    log.error('not authenticated', { duration: log.elapsed() })
    return { error: 'You must be signed in to leave a review' }
  }

  const isApproved = await moderateContent(comment ?? '')
  log.info('moderation', { isApproved })

  const { error } = await supabase
    .from('reviews')
    .insert({
      stay_id: stayId,
      user_id: user.id,
      rating,
      comment,
      is_approved: isApproved,
    })

  if (error) {
    // Unique constraint violation — user already reviewed this stay
    if (error.code === '23505') {
      log.error('duplicate review', { duration: log.elapsed() })
      return { error: 'You have already reviewed this stay' }
    }
    log.error('db error', { duration: log.elapsed(), error: error.message })
    return { error: error.message }
  }

  log.info('ok', { duration: log.elapsed() })
  revalidatePath('/stays/[slug]', 'page')
  return { success: true }
}
