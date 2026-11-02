'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { CurrencySelector } from '@/components/layout/currency-selector'
import { HeaderSearch } from '@/components/layout/header-search'
import { useCartCount, useCartStore } from '@/store/cart'
import { useWishlistCount } from '@/store/wishlist'

const CATEGORY_LINKS = [
  { label: 'All Products', href: '/products' },
  { label: 'Bags', href: '/products?category=bags' },
  { label: 'Watches', href: '/products?category=watches' },
  { label: 'Lookbook', href: '/lookbook' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const cartCount = useCartCount()
  const wishlistCount = useWishlistCount()
  const openCart = useCartStore((s) => s.openCart)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-md">
      {/* Top Announcement Bar with Currency Switcher */}
      <div className="bg-[var(--color-text-primary)] px-4 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--color-surface)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <span>Premium Sale — Up to 35% Off Selected Items</span>
            <Link
              href="/products"
              className="hidden underline underline-offset-4 opacity-90 transition-opacity hover:opacity-100 sm:inline"
            >
              Shop Now →
            </Link>
          </div>
          <CurrencySelector variant="minimal" />
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

          {/* Interactive Predictive Search Bar on Desktop */}
          <div className="hidden sm:block">
            <HeaderSearch />
          </div>
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

          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            aria-label={`Wishlist, ${wishlistCount} item${wishlistCount !== 1 ? 's' : ''}`}
            className="relative flex h-10 w-10 items-center justify-center rounded-md text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
            title="My Wishlist"
          >
            <HeartNavIcon />
            {wishlistCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-md bg-[var(--color-brand-600)] px-1 text-[10px] font-bold leading-none text-white">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart trigger button */}
          <button
            onClick={openCart}
            aria-label={`Open shopping cart, ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
            className="relative flex h-10 w-10 items-center justify-center rounded-md text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
          >
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-md bg-[var(--color-text-primary)] px-1 text-[10px] font-bold leading-none text-[var(--color-surface)]">
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
          {/* Mobile Search input with predictive results */}
          <div className="mb-4">
            <HeaderSearch onSelect={() => setMenuOpen(false)} />
          </div>

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

function HeartNavIcon() {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
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
