'use client'
import { FeaturedCarousel } from '@/components/apps/featured-carousel'
import type { App } from '@/types'

export function FeaturedSection({ apps }: { apps: App[] }) {
  if (apps.length === 0) return null
  return <FeaturedCarousel apps={apps} sub="Apps our editors keep coming back to." />
}
