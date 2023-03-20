import { Message } from 'discord.js'
import dbNode from 'db/node'
import { syncUser } from './users.js'

export const syncMessage = async (message: Message) => {
  await syncUser(message.author)

  return dbNode
    .insertInto('messages')
    .values({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      editedAt: message.editedAt,
      userId: message.author.id,
      postId: message.channelId,
    })
    .onDuplicateKeyUpdate({
      content: message.content,
      editedAt: message.editedAt,
    })
    .executeTakeFirst()
}
