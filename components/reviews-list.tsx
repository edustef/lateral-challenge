import type { ReviewWithAuthor } from '@/lib/actions/stays';
import { Star, MessageCircle } from 'lucide-react';

function getInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? 'text-warm-accent fill-warm-accent' : 'text-text-muted'}
        />
      ))}
    </div>
  );
}

export function ReviewsList({ reviews }: { reviews: ReviewWithAuthor[] }) {
  if (reviews.length === 0) {
    return (
      <section className="mt-8">
        <h2 className="font-heading text-xl font-semibold text-text-primary">
          Reviews
        </h2>
        <div className="mt-4 flex flex-col items-center gap-2 py-8 text-text-muted">
          <MessageCircle size={32} />
          <p className="text-sm">No reviews yet</p>
        </div>
      </section>
    );
  }

  const average =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section className="mt-8">
      <div className="flex items-center gap-3">
        <h2 className="font-heading text-xl font-semibold text-text-primary">
          Reviews
        </h2>
        <div className="flex items-center gap-1.5">
          <StarRating rating={Math.round(average)} />
          <span className="text-sm font-semibold text-text-primary">
            {average.toFixed(1)}
          </span>
          <span className="text-sm text-text-secondary">
            ({reviews.length})
          </span>
        </div>
      </div>

      <div className="mt-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-border-subtle py-4 last:border-0"
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white font-semibold text-sm shrink-0">
                {getInitials(review.profiles?.full_name ?? null)}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-text-primary">
                    {review.profiles?.full_name ?? 'Anonymous'}
                  </span>
                  <StarRating rating={review.rating} size={12} />
                </div>
                <span className="text-xs text-text-muted">
                  {review.created_at
                    ? new Date(review.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })
                    : ''}
                </span>
              </div>
            </div>
            {review.comment && (
              <p className="mt-2 text-text-body text-sm">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
