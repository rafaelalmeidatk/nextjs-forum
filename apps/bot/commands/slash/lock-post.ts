import {
  ChannelType,
  Colors,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js'
import { SlashCommand } from '../types.js'
import { replyWithEmbedError } from '../../utils.js'
import { unindexPost } from '../../db/actions/posts.js'

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('lock-post')
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

    const mainChannel = interaction.channel.parent
    if (mainChannel && mainChannel.type === ChannelType.GuildForum) {
      const lockedTagId = mainChannel.availableTags.find((t) =>
        t.name.includes('Locked'),
      )?.id

      if (lockedTagId) {
        const newTags = Array.from(
          new Set([...interaction.channel.appliedTags, lockedTagId]),
        )
        interaction.channel.setAppliedTags(newTags)
      }
    }

    interaction.reply({ content: 'Ok!', ephemeral: true })

    await interaction.channel.setLocked(true)
    await interaction.channel.send({
      embeds: [
        {
          color: Colors.Blue,
          title: '🔒 Post Locked',
          description:
            'This post has been locked by a moderator. If you have any questions, feel free to reach out to the moderation team.',
        },
      ],
    })

    await unindexPost(interaction.channel)
  },
}
