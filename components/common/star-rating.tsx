'use client'
import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
  tone?: 'ink' | 'paper'
}

export function StarRating({ rating, maxRating = 5, size = 'md', interactive = false, onChange, tone = 'ink' }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const sizeClass = { sm: 'h-3 w-3', md: 'h-4 w-4', lg: 'h-6 w-6' }[size]
  const displayRating = interactive ? (hovered || rating) : rating
  const on = tone === 'ink' ? 'text-ink fill-ink' : 'text-paper fill-paper'
  const off = tone === 'ink' ? 'text-ink/20 fill-ink/10' : 'text-paper/25 fill-paper/10'

  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating.toFixed(1)} out of ${maxRating} stars`}>
      {Array.from({ length: maxRating }).map((_, i) => {
        const filled = i < Math.floor(displayRating)
        const partial = !filled && i < displayRating
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            tabIndex={interactive ? 0 : -1}
            onClick={() => interactive && onChange?.(i + 1)}
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={cn('relative', interactive && 'cursor-pointer hover:scale-110 transition-transform')}
          >
            <Star className={cn(sizeClass, filled ? on : off)} />
            {partial && (
              <Star
                className={cn(sizeClass, 'absolute inset-0', on)}
                style={{ clipPath: `inset(0 ${(1 - (displayRating - Math.floor(displayRating))) * 100}% 0 0)` }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
