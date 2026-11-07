'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Simulate submission
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    setFormData({ name: '', email: '', subject: '', message: '' })
    toast.success('Your inquiry has been received. Our concierge will reply within 24 hours.')
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]"
      >
        <Link href="/" className="hover:text-[var(--color-text-primary)]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)]">Client Concierge</span>
      </nav>

      {/* Header */}
      <div className="border-b border-[var(--color-border)] pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
          Atelier Client Relations
        </span>
        <h1 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
          Customer Concierge
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
          Have an inquiry regarding custom sizing, private appointments, order tracking, or bespoke
          orders? Our dedicated client specialists are at your disposal.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-12">
        {/* Contact Information Cards */}
        <div className="space-y-6 md:col-span-5">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
              Direct Contact
            </span>
            <h2 className="mt-2 text-base font-bold uppercase text-[var(--color-text-primary)]">
              Client Support
            </h2>
            <p className="mt-3 text-xs text-[var(--color-text-muted)]">
              Email:{' '}
              <a
                href="mailto:support@shoppingmall.com"
                className="font-semibold text-[var(--color-text-primary)] hover:underline"
              >
                support@shoppingmall.com
              </a>
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Hours: Monday – Friday, 9:00 AM – 8:00 PM EST
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
              Global Atelier
            </span>
            <h2 className="mt-2 text-base font-bold uppercase text-[var(--color-text-primary)]">
              Headquarters &amp; Studio
            </h2>
            <p className="mt-3 text-xs font-medium text-[var(--color-text-primary)]">
              Shopping Mall Atelier Studio Inc.
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">New York • London • Paris</p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
              Guaranteed Security
            </span>
            <h2 className="mt-2 text-base font-bold uppercase text-[var(--color-text-primary)]">
              30-Day Returns &amp; Warranty
            </h2>
            <p className="mt-3 text-xs text-[var(--color-text-muted)]">
              Complimentary pre-paid return labels and 2-year horology movement warranty.
            </p>
          </div>
        </div>

        {/* Message Form */}
        <div className="md:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 sm:p-8"
          >
            <h2 className="text-lg font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              Send a Direct Inquiry
            </h2>

            <Input
              label="Full Name"
              name="name"
              placeholder="e.g. Eleanor Vance"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="eleanor@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Subject / Topic"
              name="subject"
              placeholder="e.g. Bespoke Sizing Inquiry / Order #1042"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <Textarea
              label="Message"
              name="message"
              placeholder="Detail your request or order questions..."
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full text-xs font-bold uppercase tracking-wider"
            >
              Dispatch Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
