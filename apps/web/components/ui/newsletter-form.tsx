'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    // Simulate brief network submission or forward to api when backend ready
    await new Promise((resolve) => setTimeout(resolve, 400))
    setLoading(false)
    setEmail('')
    toast.success('Thank you for subscribing!')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
        className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand-600)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-600)] sm:text-sm"
      />
      <Button type="submit" variant="primary" loading={loading} className="shrink-0">
        Subscribe
      </Button>
    </form>
  )
}
