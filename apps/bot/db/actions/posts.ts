import { AnyThreadChannel } from 'discord.js'
import { db } from '@nextjs-forum/db/node'
import { revalidateHomePage, revalidateSitemap } from '../../revalidate.js'

export const syncPost = async (thread: AnyThreadChannel) => {
  const now = new Date()
  await db
    .insertInto('posts')
    .values({
      snowflakeId: thread.id,
      title: thread.name,
      createdAt: thread.createdAt ?? now,
      editedAt: thread.createdAt ?? now,
      isLocked: thread.locked ? 1 : 0,
      userId: thread.ownerId,
      channelId: thread.parentId,
      lastActiveAt: new Date()
    })
    .onDuplicateKeyUpdate({
      title: thread.name,
      editedAt: now,
      isLocked: thread.locked ? 1 : 0,
      lastActiveAt: new Date()
    })
    .executeTakeFirst()

  await revalidateHomePage()
}

export const deletePost = async (postId: string) => {
  await db.deleteFrom('posts').where('snowflakeId', '=', postId).execute()
  await db.deleteFrom('messages').where('postId', '=', postId).execute()
}

export const updatePostLastActive = async (postId: string) => {
  await db
    .updateTable('posts')
    .where('snowflakeId', '=', postId)
    .set({ lastActiveAt: new Date() })
    .execute()

  // revalidate sitemap (its the only thing using the last active data)
  await revalidateSitemap()
}
