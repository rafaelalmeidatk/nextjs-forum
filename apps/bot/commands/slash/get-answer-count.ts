import { SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../types.ts'
import { getCorrectAnswersCount } from '../../db/actions/users.ts'

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
    await interaction.deferReply({ ephemeral: true })
    // Get the user option
    const userOption = interaction.options.getUser('user')

    // Use the ID of the user option if it's provided, otherwise use the ID of the interaction user
    const userId = userOption?.id || interaction.user.id
    const userArgProvided = !!userOption
    const count = await getCorrectAnswersCount(userId)

    // Also executes if count is 0
    if (!count) {
      await interaction.editReply({
        content: `It looks like ${
          userArgProvided
            ? 'this user is new to the forum!'
            : "you are new to the forum. Start by answering some questions and you'll see your progress here!"
        }`,
      })
      return
    }

    const guildMember = await interaction.guild?.members.fetch(userId)

    if (!guildMember) {
      await interaction.editReply({
        content: `The user is not in this server.`,
      })
      return
    }

    await interaction.editReply({
      content: `${
        userArgProvided ? `${guildMember.user.username} has` : 'You have'
      } ${count.answersCount} correct ${
        count.answersCount === 1 ? 'answer' : 'answers'
      }!`,
    })
  },
}
