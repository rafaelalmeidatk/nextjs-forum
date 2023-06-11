import { toHTML } from 'discord-markdown'
import { load } from 'cheerio'

export const parseDiscordMessage = (content: string) => {
  const html = toHTML(content)
  const $ = load(html)

  // Links
  $('a').attr('target', '_blank').attr('rel', 'noopener nofollow ugc')

  // Code blocks
  $('pre:has(code)').addClass('d-code-block')

  // Inline code
  $('code:not(pre *)').addClass('d-code-inline')

  return $('body').html() ?? ''
}
