import { GuildMember, User } from 'discord.js'
import { baseLog } from '../../log.js'
import { KyselyDB, TransactionDB, db, sql } from '@nextjs-forum/db/node'
import { AnimalModule, Faker, en } from '@faker-js/faker'
import { type CacheUser, usersCache } from '../../lib/cache.js'
import { env } from '../../env.js'
import { POINTS_REWARDS } from '../../lib/points.js'

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

const userChangedCheck = (userId: string, user: CacheUser) => {
  const cachedUser = usersCache.get(userId)
  if (!cachedUser) return true
  if (cachedUser.isPublic !== user.isPublic) return true
  if (cachedUser.isModerator !== user.isModerator) return true
  if (user.isPublic) {
    if (cachedUser.username !== user.username) return true
    if (cachedUser.discriminator !== user.discriminator) return true
    if (cachedUser.avatarUrl !== user.avatarUrl) return true
  }
  return false
}

export const syncUser = async (user: User, asGuildMember?: GuildMember) => {
  let isPublicProfile = false
  let isModerator = false

  if (asGuildMember) {
    if (env.PUBLIC_PROFILE_ROLE_ID) {
      isPublicProfile = asGuildMember.roles.cache.has(
        env.PUBLIC_PROFILE_ROLE_ID,
      )
    }
    if (env.MODERATOR_ROLE_ID) {
      isModerator = asGuildMember.roles.cache.has(env.MODERATOR_ROLE_ID)
    }
  }

  let username = asGuildMember?.displayName || user.displayName
  let discriminator = user.discriminator
  let avatarUrl =
    asGuildMember?.displayAvatarURL({ size: 256 }) ||
    user.displayAvatarURL({ size: 256 })

  const userCheck: CacheUser = {
    username,
    discriminator,
    avatarUrl,
    isPublic: isPublicProfile,
    isModerator,
  }
  if (!userChangedCheck(user.id, userCheck)) return

  if (!isPublicProfile) {
    // The docs says its unlikely I need to create a new instance but I am afraid of using a single
    // instance while changing the seed and ending up with a race condition with another request
    const faker = new Faker({ locale: en })
    faker.seed(user.id.split('').map(Number))

    // Generate a hopefully cool animal name because I thought the person names were looking too fake
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
      isPublic: isPublicProfile,
      isModerator,
      username,
      discriminator,
      avatarUrl,
    })
    .onConflict((oc) =>
      oc.column('snowflakeId').doUpdateSet({
        isPublic: isPublicProfile,
        isModerator,
        username,
        discriminator,
        avatarUrl,
      }),
    )
    .executeTakeFirst()

  log('Synced user (%s)', user.id)
  usersCache.set(user.id, userCheck)
}

export const getUserById = async (id: string) => {
  return db
    .selectFrom('users')
    .select(['username', 'points'])
    .where('snowflakeId', '=', id)
    .executeTakeFirst()
}

const updatePointsBySum = async (
  userId: string,
  value: number,
  trx: TransactionDB | KyselyDB = db,
) => {
  await trx
    .updateTable('users')
    .where('snowflakeId', '=', userId)
    .set((eb) => ({
      points: sql`LEAST(999999, ${eb.ref('points')} + ${value})`,
    }))
    .execute()
}

export const addPointsToUser = async (
  userId: string,
  type: keyof typeof POINTS_REWARDS,
  trx: TransactionDB | KyselyDB = db,
) => updatePointsBySum(userId, POINTS_REWARDS[type], trx)

export const addDirectPointsToUser = async (
  userId: string,
  value: number,
  trx: TransactionDB | KyselyDB = db,
) => updatePointsBySum(userId, value, trx)

export const removePointsFromUser = async (
  userId: string,
  type: keyof typeof POINTS_REWARDS,
  trx: TransactionDB | KyselyDB = db,
) => updatePointsBySum(userId, -POINTS_REWARDS[type], trx)

export const getCorrectAnswersCount = (userId: string) => {
  return db
    .selectFrom('users')
    .where('snowflakeId', '=', userId)
    .select(['answersCount'])
    .executeTakeFirst()
}
