import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../types.js'
import { addDirectPointsToUser, syncUser } from '../../db/actions/users.js'
import { tryToAssignRegularMemberRole } from '../../lib/points.js'

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('give-points')
    .setDescription('Gives a specific amount of points to the target user')
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to receive the points')
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName('points')
        .setDescription('The amount of point to give')
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user', true)
    const points = interaction.options.getInteger('points', true)

    const guildMember = await interaction.guild?.members.fetch(user.id)

    if (!guildMember) {
      await interaction.reply({
        content: "I couldn't find the guild member from this user",
        ephemeral: true,
      })
      return
    }

    await syncUser(user, guildMember)
    await addDirectPointsToUser(user.id, points)
    await tryToAssignRegularMemberRole(guildMember, true)

    interaction.reply({ content: 'Done!', ephemeral: true })
  },
}
