'use client'

import { useActionState, useState } from 'react'
import { Star } from 'lucide-react'
import Link from 'next/link'
import { createReview } from '@/lib/actions/reviews'

type ReviewFormProps = {
  stayId: string
  userEmail: string | null
}

function StarSelector({
  rating,
  hoverRating,
  onSelect,
  onHover,
  onLeave,
}: {
  rating: number
  hoverRating: number
  onSelect: (r: number) => void
  onHover: (r: number) => void
  onLeave: () => void
}) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating" onMouseLeave={onLeave}>
      {Array.from({ length: 5 }, (_, i) => {
        const value = i + 1
        const filled = value <= (hoverRating || rating)
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={rating === value}
            onClick={() => onSelect(value)}
            onMouseEnter={() => onHover(value)}
            className="transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded-sm"
            aria-label={`${value} star${value !== 1 ? 's' : ''}`}
          >
            <Star
              size={24}
              className={
                filled
                  ? 'text-warm-accent fill-warm-accent'
                  : 'text-text-muted hover:text-warm-accent'
              }
            />
          </button>
        )
      })}
    </div>
  )
}

export function ReviewForm({ stayId, userEmail }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string; success?: boolean }, formData: FormData) => {
      const result = await createReview(formData)
      if (result.success) {
        setRating(0)
        setSubmitted(true)
      }
      return result
    },
    {}
  )

  if (!userEmail) {
    return (
      <div className="mt-6 rounded-card border border-border-subtle bg-bg-card p-4">
        <p className="text-sm text-text-secondary">
          <Link href="/auth/login" className="font-medium text-accent hover:underline">
            Sign in
          </Link>{' '}
          to leave a review
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 rounded-card border border-border-subtle bg-bg-card p-4">
      <h3 className="mb-3 font-heading text-lg font-semibold text-text-primary">
        Leave a review
      </h3>

      {submitted && state.success ? (
        <p className="text-sm font-medium text-success">Review submitted!</p>
      ) : (
        <form action={formAction}>
          <input type="hidden" name="stayId" value={stayId} />
          <input type="hidden" name="rating" value={rating} />

          <div className="mb-3">
            <label className="mb-1 block text-sm font-medium text-text-secondary">
              Rating
            </label>
            <StarSelector
              rating={rating}
              hoverRating={hoverRating}
              onSelect={setRating}
              onHover={setHoverRating}
              onLeave={() => setHoverRating(0)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="review-comment" className="mb-1 block text-sm font-medium text-text-secondary">
              Comment <span className="text-text-muted">(optional)</span>
            </label>
            <textarea
              id="review-comment"
              name="comment"
              rows={3}
              placeholder="Share your experience..."
              className="w-full rounded-lg border border-border bg-bg-page px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {state.error && (
            <p className="mb-3 text-sm font-medium text-error">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={isPending || rating === 0}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Submitting...' : 'Submit review'}
          </button>
        </form>
      )}
    </div>
  )
}
