import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'AppVault — The Modern App Marketplace',
    template: '%s | AppVault',
  },
  description: 'Discover, download, and review the best applications across all categories.',
  keywords: ['apps', 'marketplace', 'download', 'software', 'mobile apps'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://appvault.app',
    siteName: 'AppVault',
    title: 'AppVault — The Modern App Marketplace',
    description: 'Discover, download, and review the best applications.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-white antialiased`}>
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
