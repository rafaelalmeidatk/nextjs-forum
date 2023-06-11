import { toHTML } from 'discord-markdown'
import { load } from 'cheerio'

export const parseDiscordMessage = (content: string) => {
  const html = toHTML(content)
  const $ = load(html)

  // Add the necessary attributes to the links
  $('a')
    .attr('target', '_blank')
    .attr('rel', 'noopener nofollow ugc')
    .attr('class', 'd-link')

  return $('body').html() ?? ''
}
