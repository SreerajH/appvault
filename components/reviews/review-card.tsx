'use client'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { StarRating } from '@/components/common/star-rating'
import { getInitials, formatDate } from '@/lib/utils'
import type { Review } from '@/types'

interface ReviewCardProps {
  review: Review
  index?: number
}

export function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.05 }}
      className="flex h-full flex-col rounded-2xl bg-surface p-5 ring-1 ring-line"
    >
      <div className="flex items-center justify-between gap-3">
        <StarRating rating={review.rating} size="sm" />
        <time className="font-mono text-[11px] uppercase tracking-wide text-ink-3">{formatDate(review.createdAt)}</time>
      </div>
      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink">{review.comment}</p>
      <div className="mt-4 flex items-center gap-2.5 border-t border-line pt-3">
        <Avatar className="h-7 w-7">
          <AvatarImage src={review.user.avatar ?? undefined} />
          <AvatarFallback className="text-[10px]">{getInitials(review.user.name)}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-ink-2">{review.user.name}</span>
      </div>
    </motion.article>
  )
}
