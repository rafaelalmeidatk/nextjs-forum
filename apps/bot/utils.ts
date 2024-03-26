import {
  Channel,
  AnyThreadChannel,
  Message,
  APIEmbed,
  Colors,
  InteractionReplyOptions,
  InteractionResponse,
  GuildMember,
} from 'discord.js'
import { env } from './env.js'

const START_INDEXING_AFTER = 1686438000000

export const isMessageInForumChannel = (
  channel: Channel,
): channel is AnyThreadChannel<true> => {
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

export const isThreadSupported = (thread: AnyThreadChannel<true>) => {
  const isIndexable =
    thread.createdAt !== null &&
    thread.createdAt.getTime() > START_INDEXING_AFTER
  return isIndexable
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

export const isUserProfilePublic = async (user: GuildMember) => {
  if (env.PUBLIC_PROFILE_ROLE_ID)
    return user.roles.cache.has(env.PUBLIC_PROFILE_ROLE_ID)
  else return false // If env doesn't exist, consider it as private
}
