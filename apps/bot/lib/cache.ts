import { LRUCache } from 'lru-cache'

export const usersCache = new LRUCache<string, CacheUser>({ max: 100 })
export const channelsCache = new LRUCache<string, boolean>({ max: 10 })

export interface CacheUser {
  username: string
  discriminator: string
  avatarUrl: string
  isPublic?: boolean
  isModerator?: boolean
  joinedAt?: Date
}
