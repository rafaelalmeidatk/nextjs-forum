import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../types.js'
import { replyWithEmbed } from '../../utils.js'
// import { db } from '@nextjs-forum/db/node.js'

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('refresh-answer-count')
    .setDescription(
      'Refreshes the count of answers for every user (expensive call so only use it if really necessary)'
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const embed = await replyWithEmbed(interaction, {
      title: '⌛ Processing...',
      description:
        'Your request has been queued. This might take a while to complete...',
    })
  },
}
