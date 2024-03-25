import { SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../types.js'
import {
  getCorrectAnswersCount,
  isUserProfilePublic,
} from '../../db/actions/users.js'

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('get-answer-count')
    .setDescription('Get the number of your accepted answers')
    .addUserOption((user) =>
      user
        .setName('user')
        .setDescription('The user to get number of marked answers for')
        .setRequired(false),
    )
    .setDMPermission(false),

  async execute(interaction) {
    // Get the user option
    const userOption = interaction.options.getUser('user')

    // Use the ID of the user option if it's provided, otherwise use the ID of the interaction user
    const userId = userOption ? userOption.id : interaction.user.id
    const userArgProvided = !!userOption
    const count = await getCorrectAnswersCount(userId)
    if (!count) {
      await interaction.reply({
        content: `It looks like ${
          userArgProvided ? 'this user is' : 'you are'
        } new to the forum! Start by answering some questions and you'll see your progress here.`,
        ephemeral: true,
      })
      return
    }

    const guildMember = await interaction.guild?.members.fetch(userId)

    if (!guildMember) {
      await interaction.reply({
        content: `I couldn't find the guild member from this user`,
        ephemeral: true,
      })
      return
    }

    const isProfilePublic = await isUserProfilePublic(guildMember)
    if (!isProfilePublic && userArgProvided) {
      await interaction.reply({
        content: `This user's profile is private.`,
        ephemeral: true,
      })
      return
    }

    await interaction.reply({
      content: `${userArgProvided ? 'This user has' : 'You have'} ${
        count.answersCount
      } correct answers.`,
      ephemeral: !isProfilePublic,
    })
  },
}
