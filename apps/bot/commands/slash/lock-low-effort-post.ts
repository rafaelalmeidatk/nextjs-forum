import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { dedent } from 'ts-dedent'
import { SlashCommand } from '../types.js'
import { LockPostWithReason } from '../../utils.js'
import { env } from '../../env.js'

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('lock-low-effort-post')
    .setDescription('Locks a post and sends a message explaining the reason')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads),

  async execute(interaction) {
    await LockPostWithReason(
      interaction,
      dedent`
            This post has been locked because it was considered low-effort by the moderation team. We encourage you to create a new post, keeping in mind the guidelines described here: ${env.GUIDELINES_MESSAGE}

            Try to add as much information possible in your question, describing your objective and what you have tried doing to solve it. This helps our members to understand better the question and give a better and faster answer. If you have any questions, feel free to reach out to the moderation team.
          `,
    )
  },
}
