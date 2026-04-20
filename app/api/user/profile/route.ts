import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, avatar: true, createdAt: true },
    })

    if (!user) return Response.json({ error: 'User not found' }, { status: 404 })

    return Response.json({ user: { ...user, createdAt: user.createdAt.toISOString() } })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name } = await request.json()
    if (!name || name.trim().length < 2) {
      return Response.json({ error: 'Name must be at least 2 characters' }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name.trim() },
      select: { id: true, name: true, email: true, avatar: true, createdAt: true },
    })

    return Response.json({ user: { ...user, createdAt: user.createdAt.toISOString() } })
  } catch (error) {
    return Response.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
