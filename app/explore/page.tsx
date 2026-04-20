import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { ExploreClient } from './explore-client'
import type { App, Category } from '@/types'

interface PageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    sort?: string
    price?: string
    minRating?: string
    page?: string
  }>
}

async function getApps(params: Record<string, string | undefined>) {
  const { search = '', category = '', sort = 'popular', price = 'all', minRating = '0', page = '1', limit = '20' } = params
  const skip = (parseInt(page) - 1) * parseInt(limit)

  const where: any = {}
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { developer: { contains: search } },
    ]
  }
  if (category) where.category = { slug: category }
  if (price === 'free') where.price = 0
  if (price === 'paid') where.price = { gt: 0 }
  const minR = parseFloat(minRating)
  if (minR > 0) where.rating = { gte: minR }

  const orderBy: any = {
    popular: { downloads: 'desc' },
    rating: { rating: 'desc' },
    newest: { createdAt: 'desc' },
    name: { name: 'asc' },
  }[sort] ?? { downloads: 'desc' }

  const [apps, total] = await Promise.all([
    prisma.app.findMany({
      where, orderBy, skip, take: parseInt(limit),
      include: { category: true },
    }),
    prisma.app.count({ where }),
  ])

  return {
    apps: apps.map(a => ({
      ...a,
      screenshots: JSON.parse(a.screenshots),
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    })) as unknown as App[],
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
  }
}

export async function generateMetadata({ searchParams }: PageProps) {
  const sp = await searchParams
  const title = sp.search ? `Search: ${sp.search}` : 'Explore Apps'
  return { title }
}

export default async function ExplorePage({ searchParams }: PageProps) {
  const sp = await searchParams

  const categories = await prisma.category.findMany({
    include: { _count: { select: { apps: true } } },
    orderBy: { name: 'asc' },
  }) as unknown as Category[]

  const data = await getApps(sp as Record<string, string | undefined>)

  return (
    <ExploreClient
      initialApps={data.apps}
      initialTotal={data.total}
      initialPage={data.page}
      initialTotalPages={data.totalPages}
      categories={categories}
      searchParams={sp}
    />
  )
}
