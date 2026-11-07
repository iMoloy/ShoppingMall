'use client'

import { useState } from 'react'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'

interface ReviewItem {
  id: string
  author: string
  date: string
  rating: number
  title: string
  content: string
  fit: string
  verified: boolean
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Elena R. — Milan',
    date: 'October 24, 2026',
    rating: 5,
    title: 'Impeccable tailoring and architectural drape',
    content:
      'The fabric hand-feel is extraordinary. It holds its structured form without feeling stiff. Wore it to Paris Fashion Week and received countless inquiries.',
    fit: 'True to Size',
    verified: true,
  },
  {
    id: 'rev-2',
    author: 'Marcus K. — London',
    date: 'October 18, 2026',
    rating: 5,
    title: 'Rivals heritage luxury houses at double the price',
    content:
      'The precision stitching, custom hardware, and clean interior seams demonstrate pure artisanal craft. The 48-hour delivery was the fastest luxury experience I have had.',
    fit: 'True to Size',
    verified: true,
  },
  {
    id: 'rev-3',
    author: 'Chloe V. — New York',
    date: 'September 29, 2026',
    rating: 5,
    title: 'Flawless minimalist aesthetic',
    content:
      'Subtle luxury at its finest. Zero loud branding, just exquisite materials and timeless proportions. The unboxing experience alone felt like high jewelry.',
    fit: 'Runs Slightly Large',
    verified: true,
  },
]

export function ProductReviews({ productName }: { productName: string }) {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS)
  const [modalOpen, setModalOpen] = useState(false)

  // Review Form State
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [fit, setFit] = useState('True to Size')

  function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !title.trim() || !content.trim()) {
      toast.error('Please complete all required fields.')
      return
    }

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: location.trim() ? `${name.trim()} — ${location.trim()}` : name.trim(),
      date: 'Just now',
      rating,
      title: title.trim(),
      content: content.trim(),
      fit,
      verified: true,
    }

    setReviews([newRev, ...reviews])
    setModalOpen(false)
    setName('')
    setLocation('')
    setTitle('')
    setContent('')
    toast.success('Thank you! Your verified review has been published.')
  }

  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)

  return (
    <section className="mt-16 border-t border-[var(--color-border)] pt-12">
      {/* Section Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
            Client Experience &amp; Craft
          </span>
          <h2 className="mt-1 text-2xl font-extrabold uppercase tracking-tight text-[var(--color-text-primary)]">
            Client Reviews &amp; Ratings
          </h2>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            Verified purchaser evaluations for {productName}.
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={() => setModalOpen(true)}
          className="uppercase tracking-wider"
        >
          Write A Review
        </Button>
      </div>

      {/* Ratings Summary Card */}
      <div className="mb-10 grid grid-cols-1 gap-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 sm:p-8 md:grid-cols-12">
        {/* Left: Overall Score */}
        <div className="flex flex-col items-center justify-center border-b border-[var(--color-border)] pb-6 md:col-span-4 md:border-b-0 md:border-r md:pb-0">
          <span className="text-5xl font-black text-[var(--color-text-primary)]">
            {averageRating}
          </span>
          <div
            className="mt-2 flex items-center gap-1 text-[var(--color-brand-600)]"
            aria-label={`Rating: ${averageRating} out of 5 stars`}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="mt-2 text-xs font-semibold text-[var(--color-text-muted)]">
            Based on {reviews.length} verified reviews
          </span>
        </div>

        {/* Middle: Rating Breakdown Bars */}
        <div className="flex flex-col justify-center gap-2 md:col-span-5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length
            const percentage = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-6 font-bold text-[var(--color-text-primary)]">{star}★</span>
                <div className="h-2 flex-1 overflow-hidden rounded bg-[var(--color-border)]">
                  <div
                    className="h-full bg-[var(--color-text-primary)] transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-9 text-right font-medium text-[var(--color-text-muted)]">
                  {percentage}%
                </span>
              </div>
            )
          })}
        </div>

        {/* Right: Fit Satisfaction */}
        <div className="flex flex-col justify-center border-t border-[var(--color-border)] pt-6 md:col-span-3 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
            Fit Evaluation
          </span>
          <p className="mt-1 text-sm font-bold text-[var(--color-text-primary)]">
            True to Size (94%)
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            Buyers consistently report tailored, precise proportions aligned with the sizing guide.
          </p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[var(--color-brand-600)]">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <svg
                      key={i}
                      className="h-3.5 w-3.5 fill-current"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-600)]">
                    <span>✓</span> Verified Buyer
                  </span>
                )}
              </div>

              <h3 className="mt-3 text-sm font-bold uppercase tracking-tight text-[var(--color-text-primary)]">
                &ldquo;{rev.title}&rdquo;
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
                {rev.content}
              </p>
            </div>

            <div className="border-[var(--color-border)]/60 mt-6 flex items-center justify-between border-t pt-3 text-[11px] text-[var(--color-text-muted)]">
              <span className="font-semibold text-[var(--color-text-primary)]">{rev.author}</span>
              <span>{rev.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Write Review Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Write a Review"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            onClick={() => setModalOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
              <h3 className="text-lg font-extrabold uppercase tracking-tight text-[var(--color-text-primary)]">
                Write a Verified Review
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="mt-4 flex flex-col gap-4 text-xs">
              {/* Star Rating Picker */}
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Overall Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`h-8 w-8 text-lg ${
                        star <= rating
                          ? 'text-[var(--color-brand-600)]'
                          : 'text-[var(--color-border)]'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Author & Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya S."
                    className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-xs text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    City / Country
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. New York, USA"
                    className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-xs text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
                  />
                </div>
              </div>

              {/* Fit Feedback */}
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  How does it fit?
                </label>
                <select
                  value={fit}
                  onChange={(e) => setFit(e.target.value)}
                  className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-xs text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
                >
                  <option value="Runs Small">Runs Small</option>
                  <option value="True to Size">True to Size</option>
                  <option value="Runs Large">Runs Large</option>
                </select>
              </div>

              {/* Review Headline */}
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Review Headline *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Exquisite quality and silhouette"
                  className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-xs text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
                />
              </div>

              {/* Review Content */}
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Detailed Experience *
                </label>
                <textarea
                  rows={3}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe the fabric, cut, finish, or delivery experience..."
                  className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-xs text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-2 flex items-center justify-end gap-3 pt-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  className="uppercase tracking-wider"
                >
                  Publish Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
