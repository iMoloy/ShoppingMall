'use client'

import Link from 'next/link'

interface SocialLink {
  name: string
  href: string
  icon: (props: { className?: string }) => React.JSX.Element
  colorHover: string
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    colorHover: 'hover:text-[#E4405F]',
    icon: ({ className }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    colorHover: 'hover:text-[#1877F2]',
    icon: ({ className }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    name: 'X (Twitter)',
    href: 'https://twitter.com',
    colorHover: 'hover:text-[var(--color-text-primary)]',
    icon: ({ className }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com',
    colorHover: 'hover:text-[#FF0000]',
    icon: ({ className }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
      </svg>
    ),
  },
]

export function SocialSidebar() {
  return (
    <aside
      aria-label="Social links"
      className="fixed left-2 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-md transition-all duration-200 xl:flex"
    >
      {SOCIAL_LINKS.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow us on ${item.name}`}
            className={`group relative flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--color-surface-raised)] ${item.colorHover} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]`}
          >
            <Icon className="h-5 w-5" />
            <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-[var(--color-text-primary)] px-2 py-1 text-xs font-medium text-[var(--color-surface)] opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100">
              {item.name}
            </span>
          </Link>
        )
      })}
    </aside>
  )
}
