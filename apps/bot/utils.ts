import { Channel, AnyThreadChannel, Message } from 'discord.js'
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
