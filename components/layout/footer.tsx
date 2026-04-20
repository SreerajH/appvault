import Link from 'next/link'
import { Package, Globe, ExternalLink, Mail } from 'lucide-react'

const socials = [
  { icon: Globe,        label: 'Website',  href: '#' },
  { icon: ExternalLink, label: 'Twitter/X', href: '#' },
  { icon: Mail,         label: 'Contact',  href: '#' },
]

const accountLinks: [string, string][] = [
  ['Sign In',        '/login'],
  ['Create Account', '/register'],
  ['Profile',        '/profile'],
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand + socials */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Package className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg text-foreground">
                App<span className="text-blue-500 dark:text-blue-400">Vault</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-slate-600 dark:text-slate-400">
              The modern app marketplace. Discover, download, and review the best applications across all categories.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-5">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  title={label}
                  className="group relative p-2.5 rounded-xl border border-border
                    bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10
                    text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white
                    transition-all duration-200 hover:scale-110"
                >
                  <Icon className="size-5" />
                  {/* Tooltip */}
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-0.5 text-xs text-background opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Browse */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Browse</h3>
            <ul className="space-y-2">
              {['Explore Apps', 'Categories', 'Top Charts', 'New Releases'].map(item => (
                <li key={item}>
                  <Link
                    href="/explore"
                    className="text-sm transition-colors
                      text-slate-600 hover:text-slate-900
                      dark:text-slate-400 dark:hover:text-white"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Account</h3>
            <ul className="space-y-2">
              {accountLinks.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm transition-colors
                      text-slate-600 hover:text-slate-900
                      dark:text-slate-400 dark:hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            © 2026 AppVault. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-sm transition-colors text-slate-500 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm transition-colors text-slate-500 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
