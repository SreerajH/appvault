import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const search = searchParams.get('search') ?? ''
    const category = searchParams.get('category') ?? ''
    const sort = searchParams.get('sort') ?? 'popular'
    const price = searchParams.get('price') ?? 'all'
    const minRating = parseFloat(searchParams.get('minRating') ?? '0')
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50)
    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { developer: { contains: search } },
        { description: { contains: search } },
      ]
    }

    if (category) {
      where.category = { slug: category }
    }

    if (price === 'free') where.price = 0
    if (price === 'paid') where.price = { gt: 0 }
    if (minRating > 0) where.rating = { gte: minRating }

    const orderBy: any = {
      popular: { downloads: 'desc' },
      rating: { rating: 'desc' },
      newest: { createdAt: 'desc' },
      name: { name: 'asc' },
    }[sort] ?? { downloads: 'desc' }

    const [apps, total] = await Promise.all([
      prisma.app.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { category: true },
      }),
      prisma.app.count({ where }),
    ])

    const serialized = apps.map(app => ({
      ...app,
      screenshots: JSON.parse(app.screenshots),
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
    }))

    return Response.json({
      apps: serialized,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('[API /apps]', error)
    return Response.json({ error: 'Failed to fetch apps' }, { status: 500 })
  }
}
