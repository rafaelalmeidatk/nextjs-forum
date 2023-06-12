import { GuildMember, User } from 'discord.js'
import { baseLog } from '../../log.js'
import { db } from '@nextjs-forum/db/node'
import { AnimalModule, Faker, en } from '@faker-js/faker'
import { usersCache } from '../../lib/cache.js'
import { env } from '../../env.js'

const log = baseLog.extend('users')

const getDefaultAvatarForNumber = (n: number) =>
  `https://cdn.discordapp.com/embed/avatars/${n}.png`

const allowedAnimalTypes: Array<keyof AnimalModule> = [
  'bear',
  'bird',
  'cat',
  'crocodilia',
  'dog',
  'fish',
  'insect',
  'lion',
  'rabbit',
]

export const syncUser = async (user: User, asGuildMember?: GuildMember) => {
  const isCached = usersCache.get(user.id)
  if (isCached) return

  let isPublicProfile = false

  if (env.PUBLIC_PROFILE_ROLE_ID && asGuildMember) {
    isPublicProfile = asGuildMember.roles.cache.has(env.PUBLIC_PROFILE_ROLE_ID)
  }

  let username = user.username
  let discriminator = user.discriminator
  let avatarUrl = user.displayAvatarURL({ size: 256 })

  if (!isPublicProfile) {
    // The docs says its unlikely I need to create a new instance but I am afraid of using a single
    // instance while changing the seed and ending up with a race condition with another request
    const faker = new Faker({ locale: en })
    faker.seed(user.id.split('').map(Number))

    // Generate a hopefully cool animal name because I thought the person names were weird for a Discord app
    const animalType = faker.helpers.arrayElement(allowedAnimalTypes)
    const animalName = faker.animal[animalType]()

    username = animalName
    discriminator = faker.string.numeric(4)
    avatarUrl = getDefaultAvatarForNumber(faker.number.int({ min: 0, max: 5 }))
  }

  await db
    .insertInto('users')
    .values({
      snowflakeId: user.id,
      isPublic: isPublicProfile ? 1 : 0,
      username,
      discriminator,
      avatarUrl,
    })
    .onDuplicateKeyUpdate({
      isPublic: isPublicProfile ? 1 : 0,
      username,
      discriminator,
      avatarUrl,
    })
    .executeTakeFirst()

  log('Synced user (%s)', user.id)
  usersCache.set(user.id, true)
}

export const getUserById = async (id: string) => {
  return db
    .selectFrom('users')
    .select('username')
    .where('snowflakeId', '=', id)
    .executeTakeFirst()
}
