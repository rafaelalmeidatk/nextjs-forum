import { AnyThreadChannel } from 'discord.js'
import { db, TransactionDB, KyselyDB } from '@nextjs-forum/db/node'
import { revalidateHomePage } from '../../revalidate.js'
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
      isLocked: thread.locked ? 1 : 0,
      userId: thread.ownerId,
      channelId: thread.parentId,
      lastActiveAt: now,
    })
    .onDuplicateKeyUpdate({
      title: thread.name,
      editedAt: now,
      isLocked: thread.locked ? 1 : 0,
      lastActiveAt: now,
    })
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
