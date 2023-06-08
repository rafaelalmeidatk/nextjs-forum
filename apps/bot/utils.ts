import {
  Channel,
  AnyThreadChannel,
  Message,
  APIEmbed,
  Colors,
  InteractionReplyOptions,
  InteractionResponse,
} from 'discord.js'
import { env } from './env.js'

export const isMessageInForumChannel = (
  channel: Channel
): channel is AnyThreadChannel<true> => {
  return (
    channel.isThread() &&
    channel.parentId !== null &&
    env.INDEXABLE_CHANNEL_IDS.includes(channel.parentId)
  )
}

export const isMessageSupported = (message: Message) => {
  return !message.author.bot && !message.system
}

export const isThreadInForumChannel = (thread: AnyThreadChannel<true>) => {
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
  { color = Colors.Blue, ...opts }: APIEmbed
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
  { title = '❌ Error!', color = Colors.Red, ...opts }: APIEmbed
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
