import { Colors, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { dedent } from 'ts-dedent'
import { SlashCommand } from '../types.js'
import { replyWithEmbedError } from '../../utils.js'

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('lock-low-effort-post')
    .setDescription('Locks a post and sends a message explaining the reason')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads),

  async execute(interaction) {
    if (!interaction.channel?.isThread()) {
      await replyWithEmbedError(interaction, {
        description: 'This command can only be used in a thread/forum post',
      })
      return
    }

    interaction.reply({ content: 'Ok!', ephemeral: true })

    await interaction.channel.setLocked(true)
    await interaction.channel.send({
      embeds: [
        {
          color: Colors.Blue,
          title: '🔒 Post Locked',
          description: dedent`
            This post has been locked because it was considered low-effort by the moderation team. We encourage you to create a new post, keeping in mind the guidelines described here: https://discord.com/channels/752553802359505017/1138338531983491154

            Try to add as much information possible in your question, describing your objective and what you have tried doing to solve it. This helps our members to understand better the question and give a better and faster answer. If you have any questions, feel free to reach out to the moderation team.
          `,
        },
      ],
    })
  },
}
