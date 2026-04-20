import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
        secondary: 'bg-slate-700 text-slate-300',
        destructive: 'bg-red-500/20 text-red-400',
        outline: 'border border-slate-600 text-slate-400',
        success: 'bg-green-500/20 text-green-400 border border-green-500/30',
        free: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        paid: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
