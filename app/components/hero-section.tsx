'use client'
import { motion } from 'framer-motion'
import { SearchBar } from '@/components/search/search-bar'
import { Package, Zap, Star, Shield } from 'lucide-react'

const features = [
  { icon: Zap,    label: '40+ Apps'  },
  { icon: Star,   label: 'Top Rated' },
  { icon: Shield, label: 'Verified'  },
]

const orbVariants = {
  animate: {
    scale: [1, 1.1, 1],
    transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' as const },
  },
}

const orbVariantsDelayed = {
  animate: {
    scale: [1, 1.1, 1],
    transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' as const, delay: 2 },
  },
}

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden pt-20 pb-36 bg-[radial-gradient(ellipse_at_top,#0f1f3d_0%,#0A0F1E_60%)]"
    >
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={orbVariants}
          animate="animate"
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl bg-blue-500/20"
        />
        <motion.div
          variants={orbVariantsDelayed}
          animate="animate"
          className="absolute -top-40 -right-40 w-[400px] h-[400px] rounded-full blur-3xl bg-purple-500/15"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl bg-blue-600/[0.05]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 bg-blue-500/10 border border-blue-500/30 text-blue-400"
          >
            <Package className="h-4 w-4" />
            The Modern App Marketplace
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight text-white"
          >
            Discover the{' '}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Best Apps
            </span>
            {' '}for Every Need
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed text-slate-300"
          >
            Browse thousands of curated applications across productivity, games, entertainment and more. Find your next favourite app today.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto mb-10 px-6"
          >
            <SearchBar
              placeholder="Search apps, games, tools..."
              className="text-base"
            />
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-6 text-sm text-slate-400"
          >
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon className="h-4 w-4 text-blue-400" />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
