'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { ProductListItem } from '@shoppingmall/shared-types'

const SEARCH_CATALOG: ProductListItem[] = [
  {
    id: 'prod-1',
    name: 'Oversized Double-Breasted Wool Blazer',
    slug: 'oversized-double-breasted-blazer',
    price: '210.00',
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&auto=format&fit=crop&q=80'],
    stock: 10,
    category: { id: 'c1', name: 'Clothing', slug: 'clothing' },
  },
  {
    id: 'prod-2',
    name: 'Croc-Embossed Structured Shoulder Bag',
    slug: 'croc-embossed-shoulder-bag',
    price: '280.00',
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=80'],
    stock: 7,
    category: { id: 'c2', name: 'Bags', slug: 'bags' },
  },
  {
    id: 'prod-3',
    name: 'Minimalist Automatic Ceramic Watch',
    slug: 'minimalist-automatic-ceramic-watch',
    price: '345.00',
    images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&auto=format&fit=crop&q=80'],
    stock: 4,
    category: { id: 'c3', name: 'Watches', slug: 'watches' },
  },
  {
    id: 'prod-4',
    name: 'Straight-Leg Pleated Tailored Pants',
    slug: 'straight-leg-pleated-pants',
    price: '145.00',
    images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&auto=format&fit=crop&q=80'],
    stock: 14,
    category: { id: 'c1', name: 'Clothing', slug: 'clothing' },
  },
  {
    id: 'prod-5',
    name: 'Signature Monogram Leather Crossbody',
    slug: 'signature-monogram-crossbody',
    price: '225.00',
    images: ['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=300&auto=format&fit=crop&q=80'],
    stock: 9,
    category: { id: 'c2', name: 'Bags', slug: 'bags' },
  },
  {
    id: 'prod-6',
    name: 'Chronograph Black Dial Steel Bracelet',
    slug: 'chronograph-black-dial-steel-bracelet',
    price: '390.00',
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&auto=format&fit=crop&q=80'],
    stock: 6,
    category: { id: 'c3', name: 'Watches', slug: 'watches' },
  },
  {
    id: 'prod-7',
    name: 'Relaxed Fit Poplin Cotton Shirt',
    slug: 'relaxed-fit-poplin-shirt',
    price: '95.00',
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&auto=format&fit=crop&q=80'],
    stock: 20,
    category: { id: 'c1', name: 'Clothing', slug: 'clothing' },
  },
  {
    id: 'prod-8',
    name: 'Smooth Calfskin Envelope Clutch',
    slug: 'smooth-calfskin-envelope-clutch',
    price: '175.00',
    images: ['https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=300&auto=format&fit=crop&q=80'],
    stock: 11,
    category: { id: 'c2', name: 'Bags', slug: 'bags' },
  },
  {
    id: 'prod-9',
    name: 'Solar-Powered Minimal Field Watch',
    slug: 'solar-powered-minimal-field-watch',
    price: '290.00',
    images: ['https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=300&auto=format&fit=crop&q=80'],
    stock: 8,
    category: { id: 'c3', name: 'Watches', slug: 'watches' },
  },
  {
    id: 'prod-10',
    name: 'Cashmere-Blend Knit Mock Neck',
    slug: 'cashmere-blend-knit-mock-neck',
    price: '185.00',
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&auto=format&fit=crop&q=80'],
    stock: 12,
    category: { id: 'c1', name: 'Clothing', slug: 'clothing' },
  },
]

export function HeaderSearch({ onSelect }: { onSelect?: () => void }) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // Filter matched pieces
  const trimmed = query.trim().toLowerCase()
  const matches = trimmed
    ? SEARCH_CATALOG.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.category.name.toLowerCase().includes(trimmed),
      )
    : []

  // Close on outside click or Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsOpen(false)
    if (!trimmed) {
      router.push('/products')
      return
    }
    router.push(`/products?q=${encodeURIComponent(query.trim())}`)
    onSelect?.()
  }

  function handleNavigateProduct(slug: string) {
    setIsOpen(false)
    setQuery('')
    router.push(`/products/${slug}`)
    onSelect?.()
  }

  return (
    <div ref={containerRef} className="relative flex items-center">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="search"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          placeholder="Search collections..."
          aria-label="Search catalog"
          className="h-9 w-44 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)]/70 pl-8 pr-7 text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all duration-200 focus:w-64 focus:border-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-text-primary)]"
        />
        <button
          type="submit"
          aria-label="Submit search"
          className="absolute left-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setIsOpen(false)
            }}
            aria-label="Clear search"
            className="absolute right-2 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          >
            ✕
          </button>
        )}
      </form>

      {/* Instant Predictive Results Dropdown */}
      {isOpen && trimmed.length > 0 && (
        <div className="absolute left-0 top-11 z-50 w-80 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-2xl backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between border-b border-[var(--color-border)]/60 pb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
            <span>Instant Results</span>
            <span className="text-[var(--color-text-muted)]">{matches.length} found</span>
          </div>

          {matches.length === 0 ? (
            <div className="py-4 text-center">
              <p className="text-xs font-semibold text-[var(--color-text-primary)]">
                No matching pieces
              </p>
              <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                Try searching &ldquo;blazer&rdquo;, &ldquo;bag&rdquo;, or &ldquo;watch&rdquo;.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--color-border)]/50">
              {matches.slice(0, 4).map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => handleNavigateProduct(p.slug)}
                    className="flex w-full items-center gap-3 py-2 text-left transition-colors hover:bg-[var(--color-surface-raised)] rounded-md px-1.5"
                  >
                    <div className="relative aspect-[3/4] h-11 w-8.5 shrink-0 overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
                      {p.images[0] && (
                        <Image src={p.images[0]} alt={p.name} fill sizes="34px" className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-bold text-[var(--color-text-primary)]">
                        {p.name}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-[var(--color-brand-600)]">
                        {p.category.name}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                      ${parseFloat(p.price).toFixed(2)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Full Search Action Footer */}
          <div className="mt-2 border-t border-[var(--color-border)]/60 pt-2 text-center">
            <Link
              href={`/products?q=${encodeURIComponent(query.trim())}`}
              onClick={() => {
                setIsOpen(false)
                onSelect?.()
              }}
              className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-primary)] hover:text-[var(--color-brand-600)] hover:underline"
            >
              View all results for &ldquo;{query}&rdquo; →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
