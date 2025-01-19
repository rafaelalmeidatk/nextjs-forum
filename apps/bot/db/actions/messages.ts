import { type Message, type PartialMessage } from 'discord.js'
import { db, sql } from '@nextjs-forum/db/node'
import { addPointsToUser, removePointsFromUser, syncUser } from './users.ts'
import { syncChannel, syncMessageChannel } from './channels.ts'
import { updatePostLastActive } from './posts.ts'
import { tryToSetRegularMemberRole } from '../../lib/points.ts'

export const syncMessage = async (message: Message) => {
  const authorAsGuildMember = await message.guild?.members.fetch(
    message.author.id,
  )

  await Promise.all([
    syncUser(message.author, authorAsGuildMember),
    syncMessageChannel(message.channel),
    ...message.mentions.channels.mapValues((c) => syncChannel(c)),
    ...(message.mentions.members
      ? message.mentions.members.mapValues((m) => syncUser(m.user, m))
      : []),
  ])

  await db.transaction().execute(async (trx) => {
    await trx
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
      .onConflict((oc) =>
        oc.column('snowflakeId').doUpdateSet({
          content: message.content,
          editedAt: message.editedAt,
        }),
      )
      .executeTakeFirst()

    await addPointsToUser(message.author.id, 'message', trx)

    await updatePostLastActive(message.channelId, trx)

    // Replace attachments
    if (message.attachments.size > 0) {
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
          })),
        )
        .execute()
    }
  })

  if (authorAsGuildMember) {
    await tryToSetRegularMemberRole(authorAsGuildMember)
  }
}

export const deleteMessage = async (
  message: Message<boolean> | PartialMessage,
) => {
  await db.transaction().execute(async (trx) => {
    await trx
      .deleteFrom('messages')
      .where('snowflakeId', '=', message.id)
      .executeTakeFirst()
    await trx
      .deleteFrom('attachments')
      .where('messageId', '=', message.id)
      .execute()

    await updatePostLastActive(message.channelId, trx)

    // If the message is partial we won't remove the points of the author
    // but that is fine since it's a very minor edge case and I don't think
    // doing a fetch here is worth it
    if (message.author?.id) {
      await removePointsFromUser(message.author.id, 'message', trx)
    }
  })
}

export const markMessageAsSolution = async (
  messageId: string | null,
  postId: string,
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

      await removePointsFromUser(currentAnswer.userId, 'answer', trx)
    }

    if (messageId === null) {
      await trx
        .updateTable('posts')
        .set({ answerId: null })
        .where('snowflakeId', '=', postId)
        .executeTakeFirst()

      await updatePostLastActive(postId, trx)

      return
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

      await addPointsToUser(newAnswer.userId, 'answer', trx)
      await updatePostLastActive(postId, trx)
    }
  })
}
