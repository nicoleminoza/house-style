import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import { PostHogProvider } from '@/components/PostHogProvider'
import { ToastProvider } from '@/components/Toast'
import { SiteHeader } from '@/components/SiteHeader'
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

export const metadata: Metadata = {
  title: 'House Style — Prompts with a point of view',
  description:
    'A curated, AI-native library of enterprise brand & messaging prompts. Built by Nicole Miñoza.',
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
          </ToastProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}
