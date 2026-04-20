import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const apps = await prisma.app.findMany({
      orderBy: { downloads: 'desc' },
      take: 12,
      include: { category: true },
    })
    const serialized = apps.map(app => ({
      ...app,
      screenshots: JSON.parse(app.screenshots),
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
    }))
    return Response.json({ apps: serialized })
  } catch (error) {
    console.error('[API /apps/trending]', error)
    return Response.json({ error: 'Failed to fetch trending apps' }, { status: 500 })
  }
}
