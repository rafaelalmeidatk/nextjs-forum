import {
  ChannelType,
  Colors,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js'
import { SlashCommand } from '../types.js'
import { isMessageInForumChannel, replyWithEmbed, replyWithEmbedError } from '../../utils.js'
import { env } from '../../env.js'
import { markMessageAsSolution } from '../../db/actions/messages.js'

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('remove-post-answer')
    .setDescription('Removes the answer from a post')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

  async execute(interaction) {
    if (!interaction.channel || !isMessageInForumChannel(interaction.channel)) {
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
      interaction.user,
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
      !interactionMember.permissions.has(PermissionFlagsBits.ManageMessages) &&
      (env.HELPER_ROLE_ID
        ? !interactionMember.roles.cache.has(env.HELPER_ROLE_ID)
        : true)
    ) {
      await replyWithEmbedError(interaction, {
        description:
          'Only the post author, helpers or moderators can remove an answer from apost',
      })

      return
    }

    await markMessageAsSolution(null, interaction.channelId)

    const answeredTagId = mainChannel.availableTags.find((t) =>
      t.name.includes('Answered'),
    )?.id

    if (answeredTagId) {
      const newTags = interaction.channel.appliedTags.filter(tag => tag !== answeredTagId)
      interaction.channel.setAppliedTags(newTags)
    }

    await replyWithEmbed(interaction, {
      title: '✅ Success!',
      description:
        'This question\'s answer has been removed.',
      color: Colors.Orange,
    })

    // edit instructions message to remove the button for message url (get the first message sent by the bot)
    const instructionsMessage = (
      await interaction.channel.messages.fetch({
        cache: true,
        after: interaction.channel.id,
      })
    )
      .filter((m) => m.author.id === interaction.client.user?.id)
      .last()

    if (instructionsMessage) {
      try {
        instructionsMessage.edit({
          components: [],
        })
      } catch (err) {
        console.error('Failed to update instructions message:', err)
      }
    }
  }
}
