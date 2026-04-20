'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Package, Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-8xl font-black text-slate-800 mb-4 select-none">404</div>
        <div className="mb-6 p-4 rounded-2xl bg-slate-800/50 inline-flex">
          <Package className="h-12 w-12 text-slate-600" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-slate-400 mb-8 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/"><Home className="h-4 w-4 mr-2" />Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/explore"><Search className="h-4 w-4 mr-2" />Explore Apps</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
