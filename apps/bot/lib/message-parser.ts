import { Message } from 'discord.js'
import { getUserById } from '../db/actions/users.js'

const regexForMentionId = (id: string) => new RegExp(`<@${id}>`, 'g')
const regexForChannelId = (id: string) => new RegExp(`<#${id}>`, 'g')
const regexForRoleId = (id: string) => new RegExp(`<@&${id}>`, 'g')

export const parseMessageContent = async (message: Message) => {
  let { content } = message

  for (const [id] of message.mentions.members ?? []) {
    const user = await getUserById(id)
    const username = user?.username ?? 'unknown_user'
    content = content.replace(regexForMentionId(id), `@${username}`)
  }

  for (const [id] of message.mentions.channels) {
    const channel = await message.guild?.channels.fetch(id)
    const channelName = channel?.name ?? 'unknown_channel'
    content = content.replace(regexForChannelId(id), `#${channelName}`)
  }

  for (const [id] of message.mentions.roles) {
    const role = await message.guild?.roles.fetch(id)
    const roleName = role?.name ?? 'unknown_role'
    content = content.replace(regexForRoleId(id), `@${roleName}`)
  }

  return content
}
