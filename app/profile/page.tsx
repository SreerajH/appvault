'use client'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Star, LogOut, Edit2, Save, X, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
      <div className="max-w-4xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        {/* Profile card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={session.user.image ?? undefined} />
              <AvatarFallback className="text-2xl font-bold">
                {getInitials(session.user.name ?? 'U')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="max-w-xs"
                    placeholder="Your name"
                    autoFocus
                  />
                  <Button size="sm" onClick={handleSave} disabled={saving}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { setEditing(false); setName(session.user.name ?? '') }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-white">{session.user.name}</h1>
                  <button
                    onClick={() => setEditing(true)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                    aria-label="Edit name"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-400 mb-3">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{session.user.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Star className="h-4 w-4 text-amber-400" />
                <span>{reviews.length} review{reviews.length !== 1 ? 's' : ''} written</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex-shrink-0 border-red-800 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* My Reviews */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-blue-400" />
            My Reviews
          </h2>

          {reviewsLoading ? (
            <div className="flex justify-center py-16">
              <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-slate-800 bg-slate-900/50">
              <Star className="h-12 w-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No reviews yet</p>
              <p className="text-sm text-slate-600 mt-1">Browse apps and share your thoughts</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/explore">Explore Apps</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <Link href={`/app/${review.app.id}`} className="relative h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity">
                      <Image src={review.app.icon} alt={review.app.name} fill className="object-cover" unoptimized />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <Link href={`/app/${review.app.id}`} className="font-semibold text-white hover:text-blue-400 transition-colors truncate">
                          {review.app.name}
                        </Link>
                        <span className="text-xs text-slate-500 flex-shrink-0">{formatDate(review.createdAt)}</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{review.app.developer}</p>
                      <div className="flex items-center gap-0.5 mb-2">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            className={`h-3.5 w-3.5 ${j < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
                          />
                        ))}
                        <span className="text-xs text-amber-400 ml-1">{review.rating}/5</span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
