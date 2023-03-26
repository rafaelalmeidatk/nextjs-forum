import LRUCache from 'lru-cache'

export const usersCache = new LRUCache<string, boolean>({ max: 100 })
export const channelsCache = new LRUCache<string, boolean>({ max: 10 })
