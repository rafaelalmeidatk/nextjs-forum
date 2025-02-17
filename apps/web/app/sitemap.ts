import { MetadataRoute } from 'next'
import { getBaseUrl } from '@/utils/urls'
import { db } from '@nextjs-forum/db'

// Update sitemap only once every 6 hours
export const revalidate = 21600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await db
    .selectFrom('posts')
    .select(['snowflakeId', 'lastActiveAt'])
    .where('isIndexed', '=', true)
    .limit(50_000) // we will probably need to chunk the sitemap in the future
    .execute()

  return [
    {
      url: getBaseUrl(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...posts.map((p) => {
      return {
        url: `${getBaseUrl()}/post/${p.snowflakeId}`,
        changeFrequency: 'weekly',
        priority: 0.9,
        lastModified: p.lastActiveAt,
      } satisfies MetadataRoute.Sitemap[0]
    }),
  ]
}
