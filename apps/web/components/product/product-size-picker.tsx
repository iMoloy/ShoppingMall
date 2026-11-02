'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SizeCalculatorModal } from './size-calculator-modal'

interface Props {
  productName: string
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL']

export function ProductSizePicker({ productName }: Props) {
  const [selectedSize, setSelectedSize] = useState('M')
  const [calculatorOpen, setCalculatorOpen] = useState(false)

  return (
    <div className="border-t border-[var(--color-border)] pt-4">
      <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
        <div className="flex items-center gap-2">
          <span>Size:</span>
          <span className="font-bold text-[var(--color-brand-600)]">{selectedSize}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-muted)]">
          <button
            type="button"
            onClick={() => setCalculatorOpen(true)}
            className="inline-flex items-center gap-1 font-bold text-[var(--color-brand-600)] hover:underline"
          >
            <span>✦</span>
            <span>Find My Size</span>
          </button>
          <span>•</span>
          <Link href="/sizing-guide" className="hover:underline">
            Size Guide
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {SIZES.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => setSelectedSize(size)}
            className={`flex h-11 w-12 items-center justify-center rounded border text-xs font-bold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)] ${
              selectedSize === size
                ? 'border-[var(--color-text-primary)] bg-[var(--color-text-primary)] text-[var(--color-surface)] shadow-sm'
                : 'border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-text-primary)]'
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      <SizeCalculatorModal
        isOpen={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
        onSelectSize={(size) => setSelectedSize(size)}
        productName={productName}
      />
    </div>
  )
}
