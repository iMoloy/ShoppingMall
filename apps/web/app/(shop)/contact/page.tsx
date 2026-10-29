'use client'

import { useState } from 'react'
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
    await new Promise((r) => setTimeout(r, 500))
    setLoading(false)
    setFormData({ name: '', email: '', subject: '', message: '' })
    toast.success('Your message has been sent. We will respond within 24 hours.')
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
          Contact Us
        </h1>
        <p className="mt-3 text-base text-[var(--color-text-muted)]">
          Have a question about an order, product specs, or bulk inquiries? We’re here to help.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-12">
        {/* Contact Information Cards */}
        <div className="space-y-6 md:col-span-5">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Customer Support</h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Email: support@shoppingmall.com
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Hours: Sunday – Thursday, 9 AM – 8 PM
            </p>
          </div>

          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Headquarters</h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Shopping Mall Headquarters
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Dhaka, Bangladesh
            </p>
          </div>

          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Warranty & Returns</h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              7-day replacement guarantee on all manufacturing defects.
            </p>
          </div>
        </div>

        {/* Message Form */}
        <div className="md:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8"
          >
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Send a Message</h2>

            <Input
              label="Your Name"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Subject"
              name="subject"
              placeholder="Order inquiry, product question..."
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <Textarea
              label="Message"
              name="message"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
              required
            />

            <Button type="submit" variant="primary" loading={loading} className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
