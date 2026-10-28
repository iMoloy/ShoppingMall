'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { api } from '@/lib/api'

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore()
  const overlayRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  // Trap focus inside drawer when open
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
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, closeCart])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  async function handleQuantityChange(itemId: string, quantity: number) {
    if (quantity < 1) {
      await handleRemove(itemId)
      return
    }
    const res = await api.patch(`/cart/${itemId}`, { quantity })
    if (res.success) {
      updateQuantity(itemId, quantity)
    } else {
      toast.error('Could not update quantity')
    }
  }

  async function handleRemove(itemId: string) {
    const res = await api.delete(`/cart/${itemId}`)
    if (res.success) {
      removeItem(itemId)
    } else {
      toast.error('Could not remove item')
    }
  }

  const subtotal = items.reduce(
    (sum, i) => sum + parseFloat(i.product.price) * i.quantity,
    0,
  )

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          ref={overlayRef}
          onClick={closeCart}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/30"
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={[
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-[var(--color-surface)] shadow-xl transition-transform duration-200',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-4">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
            Cart ({items.length})
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">Your cart is empty</p>
              <p className="text-xs text-[var(--color-text-muted)]">Add something to get started</p>
              <Button variant="secondary" size="sm" onClick={closeCart} asChild>
                <Link href="/products">Browse products</Link>
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4" aria-label="Cart items">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  {/* Image */}
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col gap-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      onClick={closeCart}
                      className="line-clamp-2 text-sm font-medium text-[var(--color-text-primary)] hover:underline"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      ${parseFloat(item.product.price).toFixed(2)}
                    </p>

                    {/* Quantity controls */}
                    <div className="mt-auto flex items-center gap-2">
                      <div className="flex items-center rounded-md border border-[var(--color-border)]">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="flex h-7 w-7 items-center justify-center text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs text-[var(--color-text-primary)]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="flex h-7 w-7 items-center justify-center text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        aria-label={`Remove ${item.product.name}`}
                        className="ml-auto text-xs text-[var(--color-text-muted)] transition-colors duration-150 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[var(--color-border)] px-4 py-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-muted)]">Subtotal</span>
              <span className="text-base font-semibold text-[var(--color-text-primary)]">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <Button asChild variant="primary" className="w-full">
              <Link href="/checkout" onClick={closeCart}>
                Proceed to checkout
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
