'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import type { CartItemResponse, ProductListItem } from '@shoppingmall/shared-types'

interface QuickViewModalProps {
  product: ProductListItem | null
  isOpen: boolean
  onClose: () => void
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL']
const COLOR_VARIANTS = [
  { name: 'Onyx Noir', hex: '#1c1917' },
  { name: 'Warm Camel', hex: '#b45309' },
  { name: 'Deep Olive', hex: '#3f6212' },
]

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const { addItem, openCart } = useCartStore()

  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedColor, setSelectedColor] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

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

  if (!isOpen || !product) return null

  async function handleAddToCart() {
    if (!product) return
    setIsAdding(true)

    try {
      const res = await api.post<CartItemResponse>('/cart', {
        productId: product.id,
        quantity,
      })
      if (res.success && res.data) {
        addItem(res.data)
      } else {
        addItem({
          id: `cart-${product.id}`,
          quantity,
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
        quantity,
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
      onClose()
      openCart()
      toast.success(`${product.name} (${selectedSize}) added to bag`)
    }
  }

  const inStock = product.stock > 0
  const imageUrl = product.images[0] ?? null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog Content */}
      <div
        ref={modalRef}
        className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl md:flex-row"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-3.5 top-3.5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-surface)]/80 text-[var(--color-text-muted)] backdrop-blur-md transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Left Column: 3:4 Portrait Image */}
        <div className="relative aspect-[3/4] w-full shrink-0 md:w-1/2">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[var(--color-surface-raised)] text-xs text-[var(--color-text-muted)]">
              Editorial Studio Photo
            </div>
          )}
          <div className="absolute bottom-3 left-3 rounded bg-[var(--color-surface)]/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-primary)] backdrop-blur-sm">
            {product.category.name}
          </div>
        </div>

        {/* Right Column: Product Config & Add to Bag */}
        <div className="flex flex-1 flex-col justify-between overflow-y-auto p-6 sm:p-8">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
                Exclusive Edit
              </span>
              <span className="text-[11px] font-medium text-[var(--color-text-muted)]">
                {inStock ? `${product.stock} in stock` : 'Sold out'}
              </span>
            </div>

            <h2 className="mt-2 text-xl font-extrabold uppercase leading-snug tracking-tight text-[var(--color-text-primary)] sm:text-2xl">
              {product.name}
            </h2>

            {/* Price line */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-xl font-extrabold text-[var(--color-text-primary)]">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              <span className="text-sm text-[var(--color-text-muted)] line-through">
                ${(parseFloat(product.price) * 1.25).toFixed(2)}
              </span>
            </div>

            {/* Color Swatch Selector */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                <span>Color: {COLOR_VARIANTS[selectedColor]?.name}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                {COLOR_VARIANTS.map((swatch, idx) => (
                  <button
                    key={swatch.name}
                    type="button"
                    onClick={() => setSelectedColor(idx)}
                    aria-label={`Select ${swatch.name}`}
                    style={{ backgroundColor: swatch.hex }}
                    className={`h-6 w-6 rounded-full transition-transform ${
                      selectedColor === idx
                        ? 'ring-2 ring-[var(--color-text-primary)] ring-offset-2'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                <span>Select Size</span>
                <Link
                  href="/sizing-guide"
                  target="_blank"
                  className="text-[11px] text-[var(--color-brand-600)] hover:underline"
                >
                  Size Guide
                </Link>
              </div>
              <div className="mt-2 grid grid-cols-5 gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`flex h-10 items-center justify-center rounded-md text-xs font-bold uppercase transition-colors ${
                      selectedSize === size
                        ? 'bg-[var(--color-text-primary)] text-[var(--color-surface)]'
                        : 'border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-text-primary)]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="mt-5 flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Quantity:
              </span>
              <div className="flex h-9 items-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="flex h-9 w-9 items-center justify-center text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                >
                  −
                </button>
                <span className="w-8 text-center text-xs font-bold text-[var(--color-text-primary)]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  aria-label="Increase quantity"
                  className="flex h-9 w-9 items-center justify-center text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={isAdding || !inStock}
              className="w-full uppercase tracking-wider"
            >
              {isAdding ? 'Adding...' : inStock ? 'Add to Bag' : 'Out of Stock'}
            </Button>

            <Link
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="text-center text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:underline"
            >
              View Full Product Page →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
