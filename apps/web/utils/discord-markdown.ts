import { toHTML } from 'discord-markdown'
import { load } from 'cheerio'
import { db } from '@nextjs-forum/db/node'

export const parseDiscordMessage = async (content: string) => {
  // Mentions handling
  const memberIds = new Set<string>()
  const channelIds = new Set<string>()

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
        const userName = user?.username ?? 'Unknown User'
        return `<span class="d-mention">@${userName}</span>`
      },
      channel: (node) => {
        const channel = channels.find((c) => c.snowflakeId === node.id)
        const channelName = channel?.name ?? 'Unknown Channel'
        return `<span class="d-mention">#${channelName}</span>`
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
