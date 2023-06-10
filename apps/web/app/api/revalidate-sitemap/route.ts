import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export const POST = async (request: NextRequest) => {
  const secret = request.headers.get('authorization')?.split(' ')[1]

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  console.log('Triggering sitemap revalidation')
  revalidatePath('/sitemap.xml')
  return NextResponse.json({ revalidated: true })
}
