import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import { PostHogProvider } from '@/components/PostHogProvider'
import { ToastProvider } from '@/components/Toast'
import { SiteHeader } from '@/components/SiteHeader'
import { Footer } from '@/components/Footer'
import { AuthEvents } from '@/components/AuthEvents'
import { getIsAuthed } from '@/lib/prompts'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-fraunces',
  display: 'swap',
})
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
const description =
  'Curated AI prompts for marketing, brand, and product leaders.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'House Style', template: '%s' },
  description,
  openGraph: {
    title: 'House Style',
    description,
    siteName: 'House Style',
    type: 'website',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'House Style',
    description,
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthed = await getIsAuthed()

  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <PostHogProvider>
          <ToastProvider>
            <AuthEvents isAuthed={isAuthed} />
            <SiteHeader />
            {children}
            <Footer />
          </ToastProvider>
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  )
}
