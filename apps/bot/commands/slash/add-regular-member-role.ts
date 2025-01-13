import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../types.js'
import { modifyRegularMemberRoles } from '../../utils.js'

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
    return await modifyRegularMemberRoles(interaction, true)
  },
}
