'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { useCartCount, useCartStore } from '@/store/cart'

const NAV_LINKS = [
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const cartCount = useCartCount()
  const openCart = useCartStore((s) => s.openCart)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-base font-semibold text-[var(--color-text-primary)] transition-colors duration-150 hover:text-[var(--color-brand-600)]"
        >
          Shopping Mall
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={[
                  'text-sm transition-colors duration-150',
                  pathname.startsWith(link.href)
                    ? 'font-medium text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
                ].join(' ')}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle />

          {/* Cart button */}
          <button
            onClick={openCart}
            aria-label={`Open cart, ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
            className="relative flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
          >
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-brand-600)] text-[10px] font-medium leading-none text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* Auth link — desktop */}
          <Link
            href="/login"
            className="ml-2 hidden rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors duration-150 hover:bg-[var(--color-surface-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)] sm:block"
          >
            Sign in
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)] sm:hidden"
          >
            {menuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 pb-4 sm:hidden">
          <ul className="mt-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={[
                    'block rounded-md px-3 py-2 text-sm transition-colors duration-150',
                    pathname.startsWith(link.href)
                      ? 'bg-[var(--color-surface-raised)] font-medium text-[var(--color-text-primary)]'
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
                className="block rounded-md px-3 py-2 text-sm text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]"
              >
                My Orders
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]"
              >
                Sign in
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
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
