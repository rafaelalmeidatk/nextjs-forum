import { Message } from 'discord.js'
import { db } from '@nextjs-forum/db/node'
import { syncUser } from './users.js'
import { syncMessageChannel } from './channels.js'

export const syncMessage = async (message: Message) => {
  const authorAsGuildMember = await message.guild?.members.fetch(
    message.author.id
  )

  await syncUser(message.author, authorAsGuildMember)
  await syncMessageChannel(message.channel)

  await db
    .insertInto('messages')
    .values({
      snowflakeId: message.id,
      content: message.content,
      createdAt: message.createdAt,
      editedAt: message.editedAt,
      userId: message.author.id,
      postId: message.channelId,
      replyToMessageId: message.reference?.messageId,
    })
    .onDuplicateKeyUpdate({
      content: message.content,
      editedAt: message.editedAt,
    })
    .executeTakeFirst()

  if (message.attachments.size === 0) return

  await db.transaction().execute(async (trx) => {
    await trx
      .deleteFrom('attachments')
      .where('messageId', '=', message.id)
      .execute()

    await trx
      .insertInto('attachments')
      .values(
        Array.from(message.attachments.values()).map((attachment) => ({
          snowflakeId: attachment.id,
          url: attachment.url,
          name: attachment.name,
          contentType: attachment.contentType,
          messageId: message.id,
        }))
      )
      .execute()
  })
}

export const deleteMessage = async (messageId: string) => {
  await db
    .deleteFrom('messages')
    .where('snowflakeId', '=', messageId)
    .executeTakeFirst()
  await db
    .deleteFrom('attachments')
    .where('messageId', '=', messageId)
    .execute()
}

export const markMessageAsSolution = async (
  messageId: string,
  postId: string
) => {
  await db
    .updateTable('posts')
    .set({ answerId: messageId })
    .where('snowflakeId', '=', postId)
    .executeTakeFirst()
}
