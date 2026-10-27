import Link from 'next/link'
import { ThemeToggle } from '@/components/theme/theme-toggle'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--color-surface)]">
      <header className="flex h-14 items-center justify-between border-b border-[var(--color-border)] px-4 sm:px-6">
        <Link
          href="/"
          className="text-base font-semibold text-[var(--color-text-primary)] transition-colors duration-150 hover:text-[var(--color-brand-600)]"
        >
          Shopping Mall
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
