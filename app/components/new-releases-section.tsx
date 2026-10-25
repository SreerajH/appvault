'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/common/section-header'
import { AppIcon } from '@/components/apps/app-icon'
import { PriceBadge } from '@/components/ui/PriceBadge'
import { tagline } from '@/lib/design'
import type { App } from '@/types'

function since(date: string | Date): string {
  const days = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000))
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

/* Full-bleed night band: new releases with the release notes they shipped with. */
export function NewReleasesSection({ apps }: { apps: App[] }) {
  if (apps.length === 0) return null
  return (
    <section className="-mb-24 mt-24 bg-night py-16 text-paper sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tone="dark"
          title="New & updated"
          sub="Fresh releases, and the notes they shipped with."
          href="/explore?sort=newest"
          hrefLabel="See all new"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {apps.slice(0, 8).map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: (i % 4) * 0.06, duration: 0.4 }}
            >
              <Link
                href={`/app/${app.id}`}
                className="group flex h-full flex-col rounded-2xl bg-night-2 p-5 ring-1 ring-night-line transition-[box-shadow,background-color] hover:bg-[#28241E] hover:ring-paper/25"
              >
                <div className="flex items-center gap-3">
                  <AppIcon app={app} size={52} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-paper">{app.name}</p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-paper/45" suppressHydrationWarning>
                      v{app.version} · {since(app.updatedAt)}
                    </p>
                  </div>
                </div>
                <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#FF8A5C]">What&rsquo;s new</p>
                <p className="mt-1.5 line-clamp-3 flex-1 text-sm leading-relaxed text-paper/75">
                  {app.whatsNew ?? tagline(app, 120)}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-night-line pt-4">
                  <span className="text-xs text-paper/50">{app.category.name}</span>
                  <PriceBadge price={app.price} tone="dark" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
