import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const apps = await prisma.app.findMany({
      where: { featured: true },
      orderBy: { downloads: 'desc' },
      take: 10,
      include: { category: true },
    })
    const serialized = apps.map((app: typeof apps[number]) => ({
      ...app,
      screenshots: JSON.parse(app.screenshots),
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
    }))
    return Response.json({ apps: serialized })
  } catch (error) {
    console.error('[API /apps/featured]', error)
    return Response.json({ error: 'Failed to fetch featured apps' }, { status: 500 })
  }
}
