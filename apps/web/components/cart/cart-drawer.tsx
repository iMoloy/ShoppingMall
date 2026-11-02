'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { api } from '@/lib/api'
import type { CartItemResponse } from '@shoppingmall/shared-types'

const FREE_SHIPPING_THRESHOLD = 150

interface UpsellItem {
  id: string
  name: string
  price: number
  category: string
  image: string
}

const CURATED_ADDONS: UpsellItem[] = [
  {
    id: 'addon-leather-cream',
    name: 'Organic Leather Nourishing Cream',
    price: 18,
    category: 'Care',
    image:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'addon-cashmere-comb',
    name: 'Fine Cashmere Cedar Comb',
    price: 22,
    category: 'Essential',
    image:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'addon-garment-cover',
    name: 'Archival Linen Garment Cover',
    price: 28,
    category: 'Storage',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=80',
  },
]

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, addItem } = useCartStore()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Promo code state
  const [promoOpen, setPromoOpen] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState<number>(0)
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)

  // Focus trap
  useEffect(() => {
    if (!isOpen) return
    const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])',
    )
    focusable?.[0]?.focus()
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, closeCart])

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

  async function handleQuantityChange(itemId: string, quantity: number) {
    if (quantity < 1) {
      await handleRemove(itemId)
      return
    }
    updateQuantity(itemId, quantity)
    try {
      await api.patch(`/cart/${itemId}`, { quantity })
    } catch {
      // Offline fallback: store state is updated optimistically
    }
  }

  async function handleRemove(itemId: string) {
    removeItem(itemId)
    toast.success('Item removed from bag')
    try {
      await api.delete(`/cart/${itemId}`)
    } catch {
      // Offline fallback: store state is updated optimistically
    }
  }

  function handleAddCuratedItem(addon: UpsellItem) {
    const newItem: CartItemResponse = {
      id: `cart-${addon.id}`,
      quantity: 1,
      product: {
        id: addon.id,
        name: addon.name,
        slug: addon.id,
        price: addon.price.toFixed(2),
        images: [addon.image],
        stock: 50,
        category: {
          id: `cat-${addon.category.toLowerCase()}`,
          name: addon.category,
          slug: addon.category.toLowerCase(),
        },
      },
    }
    addItem(newItem)
    toast.success(`${addon.name} added to bag`)
  }

  function handleApplyPromo(e: React.FormEvent) {
    e.preventDefault()
    const cleaned = promoCode.trim().toUpperCase()
    if (cleaned === 'SUMMER2026' || cleaned === 'LUXURY10' || cleaned === 'PREMIUM10') {
      setDiscountPercent(10)
      setAppliedPromo(cleaned)
      toast.success(`10% discount applied with code ${cleaned}`)
      setPromoCode('')
    } else {
      toast.error('Invalid promo code. Try "SUMMER2026"')
    }
  }

  function handleRemovePromo() {
    setDiscountPercent(0)
    setAppliedPromo(null)
    toast.success('Promo code removed')
  }

  // Calculations
  const rawSubtotal = items.reduce(
    (sum, i) => sum + parseFloat(i.product.price) * i.quantity,
    0,
  )
  const discountAmount = (rawSubtotal * discountPercent) / 100
  const subtotalAfterDiscount = rawSubtotal - discountAmount
  const qualifiesForFreeShipping = subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalAfterDiscount)
  const shippingProgress = Math.min(
    100,
    Math.round((subtotalAfterDiscount / FREE_SHIPPING_THRESHOLD) * 100),
  )
  const estimatedShipping = rawSubtotal === 0 || qualifiesForFreeShipping ? 0 : 15
  const estimatedTotal = subtotalAfterDiscount + estimatedShipping

  return (
    <>
      {/* Backdrop with fade transition */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-over Drawer Panel */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Bag"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[var(--color-surface)] shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <div className="flex items-baseline gap-2">
            <h2 className="text-base font-extrabold uppercase tracking-tight text-[var(--color-text-primary)]">
              Shopping Bag
            </h2>
            <span className="text-xs font-semibold text-[var(--color-text-muted)]">
              ({items.reduce((acc, i) => acc + i.quantity, 0)} items)
            </span>
          </div>

          <button
            onClick={closeCart}
            aria-label="Close shopping bag"
            className="flex h-11 w-11 items-center justify-center rounded-md text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
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
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)]/50 px-5 py-3">
          <div className="mb-2 flex items-center justify-between text-xs">
            {qualifiesForFreeShipping ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-[var(--color-text-primary)]">
                <svg
                  className="h-4 w-4 text-[var(--color-brand-600)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Complimentary Express Delivery unlocked</span>
              </span>
            ) : (
              <span className="text-[var(--color-text-muted)]">
                Add{' '}
                <strong className="font-semibold text-[var(--color-text-primary)]">
                  ${remainingForFreeShipping.toFixed(2)}
                </strong>{' '}
                more for Complimentary Delivery
              </span>
            )}
            <span className="font-bold text-[var(--color-text-primary)]">
              ${FREE_SHIPPING_THRESHOLD}
            </span>
          </div>

          {/* Progress bar track */}
          <div
            className="h-1.5 w-full overflow-hidden rounded bg-[var(--color-border)]"
            role="progressbar"
            aria-valuenow={shippingProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Free shipping progress"
          >
            <div
              className="h-full bg-[var(--color-text-primary)] transition-all duration-300 ease-out"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        {/* Scrollable Items Container */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--color-surface-raised)] text-[var(--color-text-muted)]">
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
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                Your Bag Is Empty
              </h3>
              <p className="max-w-xs text-xs leading-relaxed text-[var(--color-text-muted)]">
                Discover our curated summer drop and architectural leather accessories.
              </p>
              <Button variant="primary" size="md" onClick={closeCart} asChild className="mt-2">
                <Link href="/products">Explore The Drop</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Product List */}
              <ul className="divide-y divide-[var(--color-border)]" aria-label="Bag items">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    {/* 3:4 Portrait Thumbnail */}
                    <Link
                      href={`/products/${item.product.slug}`}
                      onClick={closeCart}
                      className="group relative aspect-[3/4] h-24 w-18 shrink-0 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)]"
                    >
                      {item.product.images[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          sizes="72px"
                          className="object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-[var(--color-text-muted)]">
                          Editorial
                        </div>
                      )}
                    </Link>

                    {/* Details & Controls */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/products/${item.product.slug}`}
                            onClick={closeCart}
                            className="line-clamp-2 text-xs font-bold uppercase tracking-tight text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-brand-600)]"
                          >
                            {item.product.name}
                          </Link>

                          {/* Delete Item Button */}
                          <button
                            onClick={() => handleRemove(item.id)}
                            aria-label={`Remove ${item.product.name}`}
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-red-500"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
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
                        </div>

                        <p className="mt-1 text-xs font-semibold text-[var(--color-text-primary)]">
                          ${parseFloat(item.product.price).toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Stepper (Accessible 36px buttons) */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex h-8 items-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="flex h-8 w-8 items-center justify-center text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
                          >
                            −
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-[var(--color-text-primary)]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="flex h-8 w-8 items-center justify-center text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs font-bold text-[var(--color-text-primary)]">
                          ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* In-Drawer Curated Add-ons Strip ("Complete The Look") */}
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]/60 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
                    Complete The Look
                  </span>
                  <span className="text-[10px] uppercase text-[var(--color-text-muted)]">
                    Curated Accents
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {CURATED_ADDONS.map((addon) => (
                    <div
                      key={addon.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-border)]/60 bg-[var(--color-surface)] p-2 transition-colors hover:border-[var(--color-border)]"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={addon.image}
                          alt={addon.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-xs font-medium text-[var(--color-text-primary)]">
                          {addon.name}
                        </p>
                        <p className="text-[11px] font-bold text-[var(--color-text-muted)]">
                          ${addon.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddCuratedItem(addon)}
                        className="flex h-8 items-center gap-1 rounded border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2.5 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-text-primary)] hover:text-[var(--color-surface)]"
                      >
                        <span>Add</span>
                        <span>+</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {items.length > 0 && (
          <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4">
            {/* Promo Code Accordion */}
            <div className="mb-4">
              {!appliedPromo ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setPromoOpen(!promoOpen)}
                    className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                  >
                    <span>Have a promo voucher?</span>
                    <span>{promoOpen ? '−' : '+'}</span>
                  </button>

                  {promoOpen && (
                    <form onSubmit={handleApplyPromo} className="mt-2.5 flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="e.g. SUMMER2026"
                        className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-xs uppercase text-[var(--color-text-primary)] placeholder:normal-case placeholder:text-[var(--color-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
                      />
                      <button
                        type="submit"
                        className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)] hover:text-[var(--color-surface)]"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-md bg-[var(--color-surface-raised)] px-3 py-2 text-xs">
                  <span className="font-semibold text-[var(--color-brand-600)]">
                    Code &ldquo;{appliedPromo}&rdquo; (-{discountPercent}%)
                  </span>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="text-[11px] uppercase font-bold text-[var(--color-text-muted)] hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="flex flex-col gap-1.5 border-t border-[var(--color-border)]/60 pt-3 text-xs">
              <div className="flex justify-between text-[var(--color-text-muted)]">
                <span>Subtotal</span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  ${rawSubtotal.toFixed(2)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[var(--color-brand-600)] font-medium">
                  <span>Voucher Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-[var(--color-text-muted)]">
                <span>Estimated Shipping</span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  {qualifiesForFreeShipping ? 'Complimentary' : `$${estimatedShipping.toFixed(2)}`}
                </span>
              </div>

              <div className="mt-1 flex items-baseline justify-between border-t border-[var(--color-border)] pt-2 text-sm">
                <span className="font-extrabold uppercase tracking-tight text-[var(--color-text-primary)]">
                  Total
                </span>
                <span className="text-base font-extrabold text-[var(--color-text-primary)]">
                  ${estimatedTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Action CTA */}
            <div className="mt-4 flex flex-col gap-2">
              <Button asChild variant="primary" size="lg" className="w-full uppercase tracking-wider">
                <Link href="/checkout" onClick={closeCart}>
                  Proceed to Checkout →
                </Link>
              </Button>

              <div className="flex items-center justify-center gap-4 pt-2 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                <span className="inline-flex items-center gap-1">
                  <span>🔒</span>
                  <span>SSL Encrypted</span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <span>↺</span>
                  <span>30-Day Returns</span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <span>✦</span>
                  <span>Authentic</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
