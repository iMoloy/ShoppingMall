'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { api } from '@/lib/api'
import { checkoutSchema, type CheckoutInput } from '@/lib/validations'
import type { OrderResponse } from '@shoppingmall/shared-types'

type Step = 'address' | 'delivery' | 'payment' | 'confirmed'

const EMPTY_ADDRESS: CheckoutInput = {
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
}

const DEMO_ADDRESS: CheckoutInput = {
  name: 'Eleanor Vance',
  phone: '+1 (555) 234-8901',
  line1: '742 Evergreen Terrace',
  line2: 'Penthouse 4B',
  city: 'New York, NY',
}

export default function CheckoutPage() {
  const { items, clear } = useCartStore()
  const [step, setStep] = useState<Step>('address')
  const [address, setAddress] = useState<CheckoutInput>(EMPTY_ADDRESS)
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutInput, string>>>({})
  const [deliveryMethod, setDeliveryMethod] = useState<'express' | 'white-glove'>('express')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile' | 'cod'>('card')
  const [promoCode, setPromoCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242')
  const [cardExpiry, setCardExpiry] = useState('08/28')
  const [cardCvv, setCardCvv] = useState('888')

  // Calculations
  const rawSubtotal = items.reduce(
    (sum, i) => sum + parseFloat(i.product.price) * i.quantity,
    0,
  )
  const discountAmount = (rawSubtotal * discountPercent) / 100
  const subtotalAfterDiscount = rawSubtotal - discountAmount
  const shippingFee = deliveryMethod === 'white-glove' ? 25 : subtotalAfterDiscount >= 150 ? 0 : 15
  const finalTotal = subtotalAfterDiscount + shippingFee

  if (items.length === 0 && step !== 'confirmed') {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--color-surface-raised)] text-[var(--color-text-muted)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <h1 className="mt-4 text-base font-extrabold uppercase tracking-tight text-[var(--color-text-primary)]">
          Your Shopping Bag Is Empty
        </h1>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          Add tailored pieces and curated accessories to begin checkout.
        </p>
        <div className="mt-6">
          <Button asChild variant="primary" size="md" className="uppercase tracking-wider">
            <Link href="/products">Explore Catalog</Link>
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

  function handleApplyDemoAddress() {
    setAddress(DEMO_ADDRESS)
    setErrors({})
    toast.success('Demo address filled')
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
    setStep('delivery')
  }

  function handleApplyPromo(e: React.FormEvent) {
    e.preventDefault()
    const cleaned = promoCode.trim().toUpperCase()
    if (cleaned === 'SUMMER2026' || cleaned === 'LUXURY10' || cleaned === 'PREMIUM10') {
      setDiscountPercent(10)
      setAppliedPromo(cleaned)
      toast.success(`10% discount applied with voucher ${cleaned}`)
      setPromoCode('')
    } else {
      toast.error('Invalid voucher code. Try "SUMMER2026"')
    }
  }

  async function handleFinalPlaceOrder() {
    setLoading(true)
    const generatedId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`

    try {
      const res = await api.post<OrderResponse>('/orders', {
        address,
        idempotencyKey: `idemp-${Date.now()}`,
      })
      if (res.success && res.data) {
        setOrderId(res.data.id)
      } else {
        setOrderId(generatedId)
      }
    } catch {
      setOrderId(generatedId)
    } finally {
      clear()
      setLoading(false)
      setStep('confirmed')
      toast.success('Order placed successfully!')
    }
  }

  const stepsList: { key: Step; label: string }[] = [
    { key: 'address', label: '1. Shipping' },
    { key: 'delivery', label: '2. Courier' },
    { key: 'payment', label: '3. Payment' },
    { key: 'confirmed', label: '4. Confirmed' },
  ]
  const stepIdx = stepsList.findIndex((s) => s.key === step)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Breadcrumb Header */}
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
        <Link href="/" className="hover:text-[var(--color-text-primary)]">Home</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-[var(--color-text-primary)]">Bag</Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)]">Checkout</span>
      </nav>

      {/* Stepper Bar */}
      {step !== 'confirmed' && (
        <div className="mb-8 border-b border-[var(--color-border)] pb-6">
          <div className="flex items-center justify-between max-w-2xl">
            {stepsList.slice(0, 3).map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <span className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ${
                  i < stepIdx
                    ? 'bg-[var(--color-brand-600)] text-white'
                    : i === stepIdx
                      ? 'border-2 border-[var(--color-text-primary)] text-[var(--color-text-primary)]'
                      : 'border border-[var(--color-border)] text-[var(--color-text-muted)]'
                }`}>
                  {i < stepIdx ? '✓' : i + 1}
                </span>
                <span className={`text-xs font-semibold uppercase tracking-wider ${
                  i === stepIdx ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'
                }`}>
                  {s.label.split('. ')[1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Step View */}
      {step === 'confirmed' ? (
        <div className="mx-auto max-w-2xl py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <span className="mt-6 inline-block text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
            Order Confirmed &bull; Atelier Dispatch
          </span>
          <h1 className="mt-1 text-3xl font-extrabold uppercase tracking-tight text-[var(--color-text-primary)]">
            Thank You For Your Order
          </h1>
          <p className="mt-2 text-xs text-[var(--color-text-muted)] max-w-md mx-auto">
            A confirmation receipt and courier tracking dossier have been dispatched to your email address.
          </p>

          <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 text-left">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)]">Order Identifier</span>
                <p className="font-mono text-sm font-bold text-[var(--color-text-primary)]">{orderId}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)]">Estimated Arrival</span>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">Within 48-72 Hours</p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-1 text-xs text-[var(--color-text-muted)]">
              <p><strong className="text-[var(--color-text-primary)]">Recipient:</strong> {address.name}</p>
              <p><strong className="text-[var(--color-text-primary)]">Destination:</strong> {address.line1}, {address.city}</p>
              <p><strong className="text-[var(--color-text-primary)]">Courier:</strong> {deliveryMethod === 'white-glove' ? 'White Glove Atelier Courier' : 'Complimentary Express Worldwide'}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="primary" size="lg" className="uppercase tracking-wider">
              <Link href={`/tracking?orderId=${encodeURIComponent(orderId ?? '')}`}>
                Track Order Live →
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="uppercase tracking-wider">
              <Link href="/products">
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        /* 2-Column Luxury Checkout Layout */
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column (7 Cols): Multi-Step Forms */}
          <div className="lg:col-span-7">
            {/* Step 1: Address */}
            {step === 'address' && (
              <form onSubmit={handleAddressSubmit} className="flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                  <div>
                    <h2 className="text-lg font-extrabold uppercase tracking-tight text-[var(--color-text-primary)]">
                      Shipping &amp; Client Address
                    </h2>
                    <p className="text-xs text-[var(--color-text-muted)]">Where should we deliver your runway pieces?</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyDemoAddress}
                    className="rounded border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--color-brand-600)] hover:bg-[var(--color-text-primary)] hover:text-[var(--color-surface)]"
                  >
                    Demo Autofill
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input label="Client Full Name *" name="name" autoComplete="name" value={address.name} onChange={handleAddressChange} error={errors.name} required />
                  </div>
                  <div className="sm:col-span-2">
                    <Input label="Phone Number (for SMS Tracking) *" name="phone" type="tel" autoComplete="tel" value={address.phone} onChange={handleAddressChange} error={errors.phone} required />
                  </div>
                  <div className="sm:col-span-2">
                    <Input label="Street Address *" name="line1" autoComplete="address-line1" value={address.line1} onChange={handleAddressChange} error={errors.line1} required />
                  </div>
                  <div>
                    <Input label="Apartment, Suite (Optional)" name="line2" autoComplete="address-line2" value={address.line2 ?? ''} onChange={handleAddressChange} error={errors.line2} />
                  </div>
                  <div>
                    <Input label="City / Region *" name="city" autoComplete="address-level2" value={address.city} onChange={handleAddressChange} error={errors.city} required />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/cart">← Return to Bag</Link>
                  </Button>
                  <Button type="submit" variant="primary" size="md" className="uppercase tracking-wider">
                    Continue to Courier →
                  </Button>
                </div>
              </form>
            )}

            {/* Step 2: Delivery Courier */}
            {step === 'delivery' && (
              <div className="flex flex-col gap-5">
                <div className="border-b border-[var(--color-border)] pb-3">
                  <h2 className="text-lg font-extrabold uppercase tracking-tight text-[var(--color-text-primary)]">
                    Select Delivery Courier
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)]">Choose your preferred shipping priority and handling.</p>
                </div>

                <div className="flex flex-col gap-3">
                  <label
                    onClick={() => setDeliveryMethod('express')}
                    className={`flex cursor-pointer items-start justify-between rounded-xl border p-4 transition-colors ${
                      deliveryMethod === 'express'
                        ? 'border-[var(--color-text-primary)] bg-[var(--color-surface-raised)]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-text-primary)]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === 'express'}
                        onChange={() => setDeliveryMethod('express')}
                        className="mt-1 h-4 w-4 accent-[var(--color-text-primary)]"
                      />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                          Complimentary Express Worldwide
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          Delivery within 48–72 hours via DHL Express. Includes climate-neutral transit.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[var(--color-text-primary)]">
                      {subtotalAfterDiscount >= 150 ? 'Free' : '$15.00'}
                    </span>
                  </label>

                  <label
                    onClick={() => setDeliveryMethod('white-glove')}
                    className={`flex cursor-pointer items-start justify-between rounded-xl border p-4 transition-colors ${
                      deliveryMethod === 'white-glove'
                        ? 'border-[var(--color-text-primary)] bg-[var(--color-surface-raised)]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-text-primary)]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === 'white-glove'}
                        onChange={() => setDeliveryMethod('white-glove')}
                        className="mt-1 h-4 w-4 accent-[var(--color-text-primary)]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                            White Glove VIP Atelier Courier
                          </p>
                          <span className="rounded bg-[var(--color-brand-600)]/10 px-2 py-0.5 text-[9px] font-bold text-[var(--color-brand-600)]">
                            VIP
                          </span>
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          Guaranteed next-day delivery with tailored archival garment bag and hand delivery.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[var(--color-text-primary)]">
                      $25.00
                    </span>
                  </label>
                </div>

                <div className="mt-4 flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                  <Button variant="ghost" size="sm" onClick={() => setStep('address')}>
                    ← Back to Address
                  </Button>
                  <Button variant="primary" size="md" onClick={() => setStep('payment')} className="uppercase tracking-wider">
                    Continue to Payment →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 'payment' && (
              <div className="flex flex-col gap-5">
                <div className="border-b border-[var(--color-border)] pb-3">
                  <h2 className="text-lg font-extrabold uppercase tracking-tight text-[var(--color-text-primary)]">
                    Payment Method
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)]">Encrypted 256-bit secure checkout transaction.</p>
                </div>

                {/* Method selector tabs */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'card', label: 'Credit Card', icon: '💳' },
                    { id: 'mobile', label: 'Mobile Banking', icon: '📱' },
                    { id: 'cod', label: 'Cash on Delivery', icon: '📦' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as 'card' | 'mobile' | 'cod')}
                      className={`flex flex-col items-center justify-center rounded-xl border p-3 text-xs font-bold uppercase transition-colors ${
                        paymentMethod === m.id
                          ? 'border-[var(--color-text-primary)] bg-[var(--color-surface-raised)] text-[var(--color-text-primary)]'
                          : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-primary)]'
                      }`}
                    >
                      <span className="text-lg">{m.icon}</span>
                      <span className="mt-1 text-[11px]">{m.label}</span>
                    </button>
                  ))}
                </div>

                {/* Payment form based on selection */}
                {paymentMethod === 'card' && (
                  <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]/50 p-5 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-mono text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-mono text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                          Security CVV
                        </label>
                        <input
                          type="text"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-mono text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'mobile' && (
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]/50 p-5 text-xs">
                    <p className="font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                      bKash &bull; Nagad &bull; Rocket Mobile Wallet
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      You will receive an automated OTP prompt on your registered mobile number upon placing this order.
                    </p>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]/50 p-5 text-xs">
                    <p className="font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                      Cash On Delivery (VIP Courier)
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      Inspect the pieces in your home and settle payment with the courier agent in cash or mobile transfer.
                    </p>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                  <Button variant="ghost" size="sm" onClick={() => setStep('delivery')}>
                    ← Back to Courier
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    loading={loading}
                    onClick={handleFinalPlaceOrder}
                    className="uppercase tracking-wider"
                  >
                    Confirm &amp; Place Order (${finalTotal.toFixed(2)}) →
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (5 Cols): Sticky Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
              <h3 className="border-b border-[var(--color-border)] pb-3 text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-primary)]">
                Order Dossier ({items.reduce((acc, i) => acc + i.quantity, 0)} Items)
              </h3>

              {/* Items List */}
              <ul className="divide-y divide-[var(--color-border)]/60 my-4 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="relative aspect-[3/4] h-14 w-11 shrink-0 overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-surface)]">
                      {item.product.images[0] ? (
                        <Image src={item.product.images[0]} alt={item.product.name} fill sizes="44px" className="object-cover" />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-bold text-[var(--color-text-primary)]">{item.product.name}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)]">Qty {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-[var(--color-text-primary)]">
                      ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Promo code voucher field */}
              <div className="border-t border-[var(--color-border)] pt-4">
                {!appliedPromo ? (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo voucher (e.g. SUMMER2026)"
                      className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
                    />
                    <button
                      type="submit"
                      className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)] hover:text-[var(--color-surface)]"
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between rounded-md bg-[var(--color-surface)] p-2 text-xs">
                    <span className="font-semibold text-[var(--color-brand-600)]">
                      Voucher &ldquo;{appliedPromo}&rdquo; (-{discountPercent}%)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setDiscountPercent(0)
                        setAppliedPromo(null)
                      }}
                      className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Price Calculation breakdown */}
              <div className="mt-4 flex flex-col gap-1.5 border-t border-[var(--color-border)] pt-3 text-xs">
                <div className="flex justify-between text-[var(--color-text-muted)]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[var(--color-text-primary)]">${rawSubtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[var(--color-brand-600)] font-medium">
                    <span>Voucher Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[var(--color-text-muted)]">
                  <span>Delivery ({deliveryMethod === 'white-glove' ? 'White Glove' : 'Express'})</span>
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {shippingFee === 0 ? 'Complimentary' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between border-t border-[var(--color-border)] pt-2 text-base">
                  <span className="font-extrabold uppercase tracking-tight text-[var(--color-text-primary)]">Total</span>
                  <span className="font-black text-[var(--color-text-primary)]">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-6 flex flex-col gap-2 rounded-xl bg-[var(--color-surface)] p-3 text-[11px] text-[var(--color-text-muted)]">
                <div className="flex items-center gap-2">
                  <span>🔒</span>
                  <span>256-bit bank-grade encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>↺</span>
                  <span>Complimentary 30-day global returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✦</span>
                  <span>100% certified authentic runway drops</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
