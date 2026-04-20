'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2 } from 'lucide-react'
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
}

export function SearchBar({ initialQuery = '', placeholder = 'Search apps...', className, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [focused, setFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!focused || !query.trim() || query.length < 2) {
      setSuggestions([])
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setSuggestions(data.suggestions ?? [])
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, focused])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setSuggestions([])
    setFocused(false)
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

  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center">
          <Search className="absolute left-4 size-5 text-blue-500 dark:text-blue-400 pointer-events-none z-10" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder={placeholder}
            className={cn(
              'w-full h-14 pl-12 pr-10 text-base rounded-xl border transition-all duration-200',
              'bg-slate-800/60 text-white placeholder:text-slate-500',
              focused
                ? 'border-blue-500/60 shadow-[0_0_0_3px_rgba(59,130,246,0.15)] outline-none'
                : 'border-white/10 hover:border-white/20'
            )}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSuggestions([]); inputRef.current?.focus() }}
              className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {loading && !query && (
            <Loader2 className="absolute right-3 h-4 w-4 text-muted-foreground animate-spin" />
          )}
        </div>
      </form>

      <AnimatePresence>
        {focused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
          >
            {suggestions.map((s) => (
              <button
                key={s.id}
                type="button"
                onMouseDown={() => handleSuggestionClick(s)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
              >
                <img src={s.icon} alt={s.name} className="h-8 w-8 rounded-lg" />
                <div>
                  <div className="text-sm font-medium text-foreground">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.category}</div>
                </div>
                <Search className="ml-auto h-3 w-3 text-muted-foreground" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
