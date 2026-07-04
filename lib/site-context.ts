import { headers } from 'next/headers'

// House Style is served on two domains. On the personal domain it reads as
// Nicole's own project; on the Make It Land subdomain it reads as a studio piece.
// Branding is resolved per-request from the Host header (the app is already
// dynamic via auth cookies, so this adds no rendering cost).

export type SiteContext = {
  isStudio: boolean
  bylineName: string
  bylineUrl: string
  footerPrimaryLabel: string
  footerPrimaryUrl: string
  email: string
}

export function getSiteContext(): SiteContext {
  const host = (headers().get('host') ?? '').toLowerCase()
  const isStudio = host.includes('makeitland.studio')

  if (isStudio) {
    return {
      isStudio: true,
      bylineName: 'Make It Land',
      bylineUrl: 'https://makeitland.studio',
      footerPrimaryLabel: 'makeitland.studio',
      footerPrimaryUrl: 'https://makeitland.studio',
      email: 'mailto:hello@makeitland.studio',
    }
  }

  return {
    isStudio: false,
    bylineName: 'Nicole Miñoza',
    bylineUrl: 'https://nicoleminoza.com',
    footerPrimaryLabel: 'nicoleminoza.com',
    footerPrimaryUrl: 'https://nicoleminoza.com',
    email: 'mailto:hello@nicoleminoza.com',
  }
}

// Canonical origin for the current host: self-referential for any real domain
// (so the studio subdomain and the personal domain each own their OG + canonical
// URLs), with an env/localhost fallback for development.
export function getSiteOrigin(): string {
  const host = (headers().get('host') ?? '').toLowerCase()
  if (!host || host.startsWith('localhost') || host.startsWith('127.')) {
    return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  }
  return `https://${host}`
}
