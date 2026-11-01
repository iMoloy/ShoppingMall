'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  initialQuery?: string
}

export function ProductSearchBar({ initialQuery = '' }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery)
  const [isPending, startTransition] = useTransition()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    applySearch(query)
  }

  function applySearch(newQuery: string) {
    const params = new URLSearchParams(searchParams.toString())
    const trimmed = newQuery.trim()
    if (trimmed) {
      params.set('q', trimmed)
    } else {
      params.delete('q')
    }
    // Reset cursor on new search
    params.delete('cursor')

    startTransition(() => {
      router.push(`/products?${params.toString()}`)
    })
  }

  function handleClear() {
    setQuery('')
    applySearch('')
  }

  return (
    <form onSubmit={handleSearch} className="relative flex w-full max-w-md items-center">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter by name, brand, or style..."
        aria-label="Filter products"
        className="h-10 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] pl-9 pr-9 text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-text-primary)] focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute left-3 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>

      {query && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 flex h-5 w-5 items-center justify-center rounded text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}

      {isPending && (
        <span className="sr-only" role="status">
          Searching...
        </span>
      )}
    </form>
  )
}
