import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../types.ts'
import { addFullPointsToUser, syncUser } from '../../db/actions/users.ts'
import { tryToSetRegularMemberRole } from '../../lib/points.ts'

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('add-regular-member-role')
    .setDescription('Add the Regular Member role to the target user')
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to receive the role')
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
    await addFullPointsToUser(user.id)
    await tryToSetRegularMemberRole(guildMember, true)

    await interaction.editReply({ content: 'Done!' })
  },
}
