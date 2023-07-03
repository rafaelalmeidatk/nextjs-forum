import { toHTML } from 'discord-markdown'
import { load } from 'cheerio'
import { db } from '@nextjs-forum/db/node'
import { getCanonicalPostUrl } from './urls'
import { sanitizeText } from 'simple-markdown'
import LRUCache from 'lru-cache'


const userCache = new LRUCache<string, UserCache>({ max: 15, ttl: 1000 * 60 })
const channelCache = new LRUCache<string, ChannelCache>({ max: 15, ttl: 1000 * 60 })
const postCache = new LRUCache<string, PostCache>({ max: 15, ttl: 1000 * 60 })

interface UserCache {
  snowflakeId: string
  username: string
}

interface ChannelCache {
  snowflakeId: string
  name: string
}

interface PostCache {
  snowflakeId: string
  title: string
}

const fetchUser = async (userId: string) => {
  const user = userCache.get(userId)
  if (user) return user

  const dbUser = await db
    .selectFrom('users')
    .select(['snowflakeId', 'username'])
    .where('snowflakeId', '=', userId)
    .executeTakeFirst()

  if (!dbUser) return null
  userCache.set(userId, dbUser)
  return dbUser
}

const fetchChannel = async (channelId: string) => {
  const channel = channelCache.get(channelId)
  if (channel) return channel

  const dbChannel = await db
    .selectFrom('channels')
    .select(['snowflakeId', 'name'])
    .where('snowflakeId', '=', channelId)
    .executeTakeFirst()

  if (!dbChannel) return null
  channelCache.set(channelId, dbChannel)
  return dbChannel
}

const fetchPost = async (postId: string) => {
  const post = postCache.get(postId)
  if (post) return post

  const dbPost = await db
    .selectFrom('posts')
    .select(['snowflakeId', 'title'])
    .where('snowflakeId', '=', postId)
    .executeTakeFirst()

  if (!dbPost) return null
  postCache.set(postId, dbPost)
  return dbPost
}

const linkRegex = /https:\/\/discord\.com\/channels\/(?<guild>\d+)\/(?<channel>\d+)(\/(?<message>\d+))?/g;
const userMention = /<@!?(?<user>\d+)>/g;
const channelMention = /<#(?<channel>\d+)>/g;

export const extractMentions = (content: string) => {
  const postIds = new Set<string>(Array.from(content.matchAll(linkRegex), (m) => m.groups?.channel ?? ''))
  const memberIds = new Set<string>(Array.from(content.matchAll(userMention), (m) => m.groups?.user ?? ''))
  const channelIds = new Set<string>(Array.from(content.matchAll(channelMention), (m) => m.groups?.channel ?? ''))
  return { postIds, memberIds, channelIds }
}

export const fetchMentions = async (content: string) => {
  const { postIds, memberIds, channelIds } = extractMentions(content)

  // Fetch from db/cache
  const [posts, users, channels] = (await Promise.all([
    Promise.all(Array.from(postIds).map(fetchPost)),
    Promise.all(Array.from(memberIds).map(fetchUser)),
    Promise.all(Array.from(channelIds).map(fetchChannel)),
  ]))

  // Filter out null values
  const postsFiltered = posts.filter((p) => p !== null) as PostCache[]
  const usersFiltered = users.filter((u) => u !== null) as UserCache[]
  const channelsFiltered = channels.filter((c) => c !== null) as ChannelCache[]

  return { posts: postsFiltered, users: usersFiltered, channels: channelsFiltered }
}

const internalLink = (content: string, posts: PostCache[]) => {
  // Replace internal links
  content = content.replace(linkRegex, (match, guildId, channelId, _, messageId) => {
    const post = posts.find((p) => p.snowflakeId === channelId)
    if (!post) return match
    return `${getCanonicalPostUrl(post.snowflakeId)}${messageId ? `#message-${messageId}` : ''}`
  })
  return content
}

export const parseDiscordMessageBasic = async (content: string) => {
  // Get mentions
  const { users, channels, posts } = await fetchMentions(content)

  // Replace user mentions
  content = content.replace(userMention, (match, userId) => {
    const member = users.find((u) => u.snowflakeId === userId)
    const userName = sanitizeText(member?.username ?? 'Unknown User')
    return `@${userName}`
  })

  // Replace channel mentions
  content = content.replace(channelMention, (match, channelId) => {
    const channel = channels.find((c) => c.snowflakeId === channelId)

    let channelName = channel && sanitizeText(channel.name)
    if (!channelName) {
      const post = posts.find((p) => p.snowflakeId === channelId)
      channelName = post ? sanitizeText(post.title) : 'Unknown Channel'
    }
    return `#${channelName}`
  })

  // Replace internal links
  content = internalLink(content, posts)

  return content
}

export const parseDiscordMessage = async (content: string) => {
  // Get mentions
  const { users, channels, posts } = await fetchMentions(content)

  // Replace internal links
  content = internalLink(content, posts)

  // Parse the content
  const html = toHTML(content, {
    discordCallback: {
      user: (node) => {
        const user = users.find((u) => u.snowflakeId === node.id)
        if (!user) return `<i>@Unknown User</i>`
        const userName = sanitizeText(user.username)
        return `@${userName}`
      },
      channel: (node) => {
        const channel = channels.find((c) => c.snowflakeId === node.id)
        let channelName = channel && sanitizeText(channel.name)
        if (!channelName) {
          const post = posts.find((p) => p.snowflakeId === node.id)
          channelName = post ? sanitizeText(post.title) : '<i>#Unknown Channel</i>'
        }
        return `#${channelName}`
      },
    },
  })

  // Fixing some of the HTML
  const $ = load(html)

  // Links
  $('a').attr('target', '_blank').attr('rel', 'noopener nofollow ugc')

  // Code blocks
  $('pre:has(code)').addClass('d-code-block')

  // Inline code
  $('code:not(pre *)').addClass('d-code-inline')

  return $('body').html() ?? ''
}
