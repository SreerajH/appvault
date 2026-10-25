import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-sunken text-ink-2',
        secondary: 'bg-ink text-paper',
        destructive: 'bg-[#FBE4E1] text-[#9A1D14]',
        outline: 'border border-ink/20 text-ink-2',
        success: 'bg-[#DDEEDF] text-moss',
        free: 'bg-[#DDEEDF] text-moss',
        paid: 'bg-sunken text-ink',
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
