'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, ChevronRight, Download, Share, Check, Star, PenLine } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { ReviewCard } from '@/components/reviews/review-card'
import { StarRatingInput } from '@/components/reviews/star-rating-input'
import { AppGrid } from '@/components/apps/app-grid'
import { AppIcon } from '@/components/apps/app-icon'
import { StarRating } from '@/components/common/star-rating'
import { SectionHeader } from '@/components/common/section-header'
import { formatDownloadCount, formatPrice, formatDate, cn } from '@/lib/utils'
import { tagline, placeholdPng } from '@/lib/design'
import { toast } from '@/hooks/use-toast'
import type { AppWithReviews, App } from '@/types'

interface AppDetailClientProps {
  app: AppWithReviews
  similarApps: App[]
}

export function AppDetailClient({ app, similarApps }: AppDetailClientProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [installing, setInstalling] = useState(false)
  const [installed, setInstalled] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [localReviews, setLocalReviews] = useState(app.reviews)
  const [downloadCount, setDownloadCount] = useState(app.downloadCount)
  const [downloading, setDownloading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [showBar, setShowBar] = useState(false)
  const actionsRef = useRef<HTMLDivElement>(null)

  // Compact "GET" bar once the main actions scroll out of view
  useEffect(() => {
    const el = actionsRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0), { rootMargin: '-64px 0px 0px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const histogram = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]
    localReviews.forEach((r: { rating: number }) => { if (r.rating >= 1 && r.rating <= 5) counts[r.rating - 1]++ })
    const max = Math.max(1, ...counts)
    return [5, 4, 3, 2, 1].map(stars => ({ stars, count: counts[stars - 1], pct: (counts[stars - 1] / max) * 100 }))
  }, [localReviews])

  const handleDownloadApk = async () => {
    setDownloading(true)
    setDownloadCount(c => c + 1)
    toast({ title: `Downloading ${app.name}...`, description: 'APK file starting.' })
    await new Promise(r => setTimeout(r, 1500))
    try {
      const res = await fetch(`/api/apps/${app.id}/download`)
      if (!res.ok) throw new Error('Download failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${app.slug}-v1.0.apk`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      setDownloadCount(c => c - 1)
      toast({ title: 'Download failed', description: 'Please try again.', variant: 'destructive' })
    }
    setDownloading(false)
  }

  const handleInstall = async () => {
    setInstalling(true)
    await new Promise(r => setTimeout(r, 2000))
    setInstalling(false)
    setInstalled(true)
    toast({ title: `${app.name} installed!`, description: 'Enjoy the app.', variant: 'success' })
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast({ title: 'Link copied!', description: 'Share this app with your friends.' })
    } catch {}
  }

  const openReview = () => (session ? setReviewOpen(true) : router.push('/login'))

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) { router.push('/login'); return }
    if (!reviewComment.trim() || reviewComment.length < 10) {
      toast({ title: 'Review too short', description: 'Must be at least 10 characters.', variant: 'destructive' })
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId: app.id, rating: reviewRating, comment: reviewComment }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setLocalReviews(prev => [data.review, ...prev])
      setReviewOpen(false)
      setReviewComment('')
      setReviewRating(5)
      toast({ title: 'Review submitted!', variant: 'success' })
    } catch (err: any) {
      toast({ title: err.message ?? 'Failed to submit review', variant: 'destructive' })
    }
    setSubmitting(false)
  }

  const priceLabel = app.price === 0 ? 'Get' : `Buy ${formatPrice(app.price)}`
  const [sizeNum, sizeUnit] = app.size.split(' ')

  const renderInstall = (compact = false) => (
    <Button
      onClick={handleInstall}
      disabled={installing || installed}
      size={compact ? 'sm' : 'lg'}
      variant={installed ? 'secondary' : 'default'}
      className={cn('relative overflow-hidden disabled:opacity-100', compact ? 'min-w-[76px]' : 'min-w-[148px]')}
    >
      <AnimatePresence mode="wait" initial={false}>
        {installing ? (
          <motion.span key="installing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper/30 border-t-paper" />
            {!compact && 'Installing'}
          </motion.span>
        ) : installed ? (
          <motion.span key="installed" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-1.5">
            <Check className="h-4 w-4" /> {compact ? 'Open' : 'Installed'}
          </motion.span>
        ) : (
          <motion.span key="install" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{compact ? (app.price === 0 ? 'Get' : formatPrice(app.price)) : priceLabel}</motion.span>
        )}
      </AnimatePresence>
    </Button>
  )

  const stats = [
    { label: `${localReviews.length} ratings`, value: app.rating.toFixed(1), sub: <StarRating rating={app.rating} size="sm" /> },
    { label: 'Installs', value: formatDownloadCount(app.downloads), sub: 'all time' },
    { label: 'APK downloads', value: formatDownloadCount(downloadCount), sub: 'this build' },
    { label: 'Size', value: sizeNum, sub: sizeUnit ?? '' },
    { label: 'Version', value: app.version, sub: 'latest' },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      {/* Compact product bar */}
      <AnimatePresence>
        {showBar && (
          <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-0 top-16 z-30 border-b border-line bg-paper/90 backdrop-blur-xl"
          >
            <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
              <AppIcon app={app} size={34} />
              <p className="min-w-0 flex-1 truncate font-semibold text-ink">{app.name}</p>
              {renderInstall(true)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-sm text-ink-3" aria-label="Breadcrumb">
        <button onClick={() => router.back()} className="mr-2 inline-flex items-center gap-1 rounded-full py-1 pr-2 text-ink-2 transition-colors hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <Link href="/explore" className="hover:text-ink">Apps</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/category/${app.category.slug}`} className="hover:text-ink">{app.category.name}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="max-w-40 truncate text-ink-2">{app.name}</span>
      </nav>

      {/* Product header */}
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8"
      >
        <AppIcon app={app} size={132} className="shadow-[0_24px_48px_-20px_rgb(20_18_15/0.45)]" />
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">{app.category.name}</p>
          <h1 className="mt-1.5 font-display text-[40px] font-black leading-[0.95] tracking-[-0.035em] text-ink sm:text-[54px]">
            {app.name}
          </h1>
          <p className="mt-2 font-medium text-signal-ink">{app.developer}</p>
          <p className="mt-1 max-w-xl text-[15px] text-ink-2">{tagline(app, 110)}</p>

          <div ref={actionsRef} className="mt-6 flex flex-wrap items-center gap-2.5">
            {renderInstall()}
            <Button variant="outline" size="lg" onClick={handleDownloadApk} disabled={downloading}>
              {downloading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
                  Downloading
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download APK
                </>
              )}
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12" onClick={handleShare} aria-label="Copy link">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Stat strip */}
      <dl className="-mx-4 mt-10 flex snap-x overflow-x-auto border-y border-line px-4 scrollbar-hide sm:mx-0 sm:px-0">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={cn(
              'flex min-w-[132px] flex-1 snap-start flex-col items-center px-4 py-4 text-center',
              i > 0 && 'border-l border-line'
            )}
          >
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">{s.label}</dt>
            <dd className="mt-1.5 font-display text-[26px] font-extrabold leading-none tracking-tight text-ink tabular-nums">{s.value}</dd>
            <dd className="mt-1.5 flex h-4 items-center text-xs text-ink-3">{s.sub}</dd>
          </div>
        ))}
      </dl>

      {/* Screenshots */}
      {app.screenshots.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-display text-2xl font-extrabold tracking-tight text-ink">Preview</h2>
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 scrollbar-hide sm:mx-0 sm:scroll-px-0 sm:px-0">
            {app.screenshots.map((src: string, i: number) => (
              <button
                key={i}
                onClick={() => { setLightboxIndex(i); setLightboxOpen(true) }}
                className="group relative aspect-video h-[190px] shrink-0 snap-start overflow-hidden rounded-2xl bg-sunken ring-1 ring-line sm:h-[250px]"
                aria-label={`Open screenshot ${i + 1}`}
              >
                <Image src={placeholdPng(src)} alt={`${app.name} screenshot ${i + 1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" unoptimized />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* About + Information */}
      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_320px]">
        <section>
          <h2 className="mb-3 font-display text-2xl font-extrabold tracking-tight text-ink">About this app</h2>
          <p className={cn('whitespace-pre-line text-[15px] leading-relaxed text-ink-2', !expanded && 'line-clamp-4')}>
            {app.description}
          </p>
          {app.description.length > 260 && (
            <button onClick={() => setExpanded(e => !e)} className="mt-2 text-sm font-semibold text-signal-ink hover:text-ink">
              {expanded ? 'Less' : 'More'}
            </button>
          )}

          {app.whatsNew && (
            <div className="mt-10 rounded-2xl bg-surface p-5 ring-1 ring-line sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg font-extrabold tracking-tight text-ink">{"What's new"}</h3>
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">
                  Version {app.version} · {formatDate(app.updatedAt)}
                </span>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{app.whatsNew}</p>
            </div>
          )}
        </section>

        <aside>
          <h2 className="mb-3 font-display text-2xl font-extrabold tracking-tight text-ink">Information</h2>
          <dl className="divide-y divide-line border-y border-line text-sm">
            {[
              ['Provider', app.developer],
              ['Category', app.category.name],
              ['Size', app.size],
              ['Compatibility', app.compatibility],
              ['Version', app.version],
              ['Updated', formatDate(app.updatedAt)],
              ['Price', formatPrice(app.price)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-6 py-3">
                <dt className="text-ink-3">{label}</dt>
                <dd className="text-right font-medium text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      {/* Ratings & reviews */}
      <section id="reviews" className="mt-16">
        <SectionHeader
          title="Ratings & reviews"
          action={
            <Button size="sm" variant="outline" onClick={openReview}>
              <PenLine className="h-3.5 w-3.5" /> Write a review
            </Button>
          }
        />
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <div>
            <div className="flex items-end gap-3">
              <span className="font-display text-[72px] font-black leading-[0.8] tracking-[-0.04em] text-ink">{app.rating.toFixed(1)}</span>
              <span className="pb-1 text-sm text-ink-3">out of 5</span>
            </div>
            <div className="mt-5 space-y-1.5">
              {histogram.map(h => (
                <div key={h.stars} className="flex items-center gap-2.5">
                  <span className="inline-flex w-7 items-center gap-0.5 font-mono text-[11px] text-ink-3">
                    {h.stars}<Star className="h-2.5 w-2.5 fill-ink-3 text-ink-3" />
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sunken">
                    <motion.div
                      className="h-full rounded-full bg-ink"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${h.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-3">{localReviews.length} rating{localReviews.length === 1 ? '' : 's'} on AppVault</p>
          </div>

          {localReviews.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {localReviews.map((review: any, i: number) => (
                <ReviewCard key={review.id} review={review} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-start justify-center rounded-2xl border border-dashed border-ink/20 p-8">
              <p className="font-display text-xl font-bold text-ink">No reviews yet</p>
              <p className="mt-1 text-sm text-ink-2">Tried {app.name}? Tell people what it’s actually like.</p>
              <Button className="mt-4" size="sm" onClick={openReview}>Write the first review</Button>
            </div>
          )}
        </div>
      </section>

      {/* Similar */}
      {similarApps.length > 0 && (
        <section className="mt-16">
          <SectionHeader
            title="You might also like"
            href={`/category/${app.category.slug}`}
            hrefLabel={`More ${app.category.name}`}
          />
          <AppGrid apps={similarApps} className="xl:grid-cols-2" />
        </section>
      )}

      {/* Screenshot lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl border-night-line bg-night p-3 sm:p-4">
          <DialogHeader className="sr-only">
            <DialogTitle>Screenshot viewer</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video overflow-hidden rounded-2xl">
            <Image src={placeholdPng(app.screenshots[lightboxIndex] ?? '')} alt={`${app.name} screenshot ${lightboxIndex + 1}`} fill className="object-cover" unoptimized />
          </div>
          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => setLightboxIndex(i => Math.max(0, i - 1))}
              disabled={lightboxIndex === 0}
              className="flex h-9 w-9 items-center justify-center rounded-full text-paper transition-colors hover:bg-paper/10 disabled:opacity-30"
              aria-label="Previous screenshot"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <p className="font-mono text-xs text-paper/60">{lightboxIndex + 1} / {app.screenshots.length}</p>
            <button
              onClick={() => setLightboxIndex(i => Math.min(app.screenshots.length - 1, i + 1))}
              disabled={lightboxIndex === app.screenshots.length - 1}
              className="flex h-9 w-9 items-center justify-center rounded-full text-paper transition-colors hover:bg-paper/10 disabled:opacity-30"
              aria-label="Next screenshot"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <AppIcon app={app} size={40} />
              <DialogTitle>Review {app.name}</DialogTitle>
            </div>
          </DialogHeader>
          <form onSubmit={handleReviewSubmit} className="mt-1 space-y-5">
            <div>
              <label className="mb-2 block text-[13px] font-semibold text-ink">Your rating</label>
              <StarRatingInput value={reviewRating} onChange={setReviewRating} />
            </div>
            <div>
              <label htmlFor="review" className="mb-2 block text-[13px] font-semibold text-ink">Your review</label>
              <Textarea
                id="review"
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="What do you use it for? What surprised you?"
                rows={4}
                maxLength={500}
              />
              <p className="mt-1 text-right font-mono text-[11px] text-ink-3">{reviewComment.length}/500</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setReviewOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Post review'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
