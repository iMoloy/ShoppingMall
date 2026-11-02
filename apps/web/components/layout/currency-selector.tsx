'use client'

import { useCurrencyStore, CURRENCIES, type CurrencyCode } from '@/store/currency'

interface Props {
  variant?: 'minimal' | 'footer'
}

export function CurrencySelector({ variant = 'minimal' }: Props) {
  const current = useCurrencyStore((s) => s.current)
  const setCurrency = useCurrencyStore((s) => s.setCurrency)

  if (variant === 'footer') {
    return (
      <div className="flex items-center gap-2 text-xs">
        <label htmlFor="footer-currency-select" className="text-[var(--color-text-muted)]">
          Region &amp; Currency:
        </label>
        <select
          id="footer-currency-select"
          value={current}
          onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
          className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-xs font-semibold text-[var(--color-text-primary)] hover:border-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
        >
          {Object.values(CURRENCIES).map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} ({c.symbol}) — {c.name}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
      <label htmlFor="top-currency-select" className="sr-only">
        Select Currency
      </label>
      <select
        id="top-currency-select"
        value={current}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        className="cursor-pointer rounded bg-transparent px-1.5 py-0.5 text-[11px] font-bold text-inherit transition-opacity hover:opacity-80 focus-visible:outline-none"
      >
        {Object.values(CURRENCIES).map((c) => (
          <option key={c.code} value={c.code} className="bg-[var(--color-surface)] text-[var(--color-text-primary)]">
            {c.code} ({c.symbol})
          </option>
        ))}
      </select>
    </div>
  )
}
