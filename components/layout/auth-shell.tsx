'use client'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { AppIcon } from '@/components/apps/app-icon'

interface MiniApp { id: string; name: string; icon: string }

interface AuthShellProps {
  eyebrow: string
  title: string
  sub: string
  children: React.ReactNode
  footer: React.ReactNode
}

/* Split auth layout: form on paper, a slowly drifting wall of real app icons on night. */
export function AuthShell({ eyebrow, title, sub, children, footer }: AuthShellProps) {
  const [apps, setApps] = useState<MiniApp[]>([])
  const reduce = useReducedMotion()

  useEffect(() => {
    fetch('/api/apps/trending')
      .then(r => r.json())
      .then(d => setApps(d.apps ?? []))
      .catch(() => {})
  }, [])

  const columns = Array.from({ length: 4 }, (_, c) =>
    Array.from({ length: 6 }, (_, r) => apps.length ? apps[(c * 3 + r * 5) % apps.length] : null)
  )

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[1fr_1.05fr]">
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[380px]"
        >
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-3">{eyebrow}</p>
          <h1 className="mt-2 font-display text-[40px] font-black leading-[0.95] tracking-[-0.04em] text-ink">{title}</h1>
          <p className="mt-3 text-[15px] text-ink-2">{sub}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 border-t border-line pt-5 text-sm text-ink-2">{footer}</div>
        </motion.div>
      </div>

      <div className="relative hidden overflow-hidden bg-night lg:block" aria-hidden>
        <div className="absolute -inset-x-10 -inset-y-24 flex rotate-[-8deg] justify-center gap-5">
          {columns.map((col, c) => (
            <motion.div
              key={c}
              className="flex flex-col gap-5"
              animate={reduce ? undefined : { y: c % 2 ? ['-50%', '0%'] : ['0%', '-50%'] }}
              transition={{ duration: 60 + c * 8, repeat: Infinity, ease: 'linear' }}
            >
              {[...col, ...col].map((app, r) =>
                app ? (
                  <AppIcon key={r} app={app} size={112} className="opacity-90" />
                ) : (
                  <div key={r} className="h-[112px] w-[112px] rounded-[22.5%] bg-night-2" />
                )
              )}
            </motion.div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-night/10" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="max-w-md font-display text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em] text-paper">
            Rate what you install. Read what others found.
          </p>
          <p className="mt-3 max-w-sm text-sm text-paper/60">
            An account lets you post reviews and keeps every one you&rsquo;ve written in one place.
          </p>
        </div>
      </div>
    </div>
  )
}
