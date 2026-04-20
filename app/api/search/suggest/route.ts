import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get('q') ?? ''
    if (!q || q.length < 2) {
      return Response.json({ suggestions: [] })
    }

    const apps = await prisma.app.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { developer: { contains: q } },
        ],
      },
      select: {
        id: true,
        name: true,
        icon: true,
        category: { select: { name: true } },
      },
      take: 6,
      orderBy: { downloads: 'desc' },
    })

    const suggestions = apps.map((app: typeof apps[number]) => ({
      id: app.id,
      name: app.name,
      icon: app.icon,
      category: app.category.name,
    }))

    return Response.json({ suggestions })
  } catch (error) {
    console.error('[API /search/suggest]', error)
    return Response.json({ suggestions: [] })
  }
}
