'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/search/search-bar'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl">
        {/* A missing tile in the home-screen grid */}
        <div className="mb-8 grid w-fit grid-cols-3 gap-2" aria-hidden>
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className={i === 4 ? 'h-10 w-10 rounded-[22.5%] border-2 border-dashed border-signal' : 'h-10 w-10 rounded-[22.5%] bg-sunken'}
            />
          ))}
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-3">Error 404</p>
        <h1 className="mt-2 font-display text-[44px] font-black leading-[0.95] tracking-[-0.04em] text-ink sm:text-[60px]">
          This one isn&rsquo;t on the shelf.
        </h1>
        <p className="mt-4 max-w-md text-ink-2">
          The page or app you&rsquo;re after has moved or never existed. Try searching for it instead.
        </p>
        <SearchBar placeholder="Search apps, games, developers" size="lg" className="mt-8 max-w-md" />
        <div className="mt-6 flex items-center gap-2">
          <Button asChild>
            <Link href="/">Back to Today</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/explore">Browse all apps</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
