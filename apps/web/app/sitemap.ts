import { MetadataRoute } from 'next'
import { getBaseUrl } from '@/utils/urls'
import { db } from '@nextjs-forum/db'
import { URL_PER_SITEMAP } from './consts'

// Update sitemap only once every 6 hours
export const revalidate = 21600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { postCount } = await db
    .selectFrom('posts')
    .select(db.fn.count('id').as('postCount'))
    .where('isIndexed', '=', true)
    .executeTakeFirstOrThrow()
  console.log(postCount)
  const sitemapCount = Math.ceil(Number(postCount) / URL_PER_SITEMAP)
  const sitemaps: MetadataRoute.Sitemap = Array.from(
    { length: sitemapCount },
    (_, index) => ({
      url: `${getBaseUrl()}/post/sitemap/${index}.xml`,
      changeFrequency: 'daily',
      priority: 0.9,
    }),
  )

  return [
    {
      url: getBaseUrl(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...sitemaps,
  ] satisfies MetadataRoute.Sitemap
}
