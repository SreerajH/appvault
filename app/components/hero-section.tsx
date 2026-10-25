'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { AppIcon } from '@/components/apps/app-icon'
import { PriceBadge } from '@/components/ui/PriceBadge'
import { appTint, shade, firstSentence, prefersLightText } from '@/lib/design'
import { cn, formatDownloadCount } from '@/lib/utils'
import type { App } from '@/types'

interface HeroSectionProps {
  appOfDay?: App
  topRated?: App
  justLanded?: App
  stats: { apps: number; categories: number; reviews: number }
}

function TodayDate() {
  const [label, setLabel] = useState('')
  useEffect(() => {
    setLabel(new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }))
  }, [])
  return <span suppressHydrationWarning>{label || ' '}</span>
}

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.08 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } }),
}

/* "Today" masthead + editorial story cards, after the App Store's Today tab. */
export function HeroSection({ appOfDay, topRated, justLanded, stats }: HeroSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5 pb-7">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-3">
            <TodayDate />
          </p>
          <h1 className="mt-2 font-display text-[64px] font-black leading-[0.85] tracking-[-0.05em] text-ink sm:text-[88px]">
            Today
          </h1>
        </div>
        <dl className="flex gap-8 border-l border-line pl-6 sm:gap-10 sm:pl-8">
          {[
            ['Apps', stats.apps],
            ['Categories', stats.categories],
            ['Reviews', stats.reviews],
          ].map(([label, value]) => (
            <div key={label as string}>
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">{label}</dt>
              <dd className="mt-1 font-display text-3xl font-extrabold tabular-nums tracking-tight text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {appOfDay && (
        <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          <motion.div variants={rise} initial="hidden" animate="show" custom={0} className="lg:col-span-2 lg:row-span-2">
            <LeadStory app={appOfDay} />
          </motion.div>
          {topRated && (
            <motion.div variants={rise} initial="hidden" animate="show" custom={1}>
              <SideStory
                app={topRated}
                kicker="Highest rated"
                detail={
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-current" /> {topRated.rating.toFixed(1)} average · {formatDownloadCount(topRated.downloads)} installs
                  </span>
                }
              />
            </motion.div>
          )}
          {justLanded && (
            <motion.div variants={rise} initial="hidden" animate="show" custom={2}>
              <SideStory app={justLanded} kicker="Just landed" detail={<>Version {justLanded.version} · {justLanded.size}</>} />
            </motion.div>
          )}
        </div>
      )}
    </section>
  )
}

function LeadStory({ app }: { app: App }) {
  const tint = appTint(app)
  return (
    <Link
      href={`/app/${app.id}`}
      className="group relative flex h-full min-h-[560px] flex-col overflow-hidden rounded-[28px] p-6 text-white sm:min-h-[500px] sm:p-9"
      style={{ background: `linear-gradient(155deg, ${shade(tint, -0.2)} 0%, ${shade(tint, -0.6)} 100%)` }}
    >
      {/* Artwork: concentric rings behind an oversized, tilted icon (tucked low on phones, beside the copy on larger screens) */}
      <div aria-hidden className="pointer-events-none absolute -right-20 bottom-12 h-[340px] w-[340px] sm:-right-10 sm:bottom-auto sm:top-1/2 sm:h-[560px] sm:w-[560px] sm:-translate-y-1/2">
        {[1, 0.78, 0.56].map(s => (
          <span
            key={s}
            className="absolute inset-0 m-auto rounded-full border border-white/12"
            style={{ width: `${s * 100}%`, height: `${s * 100}%` }}
          />
        ))}
        <div className="absolute inset-0 m-auto h-fit w-fit rotate-[10deg] transition-transform duration-700 ease-out group-hover:rotate-[4deg] group-hover:scale-[1.03]">
          <div className="scale-[0.62] sm:scale-100">
            <AppIcon app={app} size={250} className="shadow-[0_40px_80px_-20px_rgb(0_0_0/0.55)]" />
          </div>
        </div>
      </div>

      <span className="relative text-xs font-bold uppercase tracking-[0.16em] text-white/70">App of the day</span>
      <h2 className="relative mt-4 max-w-[15ch] font-display text-[30px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:max-w-[13ch] sm:text-[52px]">
        {firstSentence(app.description, 72).replace(/\.$/, '')}
      </h2>

      <div className="relative mt-auto flex items-center gap-3.5 rounded-2xl bg-black/25 p-3 pr-4 backdrop-blur-md sm:max-w-md">
        <AppIcon app={app} size={52} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{app.name}</p>
          <p className="truncate text-[13px] text-white/65">{app.developer}</p>
        </div>
        <PriceBadge price={app.price} tone="onColor" />
      </div>
    </Link>
  )
}

function SideStory({ app, kicker, detail }: { app: App; kicker: string; detail: React.ReactNode }) {
  const tint = appTint(app)
  const bg = shade(tint, 0.8)
  const deep = shade(tint, -0.6)
  return (
    <Link
      href={`/app/${app.id}`}
      className="group relative flex h-full min-h-[236px] flex-col overflow-hidden rounded-[28px] p-6"
      style={{ background: bg, color: deep }}
    >
      <div aria-hidden className="absolute -bottom-8 -right-6 rotate-[-12deg] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:rotate-[-5deg]">
        <AppIcon app={app} size={136} />
      </div>
      <span className="text-[11px] font-bold uppercase tracking-[0.16em] opacity-75">{kicker}</span>
      <h3 className="mt-2 max-w-[62%] font-display text-[28px] font-extrabold leading-[1.02] tracking-[-0.03em]">
        {app.name}
      </h3>
      <p className="mt-2 max-w-[60%] text-[13px] font-medium opacity-80">{detail}</p>
      <div className="mt-auto pt-4">
        <span
          className={cn(
            'inline-flex h-8 items-center rounded-full px-4 text-[13px] font-bold uppercase tracking-wide',
            prefersLightText(deep) ? 'text-white' : 'text-ink'
          )}
          style={{ background: deep }}
        >
          {app.price === 0 ? 'Get' : `$${app.price.toFixed(2)}`}
        </span>
      </div>
    </Link>
  )
}
