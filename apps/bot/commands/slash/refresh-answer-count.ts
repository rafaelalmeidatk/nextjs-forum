import { Colors, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../types.ts'
import { replyWithEmbed } from '../../utils.ts'
import { db } from '@nextjs-forum/db/node'

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('refresh-answer-count')
    .setDescription(
      'Refreshes the count of answers for every user (expensive call so only use it if really necessary)',
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
      await db
        .updateTable('users')
        .set({
          answersCount: (eb) =>
            eb
              .selectFrom('posts')
              .select(eb.fn.countAll<number>().as('count'))
              .innerJoin('messages', (join) =>
                join
                  .onRef('messages.snowflakeId', '=', 'posts.answerId')
                  .onRef('messages.userId', '=', 'users.snowflakeId'),
              ),
        })
        .execute()

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
