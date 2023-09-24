import { Colors, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../types.js'
import { replyWithEmbed } from '../../utils.js'
import { db, sql } from '@nextjs-forum/db/node'

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('refresh-last-active')
    .setDescription(
      'Refreshes the last active time for every post (expensive call so only use it if really necessary)',
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    await replyWithEmbed(interaction, {
      title: '⌛ Processing...',
      description:
        'Your request has been queued. This might take a while to complete...',
    })

    try {
      // update posts with lastmod time
      const posts = await db
        .selectFrom('posts')
        .select([
          'posts.snowflakeId',
          sql<Date>`MAX(IFNULL(posts.editedAt, posts.createdAt))`.as('lastModTime'),
          sql<Date>`MAX(IFNULL(messages.editedAt, messages.createdAt))`.as(
            'lastMessageModTime',
          ),
        ])
        .leftJoin('messages', 'posts.snowflakeId', 'messages.postId')
        .groupBy('posts.snowflakeId')
        .execute()

      for (const post of posts) {
        const lastActive = post.lastMessageModTime > post.lastModTime ? post.lastMessageModTime : post.lastModTime
        db
          .updateTable('posts')
          .where('posts.snowflakeId', '=', post.snowflakeId)
          .set({ lastActiveAt: lastActive })
          .execute()
      }

      await interaction.editReply({
        embeds: [
          {
            title: '✅ Success!',
            description: 'The answer count of the users has been updated',
            color: Colors.Green,
          },
        ],
      })
    } catch (err) {
      const description = err instanceof Error ? err.message : 'Unknown reason'

      await interaction.editReply({
        embeds: [
          {
            title: 'Error',
            description,
          },
        ],
      })
    }
  },
}
