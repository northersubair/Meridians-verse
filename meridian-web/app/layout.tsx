import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { PerformanceMonitor } from '@/components/performance-monitor'
import { PerformanceMonitor } from '@/components/performance-monitor'

// `display: 'swap'` keeps text visible with a fallback font while Geist
// loads, so web fonts never block first paint / LCP. (next/font defaults to
// swap; we set it explicitly to document the intent.)
// `preload: true` (default) tells Next.js to emit a <link rel="preload"> in
// the <head> for each font file, giving the browser an early fetch hint so
// text renders with the correct font before the main bundle arrives.
const _geist = Geist({ subsets: ["latin"], display: "swap", preload: true });
const _geistMono = Geist_Mono({ subsets: ["latin"], display: "swap", preload: true });

export const metadata: Metadata = {
  title: 'MERIDIAN - Where Effort Meets Value',
  description:
    'A productivity-powered on-chain economy platform combining focus, payment streams, and yield opportunities.',
  generator: 'v0.app',
  /**
   * Explicit metadataBase lets Next.js resolve relative OG image URLs to
   * absolute URLs at build time, which is required by social crawlers.
   * Replace with the real production origin before deploying.
   */
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://meridian.app',
  ),
  openGraph: {
    title: 'MERIDIAN - Where Effort Meets Value',
    description:
      'Earn by staying focused, stream payments in real-time, and participate in yield pools with zero loss.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MERIDIAN - Where Effort Meets Value',
    description:
      'Earn by staying focused, stream payments in real-time, and participate in yield pools with zero loss.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // suppressHydrationWarning is required by next-themes to avoid a
    // hydration mismatch when it writes the resolved theme class on
    // the <html> element during the initial client render.
    <html
      lang="en"
      className="bg-background"
      suppressHydrationWarning
    >
      <head>
        {/*
         * Preconnect to Google Fonts CDN so the TCP/TLS handshake is done
         * before the font CSS is requested.  This shaves ~100–300 ms off
         * the font load time on cold connections, which directly benefits LCP
         * when the heading is the largest contentful element.
         */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="meridian-theme"
          themes={['light', 'dark', 'system']}
        >
          {children}
          {/* Global toast outlet — required for `toast()` calls (e.g. the
              sign-in page) to actually render notifications. */}
          <Toaster />
          {/* Performance monitoring for Core Web Vitals */}
          <PerformanceMonitor />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
        {/* Monitor Core Web Vitals and report to analytics */}
        <PerformanceMonitor />
      </body>
    </html>
  )
}
