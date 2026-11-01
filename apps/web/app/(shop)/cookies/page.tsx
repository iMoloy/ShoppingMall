import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Preferences & Policy | Shopping Mall',
  description:
    'Understand how Shopping Mall uses cookies strictly for security, theme preferences, and essential shopping cart functionality.',
}

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
        <Link href="/" className="hover:text-[var(--color-text-primary)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)]">Cookie Policy</span>
      </nav>

      {/* Header */}
      <div className="border-b border-[var(--color-border)] pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
          Privacy &amp; Transparency
        </span>
        <h1 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
          Cookie Preferences &amp; Policy
        </h1>
        <p className="mt-3 text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
          Last Reviewed: November 2026
        </p>
      </div>

      <div className="mt-10 space-y-8 text-xs leading-relaxed text-[var(--color-text-muted)] sm:text-sm">
        <section>
          <h2 className="text-base font-bold uppercase text-[var(--color-text-primary)]">
            1. Strict Essential-Only Cookie Architecture
          </h2>
          <p className="mt-2">
            Unlike standard commercial retailers, Shopping Mall rejects intrusive third-party cross-site advertising cookies.
            We utilize cookies solely for functional integrity and user experience.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold uppercase text-[var(--color-text-primary)]">
            2. Categories of Cookies We Use
          </h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold uppercase text-[var(--color-text-primary)]">Strictly Essential Cookies</h3>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Always Active</span>
              </div>
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                Required for core authentication, CSRF security verification, and persistent shopping bag sessions.
                Without these, checkout and account sign-in cannot operate.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold uppercase text-[var(--color-text-primary)]">Theme &amp; Accessibility Preferences</h3>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Always Active</span>
              </div>
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                Stores your light/dark mode selection in `localStorage` to prevent visual screen flash when loading new pages.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold uppercase text-[var(--color-text-primary)]">
            3. How to Manage or Disable Cookies
          </h2>
          <p className="mt-2">
            You may block or delete cookies via your browser settings at any time. Please note that disabling essential cookies
            will prevent the shopping cart drawer and checkout flow from maintaining your session.
          </p>
        </section>
      </div>
    </div>
  )
}
