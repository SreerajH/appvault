import {
  ListChecks, MessageCircle, Gamepad2, Clapperboard, GraduationCap,
  HeartPulse, Wallet, Camera, LayoutGrid, type LucideIcon,
} from 'lucide-react'
import { generateColorFromString } from '@/lib/utils'

/* ── App colour ──────────────────────────────────────────────
   Seeded icons are placehold.co URLs that carry the brand hex
   (…/96x96/3B82F6/FFFFFF…). We lift that colour so cards can be
   tinted per-app; real uploaded icons fall back to a hashed hue. */

const PLACEHOLD = /placehold\.co\/(\d+)x(\d+)\/([0-9a-fA-F]{6})\/([0-9a-fA-F]{6})/

export function appTint(app: { icon: string; name: string }): string {
  const m = app.icon.match(PLACEHOLD)
  if (m) return `#${m[3].toUpperCase()}`
  return hslToHex(generateColorFromString(app.name))
}

/** Request a sharper placeholder icon at the size we actually render.
    PNG, because placehold.co's default SVG can't load its font inside <img>. */
export function iconSrc(url: string, size = 192): string {
  return placeholdPng(url, size, size)
}

/** Same treatment for any placehold.co image (screenshots), keeping its own size by default. */
export function placeholdPng(url: string, w?: number, h?: number): string {
  const m = url.match(PLACEHOLD)
  if (!m) return url
  const query = url.includes('?') ? url.slice(url.indexOf('?')) : ''
  const sep = query ? '&' : '?'
  return `https://placehold.co/${w ?? m[1]}x${h ?? m[2]}/${m[3]}/${m[4]}/png${query}${query.includes('font=') ? '' : `${sep}font=poppins`}`
}

function hslToHex(hsl: string): string {
  const m = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
  if (!m) return '#57534B'
  const h = +m[1], s = +m[2] / 100, l = +m[3] / 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return '#' + [f(0), f(8), f(4)].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('')
}

function luminance(hex: string): number {
  const c = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map(i => {
    const v = parseInt(c.slice(i, i + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** True when white text reads better than ink on this background. */
export function prefersLightText(hex: string): boolean {
  const L = luminance(hex)
  return (1.05 / (L + 0.05)) >= ((L + 0.05) / (0.0065 + 0.05))
}

/** Mix a hex colour toward black (amt < 0) or white (amt > 0). */
export function shade(hex: string, amt: number): string {
  const c = hex.replace('#', '')
  const target = amt < 0 ? 0 : 255
  const p = Math.abs(amt)
  return '#' + [0, 2, 4]
    .map(i => {
      const v = parseInt(c.slice(i, i + 2), 16)
      return Math.round(v + (target - v) * p).toString(16).padStart(2, '0')
    })
    .join('')
}

/* ── Categories ─────────────────────────────────────────────── */

interface CategoryStyle { bg: string; fg: string; Icon: LucideIcon }

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  productivity:     { bg: '#DCE3F2', fg: '#1F3B82', Icon: ListChecks },
  social:           { bg: '#F4DCE2', fg: '#8E1F43', Icon: MessageCircle },
  games:            { bg: '#E3DEF3', fg: '#47298F', Icon: Gamepad2 },
  entertainment:    { bg: '#F5E2CC', fg: '#84400F', Icon: Clapperboard },
  education:        { bg: '#DCE8D6', fg: '#24532C', Icon: GraduationCap },
  'health-fitness': { bg: '#F5D8CF', fg: '#922B14', Icon: HeartPulse },
  finance:          { bg: '#D6E9E2', fg: '#0E5546', Icon: Wallet },
  photography:      { bg: '#EBE3CD', fg: '#5A4812', Icon: Camera },
}

export function categoryStyle(slug: string): CategoryStyle {
  return CATEGORY_STYLES[slug] ?? { bg: '#E6E1D6', fg: '#3D3A33', Icon: LayoutGrid }
}

/* ── Copy helpers ───────────────────────────────────────────── */

function clip(s: string, max: number): string {
  return s.length > max ? s.slice(0, max).replace(/[\s,;:]+\S*$/, '') + '…' : s
}

export function firstSentence(text: string, max = 110): string {
  return clip(text.split(/(?<=[.!?])\s/)[0] ?? text, max)
}

/** Editorial one-liner: first sentence with the "<Name> is …" lead-in removed. */
export function tagline(app: { name: string; description: string }, max = 90): string {
  let s = text1(app.description)
  const name = app.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  // "Foo is the best…" → "The best…";  "Foo turns photos…" → "Turns photos…"
  const lead = new RegExp(`^${name}\\s+((is|are)\\s+)?(?=[a-z])`)
  if (lead.test(s)) {
    s = s.replace(lead, '')
    s = s.charAt(0).toUpperCase() + s.slice(1)
  }
  return clip(s.replace(/\.$/, ''), max)
}

function text1(text: string): string {
  return text.split(/(?<=[.!?])\s/)[0] ?? text
}

export function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}
