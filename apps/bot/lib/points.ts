import { LRUCache } from 'lru-cache'
import { env } from '../env.js'
import { Colors, GuildMember } from 'discord.js'
import { getUserById } from '../db/actions/users.js'

export const POINTS_REWARDS = {
  message: 2,
  question: 20,
  answer: 50,
} as const
export const REQUIRED_POINTS_FOR_ROLE = 1000

const USER_ROLE_SYNC_INTERVAL = 1000 * 60 * 60 // 1 hour

const lastUserSync = new LRUCache<string, number>({ max: 100 })

export const tryToSetRegularMemberRole = async (
  member: GuildMember,
  skipCache: boolean = false,
) => {
  if (!env.REGULAR_MEMBER_ROLE_ID) return

  const lastSync = lastUserSync.get(member.id)
  if (
    !skipCache &&
    lastSync &&
    Date.now() - lastSync < USER_ROLE_SYNC_INTERVAL
  ) {
    return
  }

  lastUserSync.set(member.id, Date.now())

  const user = await getUserById(member.id)
  if (!user) return

  const userPointsSatisfyRole = user.points >= REQUIRED_POINTS_FOR_ROLE
  const memberHasRole = member.roles.cache.has(env.REGULAR_MEMBER_ROLE_ID)

  if (memberHasRole && userPointsSatisfyRole) return
  if (!memberHasRole && !userPointsSatisfyRole) return

  if (memberHasRole && !userPointsSatisfyRole) {
    await member.roles.remove(env.REGULAR_MEMBER_ROLE_ID)
    // We don't need to alert the user about this.
    return
  }

  // Now, it is !memberHasRole && userPointsSatisfyRole
  await member.roles.add(env.REGULAR_MEMBER_ROLE_ID)
  await member.send({
    embeds: [
      {
        color: Colors.Blurple,
        title: 'New role assigned',
        description:
          'You have been assigned the Regular Member role! This role is given to users who have contributed to the community by helping other users and/or participating on the server. Thank you for your contributions!',
      },
    ],
  })
}
