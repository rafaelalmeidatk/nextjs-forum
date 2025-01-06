import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../types.js'
import { modifyRegularMemberRoles } from '../../utils.js'

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
    await modifyRegularMemberRoles(interaction, false)
  },
}
