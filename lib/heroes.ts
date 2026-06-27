// The flagship "hero" frameworks — deliberately the most thorough prompts in the
// library, surfaced first and badged. Concentrating attention here is what makes
// "one framework captured N% of copy events" true.
export const HERO_SLUGS = new Set<string>([
  'exec-voice-matrix',
  'pmm-positioning-system',
  'ai-launch-os',
])

export const isHero = (slug: string) => HERO_SLUGS.has(slug)
