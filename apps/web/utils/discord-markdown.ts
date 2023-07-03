import { toHTML } from 'discord-markdown'
import { load } from 'cheerio'
import { db } from '@nextjs-forum/db/node'
import { getCanonicalPostUrl } from './urls'
import { sanitizeText } from 'simple-markdown'

export const parseDiscordMessage = async (content: string) => {
  // Mentions handling
  const memberIds = new Set<string>()
  const channelIds = new Set<string>()

  // convert https://discord.com/channels/<guild_id>/<post_id> to https://nextjs-forum.com/posts/<post_id>
  // or https://discord.com/channels/<guild_id>/<channel_id>/<message_id> to https://nextjs-forum.com/posts/<post_id>#message-<message_id>
  const regex = /https:\/\/discord\.com\/channels\/(?<guild>\d+)\/(?<channel>\d+)(\/(?<message>\d+))?/g;
  const postIds = new Set<string>(Array.from(content.matchAll(regex), (m) => m.groups?.channel ?? ''))

  const posts =
    postIds.size > 0
      ? await db
        .selectFrom('posts')
        .select(['snowflakeId', 'title'])
        .where('snowflakeId', 'in', Array.from(postIds))
        .execute()
      : []

  // Parse the content again, this time replacing the link
  content = content.replace(regex, (match, guild, channel, _, message) => {
    const post = posts.find((p) => p.snowflakeId === channel)
    if (!post) return match
    return `${getCanonicalPostUrl(post.snowflakeId)}${message ? `#message-${message}` : ''}`
  })

  // The library doesn't allow async callbacks, so we have to do this in two steps
  toHTML(content, {
    discordOnly: true,
    discordCallback: {
      user(node) {
        memberIds.add(node.id)
        return ''
      },
      channel(node) {
        channelIds.add(node.id)
        return ''
      },
    },
  })

  const users =
    memberIds.size > 0
      ? await db
        .selectFrom('users')
        .select(['snowflakeId', 'username'])
        .where('snowflakeId', 'in', Array.from(memberIds))
        .execute()
      : []

  const channels =
    channelIds.size > 0
      ? await db
        .selectFrom('channels')
        .select(['snowflakeId', 'name'])
        .where('snowflakeId', 'in', Array.from(channelIds))
        .execute()
      : []

  // Parse the content again, this time replacing the nodes and the rest of the stuff
  const html = toHTML(content, {
    discordCallback: {
      user: (node) => {
        const user = users.find((u) => u.snowflakeId === node.id)
        const userName = sanitizeText(user?.username) ?? 'Unknown User'
        return `@${userName}`
      },
      channel: (node) => {
        const channel = channels.find((c) => c.snowflakeId === node.id)
        const channelName = sanitizeText(channel?.name) ?? 'Unknown Channel'
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
