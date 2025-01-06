import {
  Channel,
  AnyThreadChannel,
  Message,
  APIEmbed,
  Colors,
  InteractionReplyOptions,
  InteractionResponse,
  ChatInputCommandInteraction,
  ChannelType,
} from 'discord.js'
import { env } from './env.js'
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
  const isIndexable =
    thread.createdAt !== null &&
    thread.createdAt.getTime() > START_INDEXING_AFTER
  return isIndexable
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
