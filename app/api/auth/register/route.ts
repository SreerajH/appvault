import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = registerSchema.safeParse(body)

    if (!validated.success) {
      return Response.json({ error: validated.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
    }

    const { name, email, password } = validated.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return Response.json({ error: 'Email already registered' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, createdAt: true },
    })

    return Response.json({ user: { ...user, createdAt: user.createdAt.toISOString() } }, { status: 201 })
  } catch (error) {
    console.error('[API POST /auth/register]', error)
    return Response.json({ error: 'Registration failed' }, { status: 500 })
  }
}
