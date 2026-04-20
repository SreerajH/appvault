import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { HeroSection } from './components/hero-section'
import { FeaturedSection } from './components/featured-section'
import { TrendingSection } from './components/trending-section'
import { CategoriesSection } from './components/categories-section'
import { NewReleasesSection } from './components/new-releases-section'
import { AppGridSkeleton } from '@/components/common/loading-skeleton'
import type { App, Category } from '@/types'

async function getFeaturedApps(): Promise<App[]> {
  const apps = await prisma.app.findMany({
    where: { featured: true },
    orderBy: { downloads: 'desc' },
    take: 8,
    include: { category: true },
  })
  return apps.map(a => ({ ...a, screenshots: JSON.parse(a.screenshots), createdAt: a.createdAt.toISOString(), updatedAt: a.updatedAt.toISOString() })) as unknown as App[]
}

async function getTrendingApps(): Promise<App[]> {
  const apps = await prisma.app.findMany({
    orderBy: { downloads: 'desc' },
    take: 12,
    include: { category: true },
  })
  return apps.map(a => ({ ...a, screenshots: JSON.parse(a.screenshots), createdAt: a.createdAt.toISOString(), updatedAt: a.updatedAt.toISOString() })) as unknown as App[]
}

async function getNewReleases(): Promise<App[]> {
  const apps = await prisma.app.findMany({
    orderBy: { createdAt: 'desc' },
    take: 8,
    include: { category: true },
  })
  return apps.map(a => ({ ...a, screenshots: JSON.parse(a.screenshots), createdAt: a.createdAt.toISOString(), updatedAt: a.updatedAt.toISOString() })) as unknown as App[]
}

async function getCategories(): Promise<Category[]> {
  const cats = await prisma.category.findMany({
    include: { _count: { select: { apps: true } } },
    orderBy: { name: 'asc' },
  })
  return cats as unknown as Category[]
}

export default async function HomePage() {
  const [featured, trending, newReleases, categories] = await Promise.all([
    getFeaturedApps(),
    getTrendingApps(),
    getNewReleases(),
    getCategories(),
  ])

  return (
    <div className="min-h-screen">
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <CategoriesSection categories={categories} />
        <FeaturedSection apps={featured} />
        <TrendingSection apps={trending} />
        <NewReleasesSection apps={newReleases} />
      </div>
    </div>
  )
}
