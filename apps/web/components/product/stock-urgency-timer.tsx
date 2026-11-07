'use client'

import { useState, useEffect } from 'react'

interface Props {
  stock: number
}

export function StockUrgencyTimer({ stock }: Props) {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 })

  useEffect(() => {
    // Calculate countdown towards 17:00 (5:00 PM) atelier dispatch cutoff
    function updateCountdown() {
      const now = new Date()
      const cutoff = new Date()
      cutoff.setHours(17, 0, 0, 0)

      if (now > cutoff) {
        cutoff.setDate(cutoff.getDate() + 1)
      }

      const diffMs = cutoff.getTime() - now.getTime()
      const hours = Math.floor(diffMs / (1000 * 60 * 60))
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')
  const isLowStock = stock > 0 && stock <= 5

  return (
    <div className="bg-[var(--color-surface-raised)]/60 flex flex-col gap-2 rounded-xl border border-[var(--color-border)] p-3.5 text-xs">
      {/* Stock level indicator */}
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-sm ${
            isLowStock ? 'animate-pulse bg-amber-500' : stock > 0 ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        />
        <span className="font-semibold text-[var(--color-text-primary)]">
          {stock === 0
            ? 'Currently Sold Out — Join Waitlist'
            : isLowStock
              ? `Limited Availability — Only ${stock} pieces remaining in atelier`
              : 'In Stock — Handcrafted and ready for immediate courier dispatch'}
        </span>
      </div>

      {/* Countdown Timer */}
      {stock > 0 && (
        <div className="border-[var(--color-border)]/50 flex flex-wrap items-center gap-1.5 border-t pt-2 text-[11px] text-[var(--color-text-muted)]">
          <span>Order within</span>
          <span className="font-mono font-bold text-[var(--color-text-primary)]">
            {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s
          </span>
          <span>for guaranteed next-day atelier dispatch.</span>
        </div>
      )}
    </div>
  )
}
