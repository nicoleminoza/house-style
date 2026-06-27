import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

// Public content routes only. The dashboard is private and the auth/callback
// route is plumbing, so neither belongs in the sitemap.
const ROUTES: { path: string; priority: number }[] = [
  { path: '/', priority: 1 },
  { path: '/demo', priority: 0.8 },
  { path: '/method', priority: 0.7 },
  { path: '/about', priority: 0.6 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified: '2026-06-27',
    changeFrequency: 'monthly',
    priority: r.priority,
  }))
}
