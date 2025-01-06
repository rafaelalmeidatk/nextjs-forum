import {
  ApplicationCommandType,
  ButtonStyle,
  ChannelType,
  Colors,
  ComponentType,
  ContextMenuCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js'
import { ContextMenuCommand } from '../types.js'
import {
  checkInvalidAnswer,
  isMessageSupported,
  replyWithEmbed,
  replyWithEmbedError,
} from '../../utils.js'
import { markMessageAsSolution } from '../../db/actions/messages.js'
import { env } from '../../env.js'
import { tryToSetRegularMemberRole } from '../../lib/points.js'

export const command: ContextMenuCommand = {
  data: new ContextMenuCommandBuilder()
    .setName('Mark Solution')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .setType(ApplicationCommandType.Message),

  async execute(interaction) {
    if (!isMessageSupported(interaction.targetMessage)) {
      await replyWithEmbedError(interaction, {
        description:
          "This type of message is not supported. Make sure the author isn't a bot and the post is indexed",
      })

      return
    }

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
          'Only the post author, helpers or moderators can mark a message as the answer',
      })

      return
    }

    if (interaction.targetId === interaction.channelId) {
      await replyWithEmbedError(interaction, {
        description:
          "You can't mark the post itself as the answer. If you figured out the issue by yourself, please send it as a separate message and mark it as the answer",
      })

      return
    }

    await markMessageAsSolution(
      interaction.targetMessage.id,
      interaction.channelId,
    )

    const targetMember = await interaction.guild?.members.fetch(
      interaction.targetMessage.author.id,
    )
    if (targetMember) {
      await tryToSetRegularMemberRole(interactionMember)
    }

    const answeredTagId = mainChannel.availableTags.find((t) =>
      t.name.includes('Answered'),
    )?.id

    if (answeredTagId) {
      const newTags = Array.from(
        new Set([...channel.appliedTags, answeredTagId]),
      )
      await channel.setAppliedTags(newTags)
    }

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
    await interaction.targetMessage.react('✅')

    // edit instructions message to add the button for message url (get the first message sent by the bot)
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
          components: [
            {
              type: ComponentType.ActionRow,
              components: [
                {
                  type: ComponentType.Button,
                  style: ButtonStyle.Link,
                  label: 'Jump to Answer',
                  url: interaction.targetMessage.url,
                },
              ],
            },
          ],
        })
      } catch (err) {
        console.error('Failed to update instructions message:', err)
      }
    }

    // if the message author is the post creator, notify mods to ensure its a genuine solution
    if (
      interaction.targetMessage.author.id === channel.ownerId &&
      interaction.user.id === channel.ownerId
    ) {
      if (env.MOD_LOG_CHANNEL_ID) {
        const modLogChannel = interaction.client.channels.cache.get(
          env.MOD_LOG_CHANNEL_ID,
        )
        if (!modLogChannel?.isTextBased()) return

        await modLogChannel.send({
          content: `OP self marked their message: ${interaction.targetMessage.url}`,
        })
      }
    }
  },
}
