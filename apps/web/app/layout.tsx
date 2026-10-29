import type { Metadata } from 'next'
import { ToastContainer } from '@/components/ui/toast'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Shopping Mall',
    template: '%s | Shopping Mall',
  },
  description: 'Discover bags, watches, and accessories at the best prices.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'Shopping Mall',
    description: 'Discover bags, watches, and accessories at the best prices.',
    siteName: 'Shopping Mall',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shopping Mall',
    description: 'Discover bags, watches, and accessories at the best prices.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Inline script runs before paint — reads localStorage and applies
          the "dark" class to <html> to avoid flash of wrong theme.
          This must be a raw <script> tag, not a Next.js Script component,
          so it blocks rendering synchronously.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var stored = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (stored === 'dark' || (!stored && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (_) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  )
}
