import { prisma } from '@/lib/prisma'
import { HeroSection } from './components/hero-section'
import { ChartsSection } from './components/charts-section'
import { FeaturedSection } from './components/featured-section'
import { TrendingSection } from './components/trending-section'
import { CategoriesSection } from './components/categories-section'
import { NewReleasesSection } from './components/new-releases-section'
import type { App, Category } from '@/types'

type AppRow = Awaited<ReturnType<typeof prisma.app.findMany>>[number]

function serialize(apps: AppRow[]): App[] {
  return apps.map(a => ({ ...a, screenshots: JSON.parse(a.screenshots), createdAt: a.createdAt.toISOString(), updatedAt: a.updatedAt.toISOString() })) as unknown as App[]
}

async function getFeaturedApps(): Promise<App[]> {
  const apps = await prisma.app.findMany({
    where: { featured: true },
    orderBy: { downloads: 'desc' },
    take: 8,
    include: { category: true },
  })
  return serialize(apps)
}

async function getTrendingApps(): Promise<App[]> {
  const apps = await prisma.app.findMany({
    orderBy: { downloads: 'desc' },
    take: 12,
    include: { category: true },
  })
  return serialize(apps)
}

async function getNewReleases(): Promise<App[]> {
  const apps = await prisma.app.findMany({
    orderBy: { createdAt: 'desc' },
    take: 8,
    include: { category: true },
  })
  return serialize(apps)
}

async function getCharts() {
  const [free, paid, rated] = await Promise.all([
    prisma.app.findMany({ where: { price: 0 }, orderBy: { downloads: 'desc' }, take: 5, include: { category: true } }),
    prisma.app.findMany({ where: { price: { gt: 0 } }, orderBy: { downloads: 'desc' }, take: 5, include: { category: true } }),
    prisma.app.findMany({ orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }], take: 5, include: { category: true } }),
  ])
  return { free: serialize(free), paid: serialize(paid), rated: serialize(rated) }
}

async function getCategories(): Promise<Category[]> {
  const cats = await prisma.category.findMany({
    include: { _count: { select: { apps: true } } },
    orderBy: { name: 'asc' },
  })
  return cats as unknown as Category[]
}

async function getStats() {
  const [apps, reviews] = await Promise.all([prisma.app.count(), prisma.review.count()])
  return { apps, reviews }
}

export default async function HomePage() {
  const [featured, trending, newReleases, charts, categories, counts] = await Promise.all([
    getFeaturedApps(),
    getTrendingApps(),
    getNewReleases(),
    getCharts(),
    getCategories(),
    getStats(),
  ])

  // Three distinct apps for the Today stories
  const appOfDay = featured[0] ?? trending[0]
  const used = new Set([appOfDay?.id])
  const topRated = charts.rated.find(a => !used.has(a.id))
  used.add(topRated?.id)
  const justLanded = newReleases.find(a => !used.has(a.id))

  const editorsChoice = featured.filter(a => a.id !== appOfDay?.id)

  return (
    <div>
      <HeroSection
        appOfDay={appOfDay}
        topRated={topRated}
        justLanded={justLanded}
        stats={{ apps: counts.apps, categories: categories.length, reviews: counts.reviews }}
      />
      <div className="mx-auto mt-20 max-w-7xl space-y-20 px-4 sm:px-6 lg:px-8">
        <ChartsSection free={charts.free} paid={charts.paid} rated={charts.rated} />
        <CategoriesSection categories={categories} />
        <FeaturedSection apps={editorsChoice} />
        <TrendingSection apps={trending} />
      </div>
      <NewReleasesSection apps={newReleases} />
    </div>
  )
}
