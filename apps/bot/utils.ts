import {
  type Channel,
  type AnyThreadChannel,
  type Message,
  type APIEmbed,
  Colors,
  type InteractionReplyOptions,
  type InteractionResponse,
} from 'discord.js'
import { env } from './env.ts'

const START_INDEXING_AFTER = 1686438000000

export const isMessageInForumChannel = (
  channel: Channel,
): channel is AnyThreadChannel => {
  return (
    channel.isThread() &&
    channel.parentId !== null &&
    env.INDEXABLE_CHANNEL_IDS.includes(channel.parentId)
  )
}

export const isMessageSupported = (message: Message) => {
  const isIndexable = message.createdAt.getTime() > START_INDEXING_AFTER
  return !message.author.bot && !message.system && isIndexable
}

export const isThreadSupported = (thread: AnyThreadChannel) => {
  const isIndexable =
    thread.createdAt !== null &&
    thread.createdAt.getTime() > START_INDEXING_AFTER
  return isIndexable
}

export const isThreadInForumChannel = (thread: AnyThreadChannel) => {
  return (
    thread.parentId !== null &&
    env.INDEXABLE_CHANNEL_IDS.includes(thread.parentId)
  )
}

type Replyable = {
  reply: (content: InteractionReplyOptions) => Promise<InteractionResponse>
}

export const replyWithEmbed = (
  replyable: Replyable,
  { color = Colors.Blue, ...opts }: APIEmbed,
) => {
  return replyable.reply({
    embeds: [
      {
        color,
        ...opts,
      },
    ],
  })
}

export const replyWithEmbedError = (
  replyable: Replyable,
  { title = '❌ Error!', color = Colors.Red, ...opts }: APIEmbed,
) => {
  return replyable.reply({
    ephemeral: true,
    embeds: [
      {
        title,
        color,
        ...opts,
      },
    ],
  })
}
