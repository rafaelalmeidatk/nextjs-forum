import { largerDate } from '@/utils/datetime';
import { getBaseUrl } from '@/utils/urls'
import { db, sql } from '@nextjs-forum/db/node'

// We shouldn't need this but for some reason Next isn't revalidating this route with `revalidatePath`
export const revalidate = 60

const generateSiteMap = async () => {
  const posts = await db
    .selectFrom('posts')
    .select([
      'posts.snowflakeId',
      sql<Date>`MAX(IFNULL(posts.editedAt, posts.createdAt))`.as('lastModTime'),
      sql<Date>`MAX(IFNULL(messages.editedAt, messages.createdAt))`.as('lastMessageModTime')
    ])
    .leftJoin('messages', 'posts.snowflakeId', 'messages.postId')
    .groupBy('posts.snowflakeId')
    .limit(50_000) // we will probably need to chunk the sitemap in the future
    .execute()

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${getBaseUrl()}</loc>
       <changefreq>daily</changefreq>
       <priority>1</priority>
     </url>
     ${posts
       .map((p) => {
         return `
       <url>
          <loc>${getBaseUrl()}/post/${p.snowflakeId}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
          <lastmod>${largerDate(p.lastModTime, p.lastMessageModTime).toISOString()}</lastmod>
       </url>
     `
       })
       .join('')}
   </urlset>
 `
}

export const GET = async () => {
  const sitemap = await generateSiteMap()

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
