'use client'
import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingInputProps {
  value: number
  onChange: (val: number) => void
}

const LABELS = ['', 'Not for me', 'Could be better', 'It does the job', 'Really good', 'Love it']

export function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0)
  const shown = hovered || value
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1} star${i ? 's' : ''}`}
            onClick={() => onChange(i + 1)}
            onMouseEnter={() => setHovered(i + 1)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                'h-8 w-8 transition-colors',
                i < shown ? 'text-signal fill-signal' : 'text-ink/20 fill-ink/5'
              )}
            />
          </button>
        ))}
      </div>
      <span className="text-sm font-medium text-ink-2">{LABELS[shown]}</span>
    </div>
  )
}
