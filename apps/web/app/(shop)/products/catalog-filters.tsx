'use client'

import { useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { Category } from '@shoppingmall/shared-types'

interface Props {
  categories: Category[]
  totalCount: number
}

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured Drops' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

const PRICE_TIERS = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-150', label: 'Under $150' },
  { id: '150-300', label: '$150 – $300' },
  { id: 'above-300', label: '$300+' },
]

export function CatalogFilters({ categories, totalCount }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentCategory = searchParams.get('category') ?? ''
  const currentSort = searchParams.get('sort') ?? 'featured'
  const currentPrice = searchParams.get('price') ?? 'all'
  const currentInStock = searchParams.get('inStock') === 'true'
  const currentQuery = searchParams.get('q') ?? ''

  function updateQuery(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all' || (key === 'sort' && value === 'featured')) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    startTransition(() => {
      const queryString = params.toString()
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
    })
  }

  function handleClearAll() {
    startTransition(() => {
      router.push(pathname, { scroll: false })
    })
  }

  const hasActiveFilters = Boolean(
    currentCategory || currentSort !== 'featured' || currentPrice !== 'all' || currentInStock || currentQuery,
  )

  return (
    <div className="mb-8 flex flex-col gap-4">
      {/* Top Filter Bar: Categories & Sort */}
      <div className="flex flex-col justify-between gap-4 border-b border-[var(--color-border)]/70 pb-4 lg:flex-row lg:items-center">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => updateQuery({ category: null })}
            className={`rounded-md px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-150 ${
              !currentCategory
                ? 'bg-[var(--color-text-primary)] text-[var(--color-surface)]'
                : 'border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            All Items
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => updateQuery({ category: currentCategory === c.slug ? null : c.slug })}
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-150 ${
                currentCategory === c.slug
                  ? 'bg-[var(--color-text-primary)] text-[var(--color-surface)]'
                  : 'border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Right side controls: Count & Sort */}
        <div className="flex items-center justify-between gap-4 lg:justify-end">
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            {isPending ? 'Updating...' : `${totalCount} curated piece${totalCount === 1 ? '' : 's'}`}
          </span>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="catalog-sort" className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Sort:
            </label>
            <select
              id="catalog-sort"
              value={currentSort}
              onChange={(e) => updateQuery({ sort: e.target.value })}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Secondary Bar: Price Tiers & In-Stock Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mr-1">
            Price:
          </span>
          {PRICE_TIERS.map((tier) => (
            <button
              key={tier.id}
              type="button"
              onClick={() => updateQuery({ price: tier.id })}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                currentPrice === tier.id
                  ? 'bg-[var(--color-surface-raised)] font-bold text-[var(--color-text-primary)] border border-[var(--color-text-primary)]'
                  : 'border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* In-Stock Only Toggle */}
          <label className="flex cursor-pointer items-center gap-2 select-none">
            <input
              type="checkbox"
              checked={currentInStock}
              onChange={(e) => updateQuery({ inStock: e.target.checked ? 'true' : null })}
              className="h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
            />
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-primary)]">
              In Stock Only
            </span>
          </label>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-600)] hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
