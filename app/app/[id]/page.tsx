import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { AppDetailClient } from './app-detail-client'
import type { AppWithReviews } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getApp(id: string) {
  const app = await prisma.app.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
  if (!app) return null
  return {
    ...app,
    screenshots: JSON.parse(app.screenshots),
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
    reviews: app.reviews.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })),
  } as unknown as AppWithReviews
}

async function getSimilarApps(categoryId: string, excludeId: string) {
  const apps = await prisma.app.findMany({
    where: { categoryId, id: { not: excludeId } },
    include: { category: true },
    take: 4,
    orderBy: { downloads: 'desc' },
  })
  return apps.map(a => ({
    ...a,
    screenshots: JSON.parse(a.screenshots),
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const app = await getApp(id)
  if (!app) return { title: 'App Not Found' }
  return {
    title: app.name,
    description: app.description.slice(0, 160),
    openGraph: {
      title: app.name,
      description: app.description.slice(0, 160),
      images: [{ url: app.icon }],
    },
  }
}

export default async function AppDetailPage({ params }: PageProps) {
  const { id } = await params
  const [app, similar] = await Promise.all([
    getApp(id),
    getApp(id).then(a => a ? getSimilarApps(a.categoryId, a.id) : []),
  ])

  if (!app) notFound()

  return <AppDetailClient app={app} similarApps={similar as any} />
}
