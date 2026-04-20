import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const reviews = await prisma.review.findMany({
      where: { userId: session.user.id },
      include: {
        app: {
          select: {
            id: true,
            name: true,
            icon: true,
            developer: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return Response.json({
      reviews: reviews.map((r: typeof reviews[number]) => ({ ...r, createdAt: r.createdAt.toISOString() })),
    })
  } catch (error) {
    console.error('[API GET /reviews/user]', error)
    return Response.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}
