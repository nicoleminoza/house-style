import type { Metadata } from 'next'
import { Newsreader, Hanken_Grotesk, Spline_Sans_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import { PostHogProvider } from '@/components/PostHogProvider'
import { ToastProvider } from '@/components/Toast'
import { SiteHeader } from '@/components/SiteHeader'
import { Footer } from '@/components/Footer'
import { AuthEvents } from '@/components/AuthEvents'
import { getIsAuthed } from '@/lib/prompts'

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
})
const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hanken',
  display: 'swap',
})
const splineMono = Spline_Sans_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-spline-mono',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
const description =
  'AI prompts for marketing, brand, and product leaders. Free, no login.'

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
    <html
      lang="en"
      className={`${newsreader.variable} ${hanken.variable} ${splineMono.variable}`}
    >
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
