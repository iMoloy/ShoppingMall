import Link from 'next/link'
import { CurrencySelector } from '@/components/layout/currency-selector'

const FOOTER_SECTIONS = [
  {
    title: 'Collections',
    links: [
      { label: 'Runway Summer Edit', href: '/products' },
      { label: 'Bespoke Leather Bags', href: '/products?category=bags' },
      { label: 'Boutique Horology', href: '/products?category=watches' },
      { label: 'Tailored Clothing', href: '/products?category=clothing' },
      { label: 'Curated Accessories', href: '/products' },
    ],
  },
  {
    title: 'Client Services',
    links: [
      { label: 'Track Your Order', href: '/tracking' },
      { label: 'Shipping & Delivery', href: '/shipping' },
      { label: 'Returns & Exchanges', href: '/returns' },
      { label: 'Sizing & Care Guide', href: '/sizing-guide' },
      { label: 'Customer Concierge', href: '/contact' },
    ],
  },
  {
    title: 'The House',
    links: [
      { label: 'Our Story & Craft', href: '/about' },
      { label: 'Sustainability Commitment', href: '/sustainability' },
      { label: 'Stores & Stockists', href: '/stores' },
      { label: 'Press & Editorial', href: '/press' },
      { label: 'Careers at Atelier', href: '/careers' },
    ],
  },
  {
    title: 'Account & Orders',
    links: [
      { label: 'Sign In', href: '/login' },
      { label: 'Create Account', href: '/register' },
      { label: 'Saved Wishlist', href: '/wishlist' },
      { label: 'Order History', href: '/orders' },
      { label: 'Shopping Bag', href: '/cart' },
      { label: 'Admin Portal', href: '/dashboard' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      {/* Upper Footer: Brand Philosophy & Direct Client Help */}
      <div className="border-b border-[var(--color-border)]/70 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="text-sm font-extrabold uppercase tracking-[0.25em] text-[var(--color-text-primary)]">
                Shopping Mall
              </span>
              <p className="mt-1 text-xs text-[var(--color-text-muted)] max-w-lg leading-relaxed">
                An atelier of timeless fashion, architectural leathercraft, and precision horology.
                Crafted with deliberate restraint and honest pricing.
              </p>
            </div>

            {/* Direct Concierge Contact */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-[var(--color-text-muted)]">
              <div>
                <span className="font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
                  Client Concierge:
                </span>{' '}
                <a
                  href="mailto:support@shoppingmall.com"
                  className="hover:text-[var(--color-text-primary)] hover:underline"
                >
                  support@shoppingmall.com
                </a>
              </div>
              <div className="hidden sm:block text-[var(--color-border)]">•</div>
              <div>
                <span className="font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
                  Worldwide Delivery:
                </span>{' '}
                <span>Mon–Fri (48h Express)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links Columns */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-primary)]">
                {section.title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-text-primary)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Icons Strip in Footer */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border)]/70 pt-8">
          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            <span>Connect with Us:</span>
            <div className="flex items-center gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]"
              >
                <XIcon />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]"
              >
                <YouTubeIcon />
              </a>
            </div>
          </div>

          {/* Payment Guarantee & Currency Selector */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-muted)]">
            <CurrencySelector variant="footer" />
            <span className="rounded border border-[var(--color-border)] px-2.5 py-1 text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)]">
              256-Bit SSL Encrypted
            </span>
          </div>
        </div>

        {/* Bottom Legal Copyright */}
        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-[var(--color-border)]/50 pt-6 text-[11px] text-[var(--color-text-muted)] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Shopping Mall Studio Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="hover:text-[var(--color-text-primary)] hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[var(--color-text-primary)] hover:underline">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-[var(--color-text-primary)] hover:underline">
              Cookie Preferences
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function InstagramIcon() {
  return (
    <svg
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
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg
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
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg
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
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
    </svg>
  )
}
