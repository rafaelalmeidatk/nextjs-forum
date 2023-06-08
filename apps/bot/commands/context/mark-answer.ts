import {
  ApplicationCommandType,
  ChannelType,
  Colors,
  ContextMenuCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js'
import { ContextMenuCommand } from '../types.js'
import {
  isMessageInForumChannel,
  isMessageSupported,
  replyWithEmbed,
  replyWithEmbedError,
} from '../../utils.js'
import { markMessageAsSolution } from '../../db/actions/messages.js'

export const command: ContextMenuCommand = {
  data: new ContextMenuCommandBuilder()
    .setName('Mark Solution')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .setType(ApplicationCommandType.Message),

  async execute(interaction) {
    if (
      !interaction.channel ||
      !isMessageInForumChannel(interaction.channel) ||
      !isMessageSupported(interaction.targetMessage)
    ) {
      await replyWithEmbedError(interaction, {
        description:
          'This command can only be used in a supported forum channel',
      })

      return
    }

    const mainChannel = interaction.channel.parent
    if (!mainChannel) {
      await replyWithEmbedError(interaction, {
        description:
          'Could not find the parent channel, please try again later. If this issue persists, contact a staff member',
      })

      return
    }

    if (mainChannel.type !== ChannelType.GuildForum) {
      await interaction.reply({
        ephemeral: true,
        content: 'The parent channel is not a forum channel',
      })

      return
    }

    const interactionMember = await interaction.guild?.members.fetch(
      interaction.user
    )
    if (!interactionMember) {
      await replyWithEmbedError(interaction, {
        description:
          'Could not find your info in the server, please try again later. If this issue persists, contact a staff member',
      })

      return
    }

    if (
      interaction.channel.ownerId !== interaction.user.id &&
      !interactionMember.permissions.has(PermissionFlagsBits.ManageMessages)
    ) {
      await replyWithEmbedError(interaction, {
        description: `Only the post author or moderators can mark a message as the answer`,
      })

      return
    }

    const answeredTagId = mainChannel.availableTags.find((t) =>
      t.name.includes('Answered')
    )?.id

    if (answeredTagId) {
      const newTags = Array.from(
        new Set([...interaction.channel.appliedTags, answeredTagId])
      )
      interaction.channel.setAppliedTags(newTags)
    }

    await markMessageAsSolution(
      interaction.targetMessage.id,
      interaction.channelId
    )

    await replyWithEmbed(interaction, {
      title: '✅ Success!',
      description:
        'This question has been marked as answered! If you have any other questions, feel free to create another post',
      color: Colors.Green,
      fields: [
        {
          name: 'Jump to answer',
          value: `[Click here](${interaction.targetMessage.url})`,
          inline: true,
        },
      ],
    })
  },
}
