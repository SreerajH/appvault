'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2, ArrowUpRight } from 'lucide-react'
import { AppIcon } from '@/components/apps/app-icon'
import { cn } from '@/lib/utils'

interface SearchSuggestion {
  id: string
  name: string
  category: string
  icon: string
}

interface SearchBarProps {
  initialQuery?: string
  placeholder?: string
  className?: string
  onSearch?: (query: string) => void
  /** Focus the field when "/" is pressed anywhere on the page. */
  hotkey?: boolean
  autoFocus?: boolean
  size?: 'md' | 'lg'
}

export function SearchBar({
  initialQuery = '',
  placeholder = 'Search apps...',
  className,
  onSearch,
  hotkey = false,
  autoFocus = false,
  size = 'md',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [focused, setFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [active, setActive] = useState(-1)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!focused || !query.trim() || query.length < 2) {
      setSuggestions([])
      setLoading(false)
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setSuggestions(data.suggestions ?? [])
        setActive(-1)
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, focused])

  useEffect(() => {
    if (!hotkey) return
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.key !== '/' || t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return
      e.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hotkey])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (active >= 0 && suggestions[active]) {
      handleSuggestionClick(suggestions[active])
      return
    }
    if (!query.trim()) return
    setSuggestions([])
    setFocused(false)
    inputRef.current?.blur()
    if (onSearch) {
      onSearch(query)
    } else {
      router.push(`/explore?search=${encodeURIComponent(query)}`)
    }
  }

  const handleSuggestionClick = (app: SearchSuggestion) => {
    setSuggestions([])
    setFocused(false)
    router.push(`/app/${app.id}`)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => (i + 1) % suggestions.length) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => (i <= 0 ? suggestions.length - 1 : i - 1)) }
    if (e.key === 'Escape') { setSuggestions([]); inputRef.current?.blur() }
  }

  const open = focused && suggestions.length > 0

  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit} role="search">
        <div className="relative flex items-center">
          <Search className={cn('pointer-events-none absolute left-3.5 z-10 text-ink-3', size === 'lg' ? 'h-5 w-5 left-4' : 'h-4 w-4')} />
          <input
            ref={inputRef}
            value={query}
            autoFocus={autoFocus}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            aria-label="Search apps"
            aria-expanded={open}
            aria-autocomplete="list"
            className={cn(
              'w-full rounded-full text-ink placeholder:text-ink-3 transition-[background-color,box-shadow] duration-150 outline-none',
              size === 'lg' ? 'h-14 pl-12 pr-12 text-base' : 'h-10 pl-10 pr-10 text-sm',
              focused
                ? 'bg-surface shadow-[0_0_0_1.5px_var(--color-ink)]'
                : 'bg-sunken hover:bg-[#E3DED2]'
            )}
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => { setQuery(''); setSuggestions([]); inputRef.current?.focus() }}
              className="absolute right-3 rounded-full p-0.5 text-ink-3 transition-colors hover:text-ink"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
            </button>
          ) : hotkey && !focused ? (
            <kbd className="pointer-events-none absolute right-3 rounded-md border border-ink/15 bg-paper px-1.5 font-mono text-[11px] leading-5 text-ink-3">/</kbd>
          ) : null}
        </div>
      </form>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl bg-surface p-1.5 shadow-lift ring-1 ring-line"
          >
            {suggestions.map((s, i) => (
              <li key={s.id} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseDown={() => handleSuggestionClick(s)}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors',
                    i === active ? 'bg-sunken' : 'hover:bg-sunken'
                  )}
                >
                  <AppIcon app={s} size={36} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-ink">{s.name}</div>
                    <div className="truncate text-xs text-ink-3">{s.category}</div>
                  </div>
                  <ArrowUpRight className="ml-auto h-4 w-4 text-ink-3" />
                </button>
              </li>
            ))}
            <li className="mt-1 border-t border-line px-2.5 pb-1 pt-2 text-[11px] text-ink-3">
              Press <kbd className="font-mono">Enter</kbd> to see all results for &ldquo;{query}&rdquo;
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
