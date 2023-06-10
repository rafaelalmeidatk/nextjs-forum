import { db } from '@nextjs-forum/db/node'
import { channelsCache } from '../../lib/cache.js'
import { Channel, ChannelType } from 'discord.js'
import { baseLog } from '../../log.js'
import { isMessageInForumChannel } from '../../utils.js'

const log = baseLog.extend('channels')

export const syncMessageChannel = async (messageChannel: Channel) => {
  if (!isMessageInForumChannel(messageChannel) || !messageChannel.parent) return
  const mainChannel = messageChannel.parent

  if (
    mainChannel.type !== ChannelType.GuildForum &&
    mainChannel.type !== ChannelType.GuildText
  )
    return

  const isCached = channelsCache.get(mainChannel.id)
  if (isCached) return

  await db
    .insertInto('channels')
    .values({
      snowflakeId: mainChannel.id,
      name: mainChannel.name,
      type: mainChannel.type,
      topic: mainChannel.topic ?? '',
    })
    .onDuplicateKeyUpdate({
      name: mainChannel.name,
      topic: mainChannel.topic ?? '',
    })
    .executeTakeFirst()

  log('Synced channel (#%s)', mainChannel.name)
  channelsCache.set(mainChannel.id, true)
}
