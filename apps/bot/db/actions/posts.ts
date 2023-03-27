import { AnyThreadChannel } from 'discord.js'
import { db } from 'db/node'

export const syncPost = async (thread: AnyThreadChannel) => {
  const now = new Date()
  return db
    .insertInto('posts')
    .values({
      snowflakeId: thread.id,
      title: thread.name,
      createdAt: thread.createdAt ?? now,
      editedAt: thread.createdAt ?? now,
      isLocked: thread.locked ? 1 : 0,
      userId: thread.ownerId,
      channelId: thread.parentId,
    })
    .onDuplicateKeyUpdate({
      title: thread.name,
      editedAt: now,
      isLocked: thread.locked ? 1 : 0,
    })
    .executeTakeFirst()
}

export const deletePost = async (postId: string) => {
  await db.deleteFrom('posts').where('snowflakeId', '=', postId).execute()
  await db.deleteFrom('messages').where('postId', '=', postId).execute()
}
