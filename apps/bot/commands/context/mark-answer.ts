import {
  ApplicationCommandType,
  ChannelType,
  ContextMenuCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js'
import { ContextMenuCommand } from '../types.js'
import { isMessageInForumChannel, isMessageSupported } from '../../utils.js'
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
      await interaction.reply({
        ephemeral: true,
        content: 'This command can only be used in a forum channel',
      })

      return
    }

    const mainChannel = interaction.channel.parent
    if (!mainChannel) {
      await interaction.reply({
        ephemeral: true,
        content:
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
    await interaction.reply({
      content:
        '✅ This question has been marked as answered! If you have any other questions, feel free to create another post',
    })
  },
}
