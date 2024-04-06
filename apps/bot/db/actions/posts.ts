import { AnyThreadChannel } from 'discord.js'
import { db, TransactionDB, KyselyDB } from '@nextjs-forum/db/node'
import { revalidateHomePage, revalidatePost } from '../../revalidate.js'
import { removePointsFromUser } from './users.js'

export const syncPost = async (thread: AnyThreadChannel) => {
  const now = new Date()
  await db
    .insertInto('posts')
    .values({
      snowflakeId: thread.id,
      title: thread.name,
      createdAt: thread.createdAt ?? now,
      editedAt: thread.createdAt ?? now,
      isLocked: Boolean(thread.locked),
      userId: thread.ownerId,
      channelId: thread.parentId,
      lastActiveAt: now,
    })
    .onConflict((oc) =>
      oc.column('snowflakeId').doUpdateSet({
        title: thread.name,
        editedAt: now,
        isLocked: Boolean(thread.locked),
        lastActiveAt: now,
      }),
    )
    .executeTakeFirst()

  await revalidateHomePage()
}

export const deletePost = async (thread: AnyThreadChannel<boolean>) => {
  await db.transaction().execute(async (trx) => {
    await trx.deleteFrom('posts').where('snowflakeId', '=', thread.id).execute()
    await trx.deleteFrom('messages').where('postId', '=', thread.id).execute()

    if (thread.ownerId) {
      await removePointsFromUser(thread.ownerId, 'question', trx)
    }
  })
}

export const updatePostLastActive = async (
  postId: string,
  trx: TransactionDB | KyselyDB = db,
) => {
  await trx
    .updateTable('posts')
    .where('snowflakeId', '=', postId)
    .set({ lastActiveAt: new Date() })
    .execute()
}

export const unindexPost = async (channel: AnyThreadChannel<boolean>) => {
  await db
    .updateTable('posts')
    .where('snowflakeId', '=', channel.id)
    .set({ isIndexed: false })
    .execute()

  if (channel.ownerId) {
    await removePointsFromUser(channel.ownerId, 'question')
  }

  await revalidatePost(channel.id)
}
