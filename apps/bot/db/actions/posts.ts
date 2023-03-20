import { AnyThreadChannel } from 'discord.js'
import { db } from 'db/node'
import { syncUser } from './users.js'

export const syncPost = async (thread: AnyThreadChannel) => {
  if (thread.ownerId) {
    const owner = await thread.client.users.fetch(thread.ownerId)
    await syncUser(owner)
  }

  const now = new Date()
  return db
    .insertInto('posts')
    .values({
      id: thread.id,
      title: thread.name,
      createdAt: thread.createdAt ?? now,
      editedAt: thread.createdAt ?? now,
      isLocked: thread.locked ? 1 : 0,
      userId: thread.ownerId,
    })
    .onDuplicateKeyUpdate({
      title: thread.name,
      editedAt: now,
      isLocked: thread.locked ? 1 : 0,
    })
    .executeTakeFirst()
}
