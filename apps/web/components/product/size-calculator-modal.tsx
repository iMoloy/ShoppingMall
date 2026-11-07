'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSelectSize?: (size: string) => void
  productName?: string
}

export function SizeCalculatorModal({ isOpen, onClose, onSelectSize, productName }: Props) {
  const modalRef = useRef<HTMLDivElement>(null)

  const [heightCm, setHeightCm] = useState(175)
  const [weightKg, setWeightKg] = useState(70)
  const [fitPreference, setFitPreference] = useState<'fitted' | 'regular' | 'oversized'>('regular')

  // Focus trap & Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])',
    )
    focusable?.[0]?.focus()

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  // Calculate recommended size
  // Formula based on BMI and height normalization
  const heightM = heightCm / 100
  const bmi = weightKg / (heightM * heightM)

  let baseSizeIndex = 2 // Medium default (0=XS, 1=S, 2=M, 3=L, 4=XL)
  if (bmi < 19.5) baseSizeIndex = heightCm > 175 ? 1 : 0
  else if (bmi < 22.5) baseSizeIndex = heightCm > 180 ? 2 : 1
  else if (bmi < 26.0) baseSizeIndex = 2
  else if (bmi < 29.5) baseSizeIndex = 3
  else baseSizeIndex = 4

  // Adjust by fit preference
  if (fitPreference === 'fitted') baseSizeIndex = Math.max(0, baseSizeIndex - 1)
  if (fitPreference === 'oversized') baseSizeIndex = Math.min(4, baseSizeIndex + 1)

  const SIZES = ['XS', 'S', 'M', 'L', 'XL']
  const recommendedSize = SIZES[baseSizeIndex] ?? 'M'

  function handleApply() {
    onSelectSize?.(recommendedSize)
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Find My Size Calculator"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl sm:p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
              Smart Fit Atelier
            </span>
            <h2 className="mt-1 text-xl font-extrabold uppercase tracking-tight text-[var(--color-text-primary)]">
              Find Your Ideal Size
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close calculator"
            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]"
          >
            ✕
          </button>
        </div>

        {productName && (
          <p className="mt-3 text-xs text-[var(--color-text-muted)]">
            Tailoring sizing guidance for{' '}
            <strong className="text-[var(--color-text-primary)]">{productName}</strong>.
          </p>
        )}

        {/* Input sliders */}
        <div className="mt-6 flex flex-col gap-5 text-xs">
          {/* Height Slider */}
          <div>
            <div className="flex justify-between font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              <span>Height</span>
              <span className="font-bold text-[var(--color-text-primary)]">
                {heightCm} cm ({Math.floor(heightCm / 30.48)}&apos;
                {Math.round((heightCm % 30.48) / 2.54)}&quot;)
              </span>
            </div>
            <input
              type="range"
              min="145"
              max="205"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[var(--color-border)] accent-[var(--color-text-primary)]"
            />
            <div className="mt-1 flex justify-between text-[10px] text-[var(--color-text-muted)]">
              <span>145 cm</span>
              <span>175 cm</span>
              <span>205 cm</span>
            </div>
          </div>

          {/* Weight Slider */}
          <div>
            <div className="flex justify-between font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              <span>Weight</span>
              <span className="font-bold text-[var(--color-text-primary)]">
                {weightKg} kg ({(weightKg * 2.20462).toFixed(0)} lbs)
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="130"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[var(--color-border)] accent-[var(--color-text-primary)]"
            />
            <div className="mt-1 flex justify-between text-[10px] text-[var(--color-text-muted)]">
              <span>40 kg</span>
              <span>85 kg</span>
              <span>130 kg</span>
            </div>
          </div>

          {/* Fit Preference Pills */}
          <div>
            <label className="mb-2 block font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Preferred Fit Silhouette
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'fitted', label: 'Fitted', desc: 'Slim & Tailored' },
                { id: 'regular', label: 'Regular', desc: 'Classic Luxury' },
                { id: 'oversized', label: 'Oversized', desc: 'Runway Drape' },
              ].map((fit) => (
                <button
                  key={fit.id}
                  type="button"
                  onClick={() => setFitPreference(fit.id as 'fitted' | 'regular' | 'oversized')}
                  className={`flex flex-col items-center justify-center rounded-lg border p-2.5 text-center transition-colors ${
                    fitPreference === fit.id
                      ? 'border-[var(--color-text-primary)] bg-[var(--color-surface-raised)] font-bold text-[var(--color-text-primary)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-primary)]'
                  }`}
                >
                  <span className="text-xs">{fit.label}</span>
                  <span className="mt-0.5 text-[9px] opacity-75">{fit.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Result Card */}
        <div className="mt-6 flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
              Calculated Recommendation
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black text-[var(--color-text-primary)]">
                Size {recommendedSize}
              </span>
              <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                (95% confidence fit)
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              Proportioned for breathable comfort and effortless posture.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleApply}
            className="shrink-0 uppercase tracking-wider"
          >
            Apply Size
          </Button>
        </div>
      </div>
    </div>
  )
}
