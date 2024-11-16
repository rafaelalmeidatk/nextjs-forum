import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../types.js'
import { removeFullPointsFromUser, syncUser } from '../../db/actions/users.js'
import { tryToSetRegularMemberRole } from '../../lib/points.js'

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('revoke-regular-member-role')
    .setDescription('Remove the Regular Member role from the target user')
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to be stripped of the role')
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
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
    await removeFullPointsFromUser(user.id)
    await tryToSetRegularMemberRole(guildMember, true)

    await interaction.editReply({ content: 'Done!' })
  },
}
