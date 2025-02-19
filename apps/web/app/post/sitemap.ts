import { MetadataRoute } from 'next'
import { getBaseUrl } from '@/utils/urls'
import { db } from '@nextjs-forum/db'
import { URL_PER_SITEMAP } from '@/consts'

// Update sitemap only once every 6 hours
export const revalidate = 21600

export async function generateSitemaps() {
  const { postCount } = await db
    .selectFrom('posts')
    .select(db.fn.count('id').as('postCount'))
    .where('isIndexed', '=', true)
    .executeTakeFirstOrThrow()

  const sitemapCount = Math.ceil(Number(postCount) / URL_PER_SITEMAP)
  const sitemaps = Array.from({ length: sitemapCount }, (_, index) => ({
    id: index,
  }))

  return sitemaps
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  const start = id * URL_PER_SITEMAP
  const posts = await db
    .selectFrom('posts')
    .select(['snowflakeId', 'lastActiveAt'])
    .where('isIndexed', '=', true)
    .offset(start)
    .limit(URL_PER_SITEMAP)
    .execute()

  return posts.map((p) => ({
    url: `${getBaseUrl()}/post/${p.snowflakeId}`,
    changeFrequency: 'weekly',
    priority: 0.9,
    lastModified: p.lastActiveAt,
  })) satisfies MetadataRoute.Sitemap
}
