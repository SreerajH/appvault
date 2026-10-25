import type { Metadata } from 'next'
import { Geist, Geist_Mono, Schibsted_Grotesk } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/toaster'

const body = Geist({ subsets: ['latin'], variable: '--font-body' })
const heading = Schibsted_Grotesk({ subsets: ['latin'], variable: '--font-heading', weight: ['500', '700', '800', '900'] })
const code = Geist_Mono({ subsets: ['latin'], variable: '--font-code' })

export const metadata: Metadata = {
  title: {
    default: 'AppVault — Apps worth installing',
    template: '%s | AppVault',
  },
  description: 'Hand-picked apps, ranked charts and honest reviews across every category.',
  keywords: ['apps', 'marketplace', 'download', 'software', 'mobile apps'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://appvault.app',
    siteName: 'AppVault',
    title: 'AppVault — Apps worth installing',
    description: 'Hand-picked apps, ranked charts and honest reviews.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${heading.variable} ${code.variable}`}>
      <body className="font-sans bg-paper text-ink antialiased pb-[72px] md:pb-0">
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
