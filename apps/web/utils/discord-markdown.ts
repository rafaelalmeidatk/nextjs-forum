import { toHTML } from 'discord-markdown'
import { load } from 'cheerio'

export const parseDiscordMessage = (content: string) => {
  const html = toHTML(content)
  const $ = load(html)

  // Links
  $('a')
    .attr('target', '_blank')
    .attr('rel', 'noopener nofollow ugc')
    .addClass('d-link')

  // Code blocks
  $('pre:has(code)').addClass('d-code-block')

  return $('body').html() ?? ''
}
