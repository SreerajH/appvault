'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { SectionHeader } from '@/components/common/section-header'
import { AppIcon } from '@/components/apps/app-icon'
import { PriceBadge } from '@/components/ui/PriceBadge'
import { formatDownloadCount, cn } from '@/lib/utils'
import type { App } from '@/types'

type ChartKey = 'free' | 'paid' | 'rated'

interface ChartsSectionProps {
  free: App[]
  paid: App[]
  rated: App[]
}

/* Three ranked lists side by side on desktop; a segmented control on mobile. */
export function ChartsSection({ free, paid, rated }: ChartsSectionProps) {
  const [active, setActive] = useState<ChartKey>('free')
  const charts: { key: ChartKey; label: string; apps: App[]; href: string }[] = [
    { key: 'free', label: 'Top free', apps: free, href: '/explore?price=free&sort=popular' },
    { key: 'paid', label: 'Top paid', apps: paid, href: '/explore?price=paid&sort=popular' },
    { key: 'rated', label: 'Top rated', apps: rated, href: '/explore?sort=rating' },
  ]

  return (
    <section id="charts">
      <SectionHeader title="Top charts" sub="Ranked by installs and by what people rate them." />

      <div className="mb-4 flex rounded-full bg-sunken p-1 lg:hidden" role="tablist" aria-label="Chart">
        {charts.map(c => (
          <button
            key={c.key}
            role="tab"
            aria-selected={active === c.key}
            onClick={() => setActive(c.key)}
            className={cn(
              'flex-1 rounded-full py-2 text-sm font-semibold transition-colors',
              active === c.key ? 'bg-surface text-ink shadow-sm' : 'text-ink-2'
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid gap-x-10 lg:grid-cols-3">
        {charts.map(chart => (
          <div key={chart.key} className={cn(chart.key !== active && 'hidden lg:block')}>
            <div className="hidden items-center justify-between border-b border-line pb-3 lg:flex">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">{chart.label}</h3>
              <Link href={chart.href} className="text-xs font-semibold text-signal-ink hover:text-ink">See all</Link>
            </div>
            <ol>
              {chart.apps.map((app, i) => (
                <li key={app.id} className="border-b border-line last:border-b-0">
                  <Link href={`/app/${app.id}`} className="group flex items-center gap-4 py-3.5">
                    <span
                      className={cn(
                        'w-6 shrink-0 text-center font-display text-[22px] font-extrabold tabular-nums',
                        i === 0 ? 'text-signal-ink' : 'text-ink'
                      )}
                    >
                      {i + 1}
                    </span>
                    <AppIcon app={app} size={56} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold leading-tight text-ink group-hover:underline group-hover:decoration-ink/30 group-hover:underline-offset-2">
                        {app.name}
                      </p>
                      <p className="mt-0.5 truncate text-[13px] text-ink-3">{app.category.name}</p>
                      <p className="mt-0.5 text-xs text-ink-2">
                        {chart.key === 'rated' ? (
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-3 w-3 fill-ink text-ink" />
                            <span className="font-semibold text-ink">{app.rating.toFixed(1)}</span>
                            <span className="text-ink-3">· {formatDownloadCount(app.downloads)} installs</span>
                          </span>
                        ) : (
                          <span className="font-mono tabular-nums">{formatDownloadCount(app.downloads)} installs</span>
                        )}
                      </p>
                    </div>
                    <PriceBadge price={app.price} />
                  </Link>
                </li>
              ))}
            </ol>
            <Link href={chart.href} className="mt-2 inline-flex text-sm font-semibold text-signal-ink lg:hidden">
              See all {chart.label.toLowerCase()}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
