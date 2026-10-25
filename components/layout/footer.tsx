import Link from 'next/link'
import { Logo } from '@/components/layout/logo'

const columns: { title: string; links: [string, string][] }[] = [
  {
    title: 'Browse',
    links: [
      ['Today', '/'],
      ['Explore all apps', '/explore'],
      ['Top charts', '/#charts'],
      ['New & updated', '/explore?sort=newest'],
      ['Highest rated', '/explore?sort=rating'],
    ],
  },
  {
    title: 'Pricing',
    links: [
      ['Free apps', '/explore?price=free'],
      ['Paid apps', '/explore?price=paid'],
      ['4 stars and up', '/explore?minRating=4'],
    ],
  },
  {
    title: 'Account',
    links: [
      ['Sign in', '/login'],
      ['Create account', '/register'],
      ['Your reviews', '/profile'],
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-2">
              Hand-picked apps, ranked charts and reviews from people who actually installed them.
            </p>
          </div>

          {columns.map(col => (
            <div key={col.title} className="md:col-span-2 lg:col-span-2">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-ink-2 transition-colors hover:text-ink">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 AppVault</p>
          <div className="flex items-center gap-5">
            <Link href="#" className="transition-colors hover:text-ink">Privacy</Link>
            <Link href="#" className="transition-colors hover:text-ink">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
