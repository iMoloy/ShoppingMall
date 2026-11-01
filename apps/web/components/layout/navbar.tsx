'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { useCartCount, useCartStore } from '@/store/cart'

const CATEGORY_LINKS = [
  { label: 'All Products', href: '/products' },
  { label: 'Bags', href: '/products?category=bags' },
  { label: 'Watches', href: '/products?category=watches' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const cartCount = useCartCount()
  const openCart = useCartStore((s) => s.openCart)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const query = searchQuery.trim()
    if (!query) {
      router.push('/products')
      return
    }
    router.push(`/products?q=${encodeURIComponent(query)}`)
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-md">
      {/* Top Announcement Bar */}
      <div className="bg-[var(--color-text-primary)] px-4 py-1.5 text-center text-[11px] font-medium tracking-wider uppercase text-[var(--color-surface)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between sm:justify-center sm:gap-6">
          <span>Premium Sale — Up to 35% Off Selected Items</span>
          <Link
            href="/products"
            className="hidden underline underline-offset-4 opacity-90 transition-opacity hover:opacity-100 sm:inline"
          >
            Shop Now →
          </Link>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile Menu Trigger & Desktop Search input */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-md text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)] lg:hidden"
          >
            {menuOpen ? <XIcon /> : <MenuIcon />}
          </button>

          {/* Interactive Search Bar on Desktop */}
          <form onSubmit={handleSearch} className="relative hidden items-center sm:flex">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              aria-label="Search catalog"
              className="h-9 w-44 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)]/70 pl-8 pr-3 text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all duration-150 focus:w-60 focus:border-[var(--color-text-primary)] focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="absolute left-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            >
              <SearchIcon />
            </button>
          </form>
        </div>

        {/* Center: Brand Logo */}
        <Link
          href="/"
          className="group flex flex-col items-center justify-center text-center"
        >
          <span className="text-lg font-bold uppercase tracking-[0.25em] text-[var(--color-text-primary)] transition-colors duration-150 group-hover:text-[var(--color-brand-600)] sm:text-xl">
            Shopping Mall
          </span>
          <span className="hidden text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--color-text-muted)] sm:block">
            Fashion &amp; Essentials
          </span>
        </Link>

        {/* Right: Actions (Theme, Orders, Cart, Auth) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          <Link
            href="/orders"
            aria-label="My Orders"
            className="hidden h-10 w-10 items-center justify-center rounded-md text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)] sm:flex"
            title="My Orders"
          >
            <OrderIcon />
          </Link>

          {/* Cart trigger button */}
          <button
            onClick={openCart}
            aria-label={`Open shopping cart, ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
            className="relative flex h-10 w-10 items-center justify-center rounded-md text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
          >
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-text-primary)] px-1 text-[10px] font-bold leading-none text-[var(--color-surface)]">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* Auth link */}
          <Link
            href="/login"
            className="ml-1 hidden rounded-md border border-[var(--color-border)] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] transition-colors duration-150 hover:bg-[var(--color-text-primary)] hover:text-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)] md:block"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* Desktop Sub-navigation category pills */}
      <div className="hidden border-t border-[var(--color-border)]/60 bg-[var(--color-surface)] py-2 lg:block">
        <ul className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-6 text-xs font-semibold uppercase tracking-wider">
          {CATEGORY_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={[
                  'transition-colors duration-150 hover:text-[var(--color-text-primary)]',
                  pathname === link.href
                    ? 'text-[var(--color-text-primary)] underline underline-offset-8'
                    : 'text-[var(--color-text-muted)]',
                ].join(' ')}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 lg:hidden">
          {/* Mobile Search input */}
          <form onSubmit={handleSearch} className="relative mb-4 flex items-center">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              aria-label="Search catalog"
              className="h-10 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] pl-9 pr-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-text-primary)]"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="absolute left-3 text-[var(--color-text-muted)]"
            >
              <SearchIcon />
            </button>
          </form>

          <ul className="flex flex-col gap-2">
            {CATEGORY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={[
                    'block rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150',
                    pathname === link.href
                      ? 'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)]'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-[var(--color-border)] pt-2 flex flex-col gap-1">
              <Link
                href="/orders"
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]"
              >
                My Orders
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]"
              >
                Sign in / Register
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

function CartIcon() {
  return (
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
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function SearchIcon() {
  return (
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function OrderIcon() {
  return (
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
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
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
  )
}
