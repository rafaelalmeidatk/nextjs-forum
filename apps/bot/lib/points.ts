import { LRUCache } from 'lru-cache'
import { env } from '../env.js'
import { Colors, GuildMember } from 'discord.js'
import { getUserById } from '../db/actions/users.js'

export const POINTS_REWARDS = {
  message: 2,
  question: 20,
  answer: 50,
} as const

const REQUIRED_POINTS_FOR_ROLE = 1000
const USER_ROLE_SYNC_INTERVAL = 1000 * 60 * 60 // 1 hour

const lastUserSync = new LRUCache<string, number>({ max: 100 })

export const tryToAssignRegularMemberRole = async (
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
  if (member.roles.cache.has(env.REGULAR_MEMBER_ROLE_ID)) return

  const user = await getUserById(member.id)
  if (!user || user.points < REQUIRED_POINTS_FOR_ROLE) return

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
