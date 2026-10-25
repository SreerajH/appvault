'use client'
import Link from 'next/link'
import { Shelf } from '@/components/common/shelf'
import { AppIcon } from '@/components/apps/app-icon'
import { PriceBadge } from '@/components/ui/PriceBadge'
import { appTint, tagline, shade } from '@/lib/design'
import type { App } from '@/types'

/* "Editors' Choice" shelf: pastel artwork cards with the app icon breaking out of the frame. */
export function FeaturedCarousel({ apps, title = "Editors' Choice", sub }: { apps: App[]; title?: string; sub?: string }) {
  return (
    <Shelf title={title} sub={sub} href="/explore?sort=rating">
      {apps.map(app => {
        const tint = appTint(app)
        return (
          <Link
            key={app.id}
            href={`/app/${app.id}`}
            className="group w-[280px] shrink-0 snap-start sm:w-[320px]"
          >
            <div
              className="relative h-[184px] overflow-hidden rounded-3xl"
              style={{ background: shade(tint, 0.8) }}
            >
              <span
                className="absolute left-5 top-5 text-[11px] font-bold uppercase tracking-[0.14em]"
                style={{ color: shade(tint, -0.55) }}
              >
                Editors&rsquo; Choice
              </span>
              <p
                className="absolute bottom-5 left-5 line-clamp-3 max-w-[54%] font-display text-[18px] font-extrabold leading-[1.15] tracking-tight"
                style={{ color: shade(tint, -0.7) }}
              >
                {tagline(app, 52)}
              </p>
              <div className="absolute -bottom-9 -right-7 rotate-[-10deg] transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-[-4deg]">
                <AppIcon app={app} size={140} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3 px-1">
              <AppIcon app={app} size={44} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold leading-tight text-ink">{app.name}</p>
                <p className="truncate text-[13px] text-ink-3">{app.category.name}</p>
              </div>
              <PriceBadge price={app.price} />
            </div>
          </Link>
        )
      })}
    </Shelf>
  )
}
