'use client'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { LogOut, Pencil, Check, X, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AppIcon } from '@/components/apps/app-icon'
import { StarRating } from '@/components/common/star-rating'
import { SectionHeader } from '@/components/common/section-header'
import { toast } from '@/hooks/use-toast'
import { formatDate, getInitials } from '@/lib/utils'

interface UserReview {
  id: string
  rating: number
  comment: string
  createdAt: string
  app: {
    id: string
    name: string
    icon: string
    developer: string
  }
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [reviews, setReviews] = useState<UserReview[]>([])
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [reviewsLoading, setReviewsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name)
  }, [session])

  useEffect(() => {
    if (session) {
      fetch('/api/reviews/user')
        .then(r => r.json())
        .then(d => setReviews(d.reviews ?? []))
        .catch(() => {})
        .finally(() => setReviewsLoading(false))
    }
  }, [session])

  const handleSave = async () => {
    if (!name.trim() || name.trim().length < 2) {
      toast({ title: 'Name too short', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })
      if (!res.ok) throw new Error()
      await update({ name: name.trim() })
      setEditing(false)
      toast({ title: 'Profile updated!', variant: 'success' })
    } catch {
      toast({ title: 'Failed to update profile', variant: 'destructive' })
    }
    setSaving(false)
  }

  if (status === 'loading') {
    return (
      <div className="mx-auto flex max-w-4xl items-center justify-center px-4 py-24">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-ink border-t-transparent" />
      </div>
    )
  }

  if (!session) return null

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-14">
        {/* Identity */}
        <header className="flex flex-col gap-6 border-b border-ink pb-8 sm:flex-row sm:items-end">
          <Avatar className="h-24 w-24">
            <AvatarImage src={session.user.image ?? undefined} />
            <AvatarFallback className="font-display text-3xl font-extrabold">
              {getInitials(session.user.name ?? 'U')}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-3">Your account</p>
            {editing ? (
              <div className="mt-2 flex items-center gap-2">
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSave() }}
                  className="max-w-xs"
                  placeholder="Your name"
                  aria-label="Display name"
                  autoFocus
                />
                <Button size="icon" onClick={handleSave} disabled={saving} aria-label="Save name">
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Cancel"
                  onClick={() => { setEditing(false); setName(session.user.name ?? '') }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="mt-1 flex items-center gap-2">
                <h1 className="truncate font-display text-[40px] font-black leading-none tracking-[-0.04em] text-ink sm:text-[52px]">
                  {session.user.name}
                </h1>
                <button
                  onClick={() => setEditing(true)}
                  className="rounded-full p-2 text-ink-3 transition-colors hover:bg-sunken hover:text-ink"
                  aria-label="Edit name"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            )}
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-ink-2">
              <Mail className="h-4 w-4 text-ink-3" /> {session.user.email}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/' })} className="self-start sm:self-auto">
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </Button>
        </header>

        {/* Stats */}
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line ring-1 ring-line sm:grid-cols-3">
          {[
            ['Reviews written', reviews.length.toString()],
            ['Average rating given', reviews.length ? avg.toFixed(1) : '—'],
            ['Last review', reviews[0] ? formatDate(reviews[0].createdAt) : '—'],
          ].map(([label, value], i) => (
            <div key={label} className={`bg-surface p-5 ${i === 2 ? 'col-span-2 sm:col-span-1' : ''}`}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">{label}</dt>
              <dd className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        {/* Reviews */}
        <section>
          <SectionHeader title="Your reviews" />
          {reviewsLoading ? (
            <div className="flex justify-center py-16">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink border-t-transparent" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-ink/20 px-6 py-16 text-center">
              <p className="font-display text-xl font-bold text-ink">You haven&rsquo;t reviewed anything yet</p>
              <p className="mt-1 text-sm text-ink-2">Find an app you use and tell people what it&rsquo;s like.</p>
              <Button className="mt-5" asChild>
                <Link href="/explore">Browse apps</Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-line border-y border-line">
              {reviews.map((review, i) => (
                <motion.li
                  key={review.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i, 8) * 0.05 }}
                  className="flex gap-4 py-5"
                >
                  <Link href={`/app/${review.app.id}`} className="shrink-0 transition-opacity hover:opacity-80">
                    <AppIcon app={review.app} size={56} />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <Link href={`/app/${review.app.id}`} className="font-semibold text-ink hover:underline hover:decoration-ink/30 hover:underline-offset-2">
                        {review.app.name}
                      </Link>
                      <time className="font-mono text-[11px] uppercase tracking-wide text-ink-3">{formatDate(review.createdAt)}</time>
                    </div>
                    <p className="text-xs text-ink-3">{review.app.developer}</p>
                    <div className="mt-2"><StarRating rating={review.rating} size="sm" /></div>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{review.comment}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </section>
      </motion.div>
    </div>
  )
}
