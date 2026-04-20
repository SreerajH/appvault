'use client'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { FeaturedCarousel } from '@/components/apps/featured-carousel'
import type { App } from '@/types'

export function FeaturedSection({ apps }: { apps: App[] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-blue-400" />
        <h2 className="text-2xl font-bold text-foreground">Featured Apps</h2>
        <span className="text-sm text-muted-foreground ml-auto">Editor's picks</span>
      </div>
      <FeaturedCarousel apps={apps} />
    </motion.section>
  )
}
