import {
  AnyThreadChannel,
  APIEmbed,
  Channel,
  ChannelType,
  ChatInputCommandInteraction,
  Colors,
  InteractionReplyOptions,
  InteractionResponse,
  Message,
  MessageContextMenuCommandInteraction,
} from 'discord.js'
import { env } from './env.js'
import {
  addFullPointsToUser,
  removeFullPointsFromUser,
  syncUser,
} from './db/actions/users.js'
import { tryToSetRegularMemberRole } from './lib/points.js'
import { unindexPost } from './db/actions/posts.js'

const START_INDEXING_AFTER = 1686438000000

export const isMessageInForumChannel = (
  channel: Channel,
): channel is AnyThreadChannel<true> => {
  return (
    channel.isThread() &&
    channel.parentId !== null &&
    env.INDEXABLE_CHANNEL_IDS.includes(channel.parentId)
  )
}

export const isMessageSupported = (message: Message) => {
  const isIndexable = message.createdAt.getTime() > START_INDEXING_AFTER
  return !message.author.bot && !message.system && isIndexable
}

export const isThreadSupported = (thread: AnyThreadChannel<true>) => {
  return (
    thread.createdAt !== null &&
    thread.createdAt.getTime() > START_INDEXING_AFTER
  )
}

export const isThreadInForumChannel = (thread: AnyThreadChannel<true>) => {
  return (
    thread.parentId !== null &&
    env.INDEXABLE_CHANNEL_IDS.includes(thread.parentId)
  )
}

type Replyable = {
  reply: (content: InteractionReplyOptions) => Promise<InteractionResponse>
}

export const replyWithEmbed = (
  replyable: Replyable,
  { color = Colors.Blue, ...opts }: APIEmbed,
) => {
  return replyable.reply({
    embeds: [
      {
        color,
        ...opts,
      },
    ],
  })
}

export const replyWithEmbedError = (
  replyable: Replyable,
  { title = '❌ Error!', color = Colors.Red, ...opts }: APIEmbed,
) => {
  return replyable.reply({
    ephemeral: true,
    embeds: [
      {
        title,
        color,
        ...opts,
      },
    ],
  })
}

export const LockPostWithReason = async (
  interaction: ChatInputCommandInteraction,
  reason: string,
) => {
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

  await interaction.reply({ content: 'Ok!', ephemeral: true })

  await interaction.channel.setLocked(true)
  await interaction.channel.send({
    embeds: [
      {
        color: Colors.Blue,
        title: '🔒 Post Locked',
        description: reason,
      },
    ],
  })
  await unindexPost(interaction.channel)
}

export const modifyRegularMemberRoles = async (
  interaction: ChatInputCommandInteraction,
  shouldAddPoints: boolean,
) => {
  const user = interaction.options.getUser('user', true)

  const guildMember = await interaction.guild?.members.fetch(user.id)

  if (!guildMember) {
    await interaction.reply({
      content: "I couldn't find the guild member from this user",
      ephemeral: true,
    })
    return
  }

  await interaction.deferReply({ ephemeral: true })

  await syncUser(user, guildMember)
  if (shouldAddPoints) {
    await addFullPointsToUser(user.id)
  } else {
    await removeFullPointsFromUser(user.id)
  }
  await tryToSetRegularMemberRole(guildMember, true)

  await interaction.editReply({ content: 'Done!' })
}

export const checkInvalidAnswer = async (
  interaction:
    | ChatInputCommandInteraction
    | MessageContextMenuCommandInteraction,
) => {
  if (!interaction.channel || !isMessageInForumChannel(interaction.channel)) {
    await replyWithEmbedError(interaction, {
      description: 'This command can only be used in a supported forum channel',
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
  const channel = interaction.channel as AnyThreadChannel<true>
  return { channel, interactionMember, mainChannel }
}
