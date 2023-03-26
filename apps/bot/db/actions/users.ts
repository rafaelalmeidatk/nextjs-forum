import { User } from 'discord.js'
import { baseLog } from '../../log.js'
import { db } from 'db/node'
import { usersCache } from '../../lib/cache.js'

const log = baseLog.extend('users')

export const syncUser = async (user: User) => {
  const isCached = usersCache.get(user.id)
  if (isCached) return

  await db
    .insertInto('users')
    .values({
      snowflakeId: user.id,
      username: user.username,
      discriminator: user.discriminator,
      avatarUrl: user.displayAvatarURL({ size: 256 }),
    })
    .onDuplicateKeyUpdate({
      username: user.username,
      discriminator: user.discriminator,
    })
    .executeTakeFirst()

  log('Synced user (%s)', user.id)
  usersCache.set(user.id, true)
}
