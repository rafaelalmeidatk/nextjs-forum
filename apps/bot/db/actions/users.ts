import { User } from 'discord.js'
import { baseLog } from '../../log.js'
import { db } from 'db/node'

const log = baseLog.extend('users')

const SyncInterval = 1000 * 60 * 60 * 24 // 1 day interval for auto sync

const userSyncTimestamp: Record<string, number> = {}

export const syncUser = async (user: User) => {
  const lastSync = userSyncTimestamp[user.id]
  if (lastSync !== undefined && Date.now() - lastSync < SyncInterval) return

  await db
    .insertInto('users')
    .values({
      id: user.id,
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
  userSyncTimestamp[user.id] = Date.now()
}
