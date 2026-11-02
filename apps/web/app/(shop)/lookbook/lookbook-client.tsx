'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import type { CartItemResponse, ProductListItem } from '@shoppingmall/shared-types'

interface Hotspot {
  id: string
  top: string // percentage e.g. '35%'
  left: string // percentage e.g. '48%'
  product: ProductListItem
}

interface EditorialLook {
  id: string
  lookNumber: string
  title: string
  season: string
  description: string
  image: string
  hotspots: Hotspot[]
}

const EDITORIAL_LOOKS: EditorialLook[] = [
  {
    id: 'look-1',
    lookNumber: 'Look 01',
    title: 'Monochrome Resort Silhouette',
    season: 'Runway Summer Drop',
    description:
      'A relaxed study in architectural proportions. Unstructured virgin wool paired with crisp poplin cotton and sculptural calfskin hardware.',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80',
    hotspots: [
      {
        id: 'hs-1',
        top: '38%',
        left: '46%',
        product: {
          id: 'prod-1',
          name: 'Oversized Double-Breasted Wool Blazer',
          slug: 'oversized-double-breasted-blazer',
          price: '210.00',
          images: [
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
          ],
          stock: 10,
          category: { id: 'c1', name: 'Clothing', slug: 'clothing' },
        },
      },
      {
        id: 'hs-2',
        top: '68%',
        left: '52%',
        product: {
          id: 'prod-4',
          name: 'Straight-Leg Pleated Tailored Pants',
          slug: 'straight-leg-pleated-pants',
          price: '145.00',
          images: [
            'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80',
          ],
          stock: 14,
          category: { id: 'c1', name: 'Clothing', slug: 'clothing' },
        },
      },
    ],
  },
  {
    id: 'look-2',
    lookNumber: 'Look 02',
    title: 'Urban Horology & Atelier Leather',
    season: 'Autumn Transition Preview',
    description:
      'Precision ceramic timepieces paired with hand-buffed croc-embossed calfskin bags. Engineered for modern metropolitan movement.',
    image:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&auto=format&fit=crop&q=80',
    hotspots: [
      {
        id: 'hs-3',
        top: '42%',
        left: '32%',
        product: {
          id: 'prod-2',
          name: 'Croc-Embossed Structured Shoulder Bag',
          slug: 'croc-embossed-shoulder-bag',
          price: '280.00',
          images: [
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
          ],
          stock: 7,
          category: { id: 'c2', name: 'Bags', slug: 'bags' },
        },
      },
      {
        id: 'hs-4',
        top: '62%',
        left: '60%',
        product: {
          id: 'prod-3',
          name: 'Minimalist Automatic Ceramic Watch',
          slug: 'minimalist-automatic-ceramic-watch',
          price: '345.00',
          images: [
            'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80',
          ],
          stock: 4,
          category: { id: 'c3', name: 'Watches', slug: 'watches' },
        },
      },
    ],
  },
]

export function LookbookClient() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)
  const { addItem, openCart } = useCartStore()

  function handleQuickAdd(product: ProductListItem) {
    const item: CartItemResponse = {
      id: `cart-${product.id}`,
      quantity: 1,
      product,
    }
    addItem(item)
    openCart()
    toast.success(`${product.name} added to your bag`)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]"
      >
        <Link href="/" className="hover:text-[var(--color-text-primary)]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)]">Runway Lookbook</span>
      </nav>

      {/* Hero Heading */}
      <div className="mb-12 border-b border-[var(--color-border)] pb-8 text-center sm:text-left">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
          Runway Editorial &bull; Summer 2026
        </span>
        <h1 className="mt-2 text-3xl font-extrabold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
          Shop The Lookbook
        </h1>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[var(--color-text-muted)] sm:text-sm">
          Explore complete outfit compositions curated directly from our Paris and Milan runways.
          Tap the interactive hotspot pins on any look to discover the exact tailoring and leather pieces.
        </p>
      </div>

      {/* Editorial Looks Grid */}
      <div className="flex flex-col gap-16">
        {EDITORIAL_LOOKS.map((look, index) => (
          <article
            key={look.id}
            className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-10 lg:grid-cols-12"
          >
            {/* Visual with interactive hotspot pins (7 cols) */}
            <div
              className={`relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] lg:col-span-7 ${
                index % 2 === 1 ? 'lg:order-2' : ''
              }`}
            >
              <Image
                src={look.image}
                alt={look.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                priority={index === 0}
              />

              {/* Hotspot Pins */}
              {look.hotspots.map((hs) => {
                const isActive = activeHotspot === hs.id

                return (
                  <div
                    key={hs.id}
                    style={{ top: hs.top, left: hs.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                  >
                    {/* Pulsing Pin Button */}
                    <button
                      type="button"
                      onClick={() => setActiveHotspot(isActive ? null : hs.id)}
                      aria-label={`View ${hs.product.name}`}
                      aria-expanded={isActive}
                      className="group relative flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-text-primary)] text-[var(--color-surface)] shadow-xl transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
                    >
                      <span className="absolute inset-0 animate-ping rounded-md bg-[var(--color-text-primary)]/40" />
                      <span className="text-xs font-bold leading-none">+</span>
                    </button>

                    {/* Popover Card */}
                    {isActive && (
                      <div className="absolute left-1/2 top-9 z-30 w-64 -translate-x-1/2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-2xl backdrop-blur-md">
                        <div className="flex items-center gap-3">
                          <div className="relative aspect-[3/4] h-14 w-11 shrink-0 overflow-hidden rounded-md border border-[var(--color-border)]">
                            <Image
                              src={hs.product.images[0] ?? ''}
                              alt={hs.product.name}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-brand-600)]">
                              {hs.product.category.name}
                            </span>
                            <p className="line-clamp-1 text-xs font-bold text-[var(--color-text-primary)]">
                              {hs.product.name}
                            </p>
                            <p className="text-xs font-extrabold text-[var(--color-text-primary)]">
                              ${parseFloat(hs.product.price).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleQuickAdd(hs.product)}
                            className="flex-1 text-[10px] uppercase tracking-wider"
                          >
                            Quick Add +
                          </Button>
                          <Button asChild variant="secondary" size="sm" className="text-[10px] uppercase">
                            <Link href={`/products/${hs.product.slug}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Editorial Content Narrative (5 cols) */}
            <div className={`flex flex-col justify-between lg:col-span-5 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-[var(--color-brand-600)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
                    {look.lookNumber}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                    {look.season}
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-extrabold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
                  {look.title}
                </h2>

                <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-muted)] sm:text-sm">
                  {look.description}
                </p>

                {/* Featured Products List */}
                <div className="mt-6 border-t border-[var(--color-border)]/60 pt-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                    Featured In This Look
                  </span>
                  <ul className="mt-3 flex flex-col gap-3">
                    {look.hotspots.map((hs) => (
                      <li
                        key={hs.id}
                        className="flex items-center justify-between rounded-lg border border-[var(--color-border)]/60 bg-[var(--color-surface-raised)] p-2.5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative aspect-[3/4] h-12 w-9 shrink-0 overflow-hidden rounded">
                            <Image
                              src={hs.product.images[0] ?? ''}
                              alt={hs.product.name}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/products/${hs.product.slug}`}
                              className="line-clamp-1 text-xs font-bold text-[var(--color-text-primary)] hover:underline"
                            >
                              {hs.product.name}
                            </Link>
                            <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                              ${parseFloat(hs.product.price).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleQuickAdd(hs.product)}
                          className="text-[10px] uppercase font-bold"
                        >
                          Add +
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
