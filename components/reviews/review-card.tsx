'use client'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials, formatDate } from '@/lib/utils'
import type { Review } from '@/types'

interface ReviewCardProps {
  review: Review
  index?: number
}

export function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50"
    >
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={review.user.avatar ?? undefined} />
          <AvatarFallback>{getInitials(review.user.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-medium text-white">{review.user.name}</span>
            <span className="text-xs text-slate-500">{formatDate(review.createdAt)}</span>
          </div>
          <div className="flex items-center gap-0.5 my-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
            ))}
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </motion.div>
  )
}
