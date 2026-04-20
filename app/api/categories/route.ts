import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { apps: true } },
      },
      orderBy: { name: 'asc' },
    })
    return Response.json({ categories })
  } catch (error) {
    console.error('[API /categories]', error)
    return Response.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
