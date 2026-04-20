'use client'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { AppGrid } from '@/components/apps/app-grid'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { App } from '@/types'

export function NewReleasesSection({ apps }: { apps: App[] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-blue-400" />
        <h2 className="text-2xl font-bold text-foreground">New Releases</h2>
        <Button variant="ghost" size="sm" asChild className="ml-auto">
          <Link href="/explore?sort=newest">View All</Link>
        </Button>
      </div>
      <AppGrid apps={apps} />
    </motion.section>
  )
}
