'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import { House, Compass, Search, CircleUser, User, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SearchBar } from '@/components/search/search-bar'
import { Logo } from '@/components/layout/logo'
import { getInitials, cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Today' },
  { href: '/explore', label: 'Explore' },
  { href: '/#charts', label: 'Charts' },
  { href: '/#categories', label: 'Categories' },
]

export function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [searchOpen, setSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setSearchOpen(false); setUserMenuOpen(false) }, [pathname])

  useEffect(() => {
    if (!userMenuOpen) return
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [userMenuOpen])

  const isActive = (href: string) => (href.includes('#') ? false : pathname === href)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-8">
            <Logo />

            {/* Desktop nav */}
            <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative py-1 text-sm font-medium transition-colors',
                    isActive(link.href) ? 'text-ink' : 'text-ink-2 hover:text-ink'
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -bottom-[3px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-signal"
                    />
                  )}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <SearchBar hotkey placeholder="Search apps, games, developers" className="hidden w-[300px] md:block lg:w-[340px]" />

              <button
                type="button"
                onClick={() => setSearchOpen(o => !o)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-sunken md:hidden"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {session ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setUserMenuOpen(o => !o)}
                    className="flex items-center gap-1.5 rounded-full p-1 pr-2 transition-colors hover:bg-sunken"
                    aria-label="Account menu"
                    aria-expanded={userMenuOpen}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image ?? undefined} />
                      <AvatarFallback className="text-xs">{getInitials(session.user.name ?? 'U')}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="hidden h-3.5 w-3.5 text-ink-2 sm:block" />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl bg-surface p-1.5 shadow-lift ring-1 ring-line"
                      >
                        <div className="px-3 py-2.5">
                          <p className="truncate text-sm font-semibold text-ink">{session.user.name}</p>
                          <p className="truncate text-xs text-ink-3">{session.user.email}</p>
                        </div>
                        <div className="my-1 h-px bg-line" />
                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-ink transition-colors hover:bg-sunken"
                        >
                          <User className="h-4 w-4 text-ink-2" />
                          Profile &amp; reviews
                        </Link>
                        <button
                          onClick={() => { signOut(); setUserMenuOpen(false) }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-[#9A1D14] transition-colors hover:bg-[#FDECE9]"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Create account</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile search */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden"
              >
                <div className="pb-3">
                  <SearchBar autoFocus placeholder="Search apps, games, developers" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mobile tab bar — the native store pattern */}
      <nav
        aria-label="Tabs"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      >
        <div className="grid h-[64px] grid-cols-4">
          {[
            { label: 'Today', href: '/', icon: House, active: pathname === '/' },
            { label: 'Explore', href: '/explore', icon: Compass, active: pathname.startsWith('/explore') || pathname.startsWith('/category') },
          ].map(({ label, href, icon: Icon, active }) => (
            <Link key={label} href={href} className={cn('flex flex-col items-center justify-center gap-1 text-[11px] font-medium', active ? 'text-signal-ink' : 'text-ink-3')}>
              <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.25 : 1.75} />
              {label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => { setSearchOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className={cn('flex flex-col items-center justify-center gap-1 text-[11px] font-medium', searchOpen ? 'text-signal-ink' : 'text-ink-3')}
          >
            <Search className="h-[22px] w-[22px]" strokeWidth={searchOpen ? 2.25 : 1.75} />
            Search
          </button>
          <Link
            href={session ? '/profile' : '/login'}
            className={cn('flex flex-col items-center justify-center gap-1 text-[11px] font-medium', ['/profile', '/login', '/register'].includes(pathname) ? 'text-signal-ink' : 'text-ink-3')}
          >
            <CircleUser className="h-[22px] w-[22px]" strokeWidth={1.75} />
            {session ? 'Account' : 'Sign in'}
          </Link>
        </div>
      </nav>
    </>
  )
}
