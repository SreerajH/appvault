import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { reviewSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { appId, ...reviewData } = body

    if (!appId) {
      return Response.json({ error: 'App ID is required' }, { status: 400 })
    }

    const validated = reviewSchema.safeParse(reviewData)
    if (!validated.success) {
      return Response.json({ error: validated.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
    }

    // Check if user already reviewed this app
    const existing = await prisma.review.findFirst({
      where: { userId: session.user.id, appId },
    })
    if (existing) {
      return Response.json({ error: 'You have already reviewed this app' }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: {
        ...validated.data,
        userId: session.user.id,
        appId,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    })

    // Update app rating
    const reviews = await prisma.review.findMany({ where: { appId }, select: { rating: true } })
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    await prisma.app.update({
      where: { id: appId },
      data: { rating: avgRating, reviewCount: reviews.length },
    })

    return Response.json({
      review: { ...review, createdAt: review.createdAt.toISOString() },
    }, { status: 201 })
  } catch (error) {
    console.error('[API POST /reviews]', error)
    return Response.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
