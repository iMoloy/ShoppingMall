'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/product/product-card'
import type { ProductListItem } from '@shoppingmall/shared-types'

const STORAGE_KEY = 'shoppingmall_recently_viewed_v1'

interface Props {
  currentProduct: ProductListItem
}

export function RecentlyViewed({ currentProduct }: Props) {
  const [history, setHistory] = useState<ProductListItem[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      let parsed: ProductListItem[] = stored ? JSON.parse(stored) : []

      // Filter out current product to re-insert it at the front
      parsed = parsed.filter((p) => p.id !== currentProduct.id)
      const updated = [currentProduct, ...parsed].slice(0, 8)

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

      // Only display other recently viewed products (not the current one)
      const otherViewed = updated.filter((p) => p.id !== currentProduct.id)
      queueMicrotask(() => {
        setHistory(otherViewed)
      })
    } catch {
      // Ignore localStorage read errors (e.g. private browsing)
    }
  }, [currentProduct])

  if (history.length === 0) return null

  return (
    <section className="mt-16 border-t border-[var(--color-border)] pt-12">
      <div className="mb-6">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
          Your Curated History
        </span>
        <h2 className="mt-1 text-2xl font-extrabold uppercase tracking-tight text-[var(--color-text-primary)]">
          Recently Viewed Pieces
        </h2>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          Easily return to runway styles and accessories you explored earlier.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
        {history.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
