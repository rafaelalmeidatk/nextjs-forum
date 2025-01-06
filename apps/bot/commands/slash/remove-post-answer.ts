import { Colors, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../types.js'
import {
  checkInvalidAnswer,
  replyWithEmbed,
  replyWithEmbedError,
} from '../../utils.js'
import { env } from '../../env.js'
import { markMessageAsSolution } from '../../db/actions/messages.js'

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('remove-post-answer')
    .setDescription('Removes the answer from a post')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

  async execute(interaction) {
    const isValidAnswer = await checkInvalidAnswer(interaction)
    if (!isValidAnswer) return
    const { channel, interactionMember, mainChannel } = isValidAnswer

    if (
      channel.ownerId !== interaction.user.id &&
      !interactionMember.permissions.has(PermissionFlagsBits.ManageMessages) &&
      (env.HELPER_ROLE_ID
        ? !interactionMember.roles.cache.has(env.HELPER_ROLE_ID)
        : true)
    ) {
      await replyWithEmbedError(interaction, {
        description:
          'Only the post author, helpers or moderators can remove an answer from a post',
      })

      return
    }

    await markMessageAsSolution(null, interaction.channelId)

    const answeredTagId = mainChannel.availableTags.find((t) =>
      t.name.includes('Answered'),
    )?.id

    if (answeredTagId) {
      const newTags = channel.appliedTags.filter((tag) => tag !== answeredTagId)
      await channel.setAppliedTags(newTags)
    }

    await replyWithEmbed(interaction, {
      title: '✅ Success!',
      description: "This question's answer has been removed.",
      color: Colors.Orange,
    })

    // edit instructions message to remove the button for message url (get the first message sent by the bot)
    const instructionsMessage = (
      await channel.messages.fetch({
        cache: true,
        after: channel.id,
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
  },
}
