'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Star, Download, Share2, Check,
  Info, MessageSquare, Grid2X2,
  Smartphone, HardDrive, Calendar, Tag,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { ReviewCard } from '@/components/reviews/review-card'
import { StarRatingInput } from '@/components/reviews/star-rating-input'
import { AppCard } from '@/components/apps/app-card'
import { StarRating } from '@/components/common/star-rating'
import { PriceBadge } from '@/components/ui/PriceBadge'
import { formatDownloadCount, formatPrice, formatDate } from '@/lib/utils'
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 text-sm text-slate-500 mb-6"
      >
        <button onClick={() => router.back()} className="flex items-center gap-1 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <span>/</span>
        <Link href={`/category/${app.category.slug}`} className="hover:text-white transition-colors">
          {app.category.name}
        </Link>
        <span>/</span>
        <span className="text-slate-300 truncate max-w-40">{app.name}</span>
      </motion.div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-6 mb-8"
      >
        <div className="relative h-28 w-28 rounded-3xl overflow-hidden flex-shrink-0 shadow-2xl">
          <Image src={app.icon} alt={app.name} fill className="object-cover" unoptimized />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-1">{app.name}</h1>
          <p className="text-blue-400 font-medium mb-3">{app.developer}</p>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5">
              <StarRating rating={app.rating} size="sm" />
              <span className="font-semibold text-amber-400">{app.rating.toFixed(1)}</span>
              <span className="text-slate-500 text-sm">({app.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 text-sm">
              <Download className="h-4 w-4" />
              {formatDownloadCount(downloadCount)}
            </div>
            <PriceBadge price={app.price} className="text-sm px-3 py-1" />
            <Badge variant="default">{app.category.name}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleInstall}
              disabled={installing || installed}
              className="min-w-32 relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {installing ? (
                  <motion.div key="installing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Installing...
                  </motion.div>
                ) : installed ? (
                  <motion.div key="installed" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                    <Check className="h-4 w-4" /> Installed
                  </motion.div>
                ) : (
                  <motion.span key="install">{app.price === 0 ? 'Get' : `Buy ${formatPrice(app.price)}`}</motion.span>
                )}
              </AnimatePresence>
            </Button>
            <Button
              variant="secondary"
              onClick={handleDownloadApk}
              disabled={downloading}
              className="flex items-center gap-2"
            >
              {downloading ? (
                <>
                  <div className="h-4 w-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download APK
                </>
              )}
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Screenshots */}
      {app.screenshots.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex gap-3 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none' }}>
            {app.screenshots.map((src: string, i: number) => (
              <button
                key={i}
                onClick={() => { setLightboxIndex(i); setLightboxOpen(true) }}
                className="flex-shrink-0 relative h-44 w-72 rounded-2xl overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10"
              >
                <Image src={src} alt={`Screenshot ${i + 1}`} fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors" />
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5" /> Overview
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" /> Reviews ({localReviews.length})
            </TabsTrigger>
            <TabsTrigger value="similar" className="flex items-center gap-1.5">
              <Grid2X2 className="h-3.5 w-3.5" /> Similar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="font-semibold text-white mb-3">About</h3>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">{app.description}</p>
                </div>
                {app.whatsNew && (
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <h3 className="font-semibold text-blue-400 mb-2">{"What's New"}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{app.whatsNew}</p>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-white mb-3">App Info</h3>
                {[
                  { icon: Tag, label: 'Version', value: app.version },
                  { icon: HardDrive, label: 'Size', value: app.size },
                  { icon: Smartphone, label: 'Compatibility', value: app.compatibility },
                  { icon: Calendar, label: 'Updated', value: formatDate(app.updatedAt) },
                  { icon: Grid2X2, label: 'Category', value: app.category.name },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50">
                    <Icon className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="text-sm text-white">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-white">{app.rating.toFixed(1)}</span>
                  <div>
                    <StarRating rating={app.rating} size="md" />
                    <p className="text-slate-500 text-sm mt-1">{app.reviewCount} reviews</p>
                  </div>
                </div>
                <Button onClick={() => session ? setReviewOpen(true) : router.push('/login')}>
                  Write a Review
                </Button>
              </div>
              <div className="space-y-3">
                {localReviews.map((review: any, i: number) => (
                  <ReviewCard key={review.id} review={review} index={i} />
                ))}
                {localReviews.length === 0 && (
                  <div className="text-center py-12 text-slate-500 rounded-2xl border border-slate-800 bg-slate-900/50">
                    No reviews yet. Be the first to review!
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="similar">
            {similarApps.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {similarApps.map((a, i) => <AppCard key={a.id} app={a} index={i} />)}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-12">No similar apps found.</p>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Screenshot Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-3xl p-2 bg-slate-950">
          <DialogHeader className="sr-only">
            <DialogTitle>Screenshot viewer</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLightboxIndex(i => Math.max(0, i - 1))}
              disabled={lightboxIndex === 0}
              className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-30 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div className="relative flex-1 aspect-video rounded-xl overflow-hidden">
              <Image src={app.screenshots[lightboxIndex]} alt="" fill className="object-cover" unoptimized />
            </div>
            <button
              onClick={() => setLightboxIndex(i => Math.min(app.screenshots.length - 1, i + 1))}
              disabled={lightboxIndex === app.screenshots.length - 1}
              className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-30 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white rotate-180" />
            </button>
          </div>
          <p className="text-center text-sm text-slate-500 mt-1">{lightboxIndex + 1} / {app.screenshots.length}</p>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review for {app.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReviewSubmit} className="space-y-4 mt-2">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Your Rating</label>
              <StarRatingInput value={reviewRating} onChange={setReviewRating} />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Your Review</label>
              <Textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Share your experience with this app..."
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-slate-600 mt-1">{reviewComment.length}/500</p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="ghost" onClick={() => setReviewOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
