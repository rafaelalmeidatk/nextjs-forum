import { Channel, AnyThreadChannel, Message } from 'discord.js'
import { env } from './env.js'

export const isMessageInForumChannel = (
  channel: Channel
): channel is AnyThreadChannel<true> => {
  return channel.isThread() && channel.parentId === env.FORUM_CHANNEL_ID
}

export const isMessageSupported = (message: Message) => {
  return !message.author.bot && !message.system
}

export const isThreadInForumChannel = (thread: AnyThreadChannel<true>) => {
  return thread.parentId === env.FORUM_CHANNEL_ID
}
