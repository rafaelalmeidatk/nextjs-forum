import { SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../types.js'
import {
  getCorrectAnswersCount,
  isUserProfilePublic,
} from '../../db/actions/users.js'
import { env } from '../../env.js'
export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('get-answer-count')
    .setDescription('Get the number of your accepted answers'),

  async execute(interaction) {
    const { id: userId } = interaction.user
    const count = await getCorrectAnswersCount(userId)
    if (!count) {
      await interaction.reply({
        content: `It looks like you're new to the forum! Start by answering some questions and you'll see your progress here. `,
        ephemeral: true,
      })
      return
    }
    const guildMember = await interaction.guild?.members.fetch(
      interaction.user.id,
    )

    if (!guildMember) {
      await interaction.reply({
        content: `I couldn't find the guild member from this user`,
        ephemeral: true,
      })
      return
    }
    const isProfilePublic = await isUserProfilePublic(guildMember)
    console.log(isProfilePublic)
    await interaction.reply({
      content: `You have ${count.answersCount} correct answers.`,
      ephemeral: isProfilePublic,
    })
  },
}
