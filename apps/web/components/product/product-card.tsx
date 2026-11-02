'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { toast } from '@/components/ui/toast'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { QuickViewModal } from './quick-view-modal'
import type { CartItemResponse, ProductListItem } from '@shoppingmall/shared-types'

interface ProductCardProps {
  product: ProductListItem
}

const COLOR_SWATCHES = [
  { name: 'Onyx Black', hex: '#1c1917' },
  { name: 'Warm Camel', hex: '#b45309' },
  { name: 'Olive Green', hex: '#3f6212' },
  { name: 'Cream Chalk', hex: '#fef08a' },
]

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()
  const [selectedColor, setSelectedColor] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

  function handleOpenQuickView(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsQuickViewOpen(true)
  }

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    setIsAdding(true)
    try {
      const res = await api.post<CartItemResponse>('/cart', {
        productId: product.id,
        quantity: 1,
      })
      if (res.success && res.data) {
        addItem(res.data)
      } else {
        addItem({
          id: `cart-${product.id}`,
          quantity: 1,
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            images: product.images,
            stock: product.stock,
            category: product.category,
          },
        })
      }
    } catch {
      addItem({
        id: `cart-${product.id}`,
        quantity: 1,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          images: product.images,
          stock: product.stock,
          category: product.category,
        },
      })
    } finally {
      setIsAdding(false)
      openCart()
      toast.success(`${product.name} added to bag`)
    }
  }

  function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted((prev) => !prev)
    toast.success(
      !isWishlisted ? 'Saved to your wishlist' : 'Removed from your wishlist',
    )
  }

  const imageUrl = product.images[0] ?? null
  const inStock = product.stock > 0

  return (
    <article className="group relative flex flex-col transition-all duration-200">
      {/* 3:4 Fashion Aspect Ratio Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-[var(--color-surface-raised)]">
        <Link
          href={`/products/${product.slug}`}
          className="relative block h-full w-full"
          tabIndex={-1}
          aria-hidden="true"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[var(--color-text-muted)]">
              <PlaceholderIcon />
              <span className="text-[11px] font-medium uppercase tracking-wider">
                {product.category.name}
              </span>
            </div>
          )}

          {/* Badges: Out of stock or New */}
          {!inStock ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)]/75 backdrop-blur-[1px]">
              <Badge variant="muted" className="text-xs font-semibold uppercase">
                Out of stock
              </Badge>
            </div>
          ) : (
            <div className="absolute left-2.5 top-2.5">
              <span className="rounded bg-[var(--color-surface)]/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-primary)] shadow-sm backdrop-blur-sm">
                New
              </span>
            </div>
          )}
        </Link>

        {/* Wishlist Heart Icon (Top Right) */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface)]/90 text-[var(--color-text-primary)] shadow-sm backdrop-blur-sm transition-colors duration-150 hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)] ${
            isWishlisted ? 'text-red-500' : 'text-[var(--color-text-muted)]'
          }`}
        >
          <HeartIcon filled={isWishlisted} />
        </button>

        {/* Floating Quick Action Buttons on Hover (Bottom of image) */}
        {inStock && (
          <div className="absolute inset-x-2 bottom-2 flex items-center gap-1.5 translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={handleOpenQuickView}
              className="flex h-9 flex-1 items-center justify-center gap-1 rounded border border-[var(--color-border)] bg-[var(--color-surface)]/95 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-primary)] shadow-sm backdrop-blur-sm transition-colors hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
            >
              <EyeIcon />
              <span>Quick View</span>
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex h-9 flex-1 items-center justify-center gap-1 rounded bg-[var(--color-text-primary)] text-[10px] font-bold uppercase tracking-wider text-[var(--color-surface)] shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
            >
              <PlusIcon />
              <span>{isAdding ? 'Adding...' : 'Quick Add'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick View Modal Dialog */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />

      {/* Info & Typography Section */}
      <div className="flex flex-1 flex-col gap-1.5 pt-3">
        {/* Category / Sub-label */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            {product.category.name}
          </span>

          {/* Color Swatch Dots */}
          <div className="flex items-center gap-1" aria-label="Available colors">
            {COLOR_SWATCHES.map((swatch, idx) => (
              <button
                key={swatch.name}
                type="button"
                onClick={() => setSelectedColor(idx)}
                aria-label={`Select ${swatch.name}`}
                title={swatch.name}
                style={{ backgroundColor: swatch.hex }}
                className={`h-2.5 w-2.5 rounded-full transition-transform ${
                  selectedColor === idx
                    ? 'ring-1 ring-[var(--color-text-primary)] ring-offset-1'
                    : 'opacity-70 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Title */}
        <Link
          href={`/products/${product.slug}`}
          className="truncate text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-brand-600)]"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Price display */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            ${parseFloat(product.price).toFixed(2)}
          </span>
          <span className="text-xs text-[var(--color-text-muted)] line-through">
            ${(parseFloat(product.price) * 1.25).toFixed(2)}
          </span>
        </div>
      </div>
    </article>
  )
}

function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function PlaceholderIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}
