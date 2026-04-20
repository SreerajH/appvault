import { NextRequest } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const app = await prisma.app.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
      select: { slug: true },
    })

    const filePath = join(process.cwd(), 'public', 'downloads', 'app-placeholder.apk')
    const fileBuffer = readFileSync(filePath)
    const filename = `${app.slug}-v1.0.apk`

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('[API /apps/[id]/download]', error)
    return Response.json({ error: 'Download failed' }, { status: 500 })
  }
}
