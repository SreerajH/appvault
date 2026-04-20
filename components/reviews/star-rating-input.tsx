'use client'
import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingInputProps {
  value: number
  onChange: (val: number) => void
}

export function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          onMouseEnter={() => setHovered(i + 1)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-125"
        >
          <Star
            className={cn(
              'h-8 w-8 transition-colors',
              i < (hovered || value) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
            )}
          />
        </button>
      ))}
    </div>
  )
}
