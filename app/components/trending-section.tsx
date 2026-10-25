'use client'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { Shelf } from '@/components/common/shelf'
import { AppIcon } from '@/components/apps/app-icon'
import { PriceBadge } from '@/components/ui/PriceBadge'
import { tagline } from '@/lib/design'
import type { App } from '@/types'

/* Three-row paged list, the "Must-have apps" shelf pattern. */
export function TrendingSection({ apps }: { apps: App[] }) {
  return (
    <Shelf
      title="Popular right now"
      sub="The most-installed apps on AppVault this week."
      href="/explore?sort=popular"
      trackClassName="grid grid-flow-col grid-rows-3 auto-cols-[86%] gap-x-6 gap-y-0 sm:auto-cols-[46%] lg:auto-cols-[calc((100%-3rem)/3)]"
    >
      {apps.map(app => (
        <Link
          key={app.id}
          href={`/app/${app.id}`}
          className="group flex snap-start items-center gap-3.5 border-b border-line py-3 [&:nth-child(3n)]:border-b-0"
        >
          <AppIcon app={app} size={60} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold leading-tight text-ink">{app.name}</p>
            <p className="mt-0.5 truncate text-[13px] text-ink-3">{tagline(app, 48)}</p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-ink">
              <Star className="h-3 w-3 fill-ink" /> {app.rating.toFixed(1)}
              <span className="font-normal text-ink-3">· {app.category.name}</span>
            </p>
          </div>
          <PriceBadge price={app.price} />
        </Link>
      ))}
    </Shelf>
  )
}
