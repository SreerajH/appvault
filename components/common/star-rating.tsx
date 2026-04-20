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
}

export function StarRating({ rating, maxRating = 5, size = 'md', interactive = false, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const sizeClass = { sm: 'h-3 w-3', md: 'h-4 w-4', lg: 'h-6 w-6' }[size]
  const displayRating = interactive ? (hovered || rating) : rating

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }).map((_, i) => {
        const filled = i < Math.floor(displayRating)
        const partial = !filled && i < displayRating
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(i + 1)}
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={cn('relative', interactive && 'cursor-pointer hover:scale-110 transition-transform')}
          >
            <Star className={cn(sizeClass, filled || partial ? 'text-amber-400' : 'text-slate-600')} />
            {partial && (
              <Star
                className={cn(sizeClass, 'absolute inset-0 text-amber-400')}
                style={{ clipPath: `inset(0 ${(1 - (displayRating - Math.floor(displayRating))) * 100}% 0 0)` }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
