import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { CategoryClient } from './category-client'
import type { App, Category } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sort?: string; price?: string; minRating?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const cat = await prisma.category.findUnique({ where: { slug } })
  if (!cat) return { title: 'Category Not Found' }
  return { title: `${cat.icon} ${cat.name} Apps` }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const sp = await searchParams

  const category = await prisma.category.findUnique({
    where: { slug },
    include: { _count: { select: { apps: true } } },
  })
  if (!category) notFound()

  const sort = sp.sort ?? 'popular'
  const price = sp.price ?? 'all'
  const minR = parseFloat(sp.minRating ?? '0')

  const where: any = { category: { slug } }
  if (price === 'free') where.price = 0
  if (price === 'paid') where.price = { gt: 0 }
  if (minR > 0) where.rating = { gte: minR }

  const orderBy: any = {
    popular: { downloads: 'desc' },
    rating: { rating: 'desc' },
    newest: { createdAt: 'desc' },
    name: { name: 'asc' },
  }[sort] ?? { downloads: 'desc' }

  const [apps, allCategories] = await Promise.all([
    prisma.app.findMany({ where, orderBy, include: { category: true } }),
    prisma.category.findMany({
      include: { _count: { select: { apps: true } } },
      orderBy: { name: 'asc' },
    }),
  ])

  const serializedApps = apps.map(a => ({
    ...a,
    screenshots: JSON.parse(a.screenshots),
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  })) as unknown as App[]

  return (
    <CategoryClient
      category={category as unknown as Category}
      apps={serializedApps}
      allCategories={allCategories as unknown as Category[]}
      searchParams={sp}
    />
  )
}
