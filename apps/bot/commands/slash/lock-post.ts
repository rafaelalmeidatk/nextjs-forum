import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../types.js'
import { LockPostWithReason } from '../../utils.js'

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('lock-post')
    .setDescription('Locks a post and sends a message explaining the reason')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads),

  async execute(interaction) {
    await LockPostWithReason(
      interaction,
      'This post has been locked by a moderator. If you have any questions, feel free to reach out to the moderation team.',
    )
  },
}
