'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { api } from '@/lib/api'
import { checkoutSchema, type CheckoutInput } from '@/lib/validations'
import type { OrderResponse } from '@shoppingmall/shared-types'

type Step = 'address' | 'summary' | 'confirmed'

const EMPTY_ADDRESS: CheckoutInput = {
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
}

export default function CheckoutPage() {
  const { items, clear } = useCartStore()
  const [step, setStep] = useState<Step>('address')
  const [address, setAddress] = useState<CheckoutInput>(EMPTY_ADDRESS)
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutInput, string>>>({})
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const subtotal = items.reduce(
    (sum, i) => sum + parseFloat(i.product.price) * i.quantity,
    0,
  )

  if (items.length === 0 && step !== 'confirmed') {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <p className="text-sm font-medium text-[var(--color-text-primary)]">Your cart is empty</p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Add items before checking out.</p>
        <div className="mt-6">
          <Button asChild variant="primary">
            <Link href="/products">Browse products</Link>
          </Button>
        </div>
      </div>
    )
  }

  function handleAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setAddress((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof CheckoutInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = checkoutSchema.safeParse(address)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CheckoutInput, string>> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CheckoutInput
        if (field && !fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }
    setStep('summary')
  }

  async function handlePlaceOrder() {
    setLoading(true)
    try {
      const res = await api.post<OrderResponse>('/orders', {
        address,
        // idempotencyKey generated client-side — server will also validate
        idempotencyKey: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      })

      if (!res.success) {
        toast.error(res.error?.message || 'Order failed. Please try again.')
        return
      }

      setOrderId(res.data.id)
      clear()
      setStep('confirmed')
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step indicator
  const steps: { key: Step; label: string }[] = [
    { key: 'address', label: 'Address' },
    { key: 'summary', label: 'Review' },
    { key: 'confirmed', label: 'Confirmed' },
  ]
  const stepIndex = steps.findIndex((s) => s.key === step)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* Step indicator */}
      <nav aria-label="Checkout steps" className="mb-8">
        <ol className="flex items-center gap-0">
          {steps.map((s, i) => (
            <li key={s.key} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <span
                  className={[
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium',
                    i < stepIndex
                      ? 'bg-[var(--color-brand-600)] text-white'
                      : i === stepIndex
                        ? 'border-2 border-[var(--color-brand-600)] text-[var(--color-brand-600)]'
                        : 'border-2 border-[var(--color-border)] text-[var(--color-text-muted)]',
                  ].join(' ')}
                >
                  {i < stepIndex ? '✓' : i + 1}
                </span>
                <span
                  className={[
                    'text-xs',
                    i === stepIndex ? 'font-medium text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]',
                  ].join(' ')}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={[
                    'mb-5 flex-1 border-t',
                    i < stepIndex ? 'border-[var(--color-brand-600)]' : 'border-[var(--color-border)]',
                  ].join(' ')}
                />
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
        {/* Main panel */}
        <div className="md:col-span-3">
          {/* Step 1: Address */}
          {step === 'address' && (
            <form onSubmit={handleAddressSubmit} className="flex flex-col gap-4">
              <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Delivery address
              </h1>

              <Input label="Full name" name="name" autoComplete="name" value={address.name} onChange={handleAddressChange} error={errors.name} required />
              <Input label="Phone number" name="phone" type="tel" autoComplete="tel" value={address.phone} onChange={handleAddressChange} error={errors.phone} required />
              <Input label="Address line 1" name="line1" autoComplete="address-line1" value={address.line1} onChange={handleAddressChange} error={errors.line1} required />
              <Input label="Address line 2 (optional)" name="line2" autoComplete="address-line2" value={address.line2 ?? ''} onChange={handleAddressChange} error={errors.line2} />
              <Input label="City" name="city" autoComplete="address-level2" value={address.city} onChange={handleAddressChange} error={errors.city} required />

              <div className="mt-2 flex gap-3">
                <Button asChild variant="ghost">
                  <Link href="/cart">← Back to cart</Link>
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Continue to review
                </Button>
              </div>
            </form>
          )}

          {/* Step 2: Summary */}
          {step === 'summary' && (
            <div className="flex flex-col gap-4">
              <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Review your order
              </h1>

              {/* Address summary */}
              <div className="rounded-lg border border-[var(--color-border)] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Delivery to</p>
                  <button onClick={() => setStep('address')} className="text-xs text-[var(--color-brand-600)] hover:underline">Edit</button>
                </div>
                <p className="text-sm text-[var(--color-text-primary)]">{address.name}</p>
                <p className="text-sm text-[var(--color-text-muted)]">{address.phone}</p>
                <p className="text-sm text-[var(--color-text-muted)]">{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
                <p className="text-sm text-[var(--color-text-muted)]">{address.city}</p>
              </div>

              {/* Items */}
              <div className="rounded-lg border border-[var(--color-border)] p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Items</p>
                <ul className="flex flex-col gap-3">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm text-[var(--color-text-primary)]">{item.product.name}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">Qty {item.quantity}</p>
                      </div>
                      <p className="shrink-0 text-sm font-medium text-[var(--color-text-primary)]">
                        ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-2 flex gap-3">
                <Button variant="ghost" onClick={() => setStep('address')}>← Back</Button>
                <Button
                  variant="primary"
                  loading={loading}
                  className="flex-1"
                  onClick={handlePlaceOrder}
                >
                  Place order
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmed */}
          {step === 'confirmed' && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">Order placed!</h1>
              <p className="max-w-xs text-sm text-[var(--color-text-muted)]">
                Your order has been received. You&apos;ll get a confirmation email shortly.
              </p>
              {orderId && (
                <p className="text-xs text-[var(--color-text-muted)]">
                  Order ID: <span className="font-mono">{orderId}</span>
                </p>
              )}
              <div className="mt-4 flex gap-3">
                <Button asChild variant="secondary">
                  <Link href="/orders">View orders</Link>
                </Button>
                <Button asChild variant="primary">
                  <Link href="/products">Continue shopping</Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        {step !== 'confirmed' && (
          <div className="md:col-span-2">
            <div className="rounded-lg border border-[var(--color-border)] p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Order summary
              </p>
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate text-[var(--color-text-muted)]">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="shrink-0 text-[var(--color-text-primary)]">
                      ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-[var(--color-border)] pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">Subtotal</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  Shipping calculated at delivery
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
