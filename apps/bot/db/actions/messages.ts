import { Message } from 'discord.js'
import { db, sql } from '@nextjs-forum/db/node'
import { syncUser } from './users.js'
import { syncChannel, syncMessageChannel } from './channels.js'

export const syncMessage = async (message: Message) => {
  const authorAsGuildMember = await message.guild?.members.fetch(
    message.author.id
  )

  await Promise.all([
    syncUser(message.author, authorAsGuildMember),
    syncMessageChannel(message.channel),
    ...message.mentions.channels.mapValues((c) => syncChannel(c)),
    ...(message.mentions.members
      ? message.mentions.members.mapValues((m) => syncUser(m.user, m))
      : []),
  ])

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

  // Replace attachments
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
  await db.transaction().execute(async (trx) => {
    const currentAnswer = await trx
      .selectFrom('posts')
      .innerJoin('messages', 'messages.snowflakeId', 'posts.answerId')
      .select('messages.userId')
      .where('posts.snowflakeId', '=', postId)
      .executeTakeFirst()

    if (currentAnswer) {
      await trx
        .updateTable('users')
        .set((eb) => ({
          answersCount: sql`greatest(${eb.ref('answersCount')} - 1, 0)`,
        }))
        .where('snowflakeId', '=', currentAnswer.userId)
        .execute()
    }

    const newAnswer = await trx
      .selectFrom('messages')
      .select('userId')
      .where('snowflakeId', '=', messageId)
      .executeTakeFirst()

    if (newAnswer) {
      await trx
        .updateTable('posts')
        .set({ answerId: messageId })
        .where('snowflakeId', '=', postId)
        .executeTakeFirst()

      await trx
        .updateTable('users')
        .set((eb) => ({
          answersCount: sql`${eb.ref('answersCount')} + 1`,
        }))
        .where('snowflakeId', '=', newAnswer.userId)
        .execute()
    }
  })
}
