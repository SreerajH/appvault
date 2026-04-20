import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const app = await prisma.app.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    })

    if (!app) {
      return Response.json({ error: 'App not found' }, { status: 404 })
    }

    const serialized = {
      ...app,
      screenshots: JSON.parse(app.screenshots),
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
      reviews: app.reviews.map((r: any) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
    }

    return Response.json({ app: serialized })
  } catch (error) {
    console.error('[API /apps/[id]]', error)
    return Response.json({ error: 'Failed to fetch app' }, { status: 500 })
  }
}
