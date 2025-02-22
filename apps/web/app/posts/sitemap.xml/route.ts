import { getBaseUrl } from '@/utils/urls'
import { db } from '@nextjs-forum/db'
import { URL_PER_SITEMAP } from '@/consts'

export const revalidate = 604800 // 1 Week in seconds

export async function GET() {
  const { postCount } = await db
    .selectFrom('posts')
    .select(db.fn.count('id').as('postCount'))
    .where('isIndexed', '=', true)
    .executeTakeFirstOrThrow()

  const sitemapCount = Math.ceil(Number(postCount) / URL_PER_SITEMAP)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${Array.from(
        { length: sitemapCount },
        (_, index) => `
        <sitemap>
          <loc>${getBaseUrl()}/post/sitemap/${index}.xml</loc>
        </sitemap>`,
      ).join('\n')}
    </sitemapindex>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
