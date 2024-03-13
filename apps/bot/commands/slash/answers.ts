import { SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../types.js'
import { getCorrectAnswersCount } from '../../db/actions/users.js'

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('get-answer-count')
    .setDescription('Get the count of your correct answers'),

  async execute(interaction) {
    const { id: userId } = interaction.user
    const count = await getCorrectAnswersCount(userId)
    if (!count) return

    await interaction.reply({
      content: `You have ${count.answersCount} correct answers.`,
      ephemeral: true,
    })
  },
}
